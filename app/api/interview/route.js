import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req) {
  try {
    const { history, resumeText, jobDescription, difficulty = 'Medium' } = await req.json();

    if (!model) {
        return NextResponse.json({ error: 'Gemini API not configured' }, { status: 503 });
    }

    const systemPrompt = `
      You are an expert technical interviewer. 
      You are conducting a job interview for the following Role: ${jobDescription}.
      The candidate's Resume is: ${resumeText}.
      
      Interview Difficulty Level: ${difficulty}

      Your goal is to assess the candidate's skills, experience, and cultural fit.
      
      Instructions:
      1. Ask one clear question at a time.
      2. Adjust the complexity of your questions to match the '${difficulty}' level.
         - Easy: Basic concepts, standard behavioral questions.
         - Medium: Application of concepts, scenario-based.
         - Hard: Edge cases, system design, deep technical details.
      3. Based on the candidate's previous answer (if any), follow up or move to the next relevant topic.
      4. Keep your responses concise (under 3 sentences) and conversational.
      5. If this is the start (history is empty), introduce yourself briefly and ask the first question (e.g., "Tell me about yourself").
      6. Do not output markdown or lists unless necessary for code questions.
      7. Maintain a professional but encouraging tone.
    `;

    // Convert history to Gemini format (user/model)
    // History from client: [{ role: 'user'|'model', content: '...' }]
    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to conduct the interview. I will introduce myself and ask the first question." }]
            },
            ...chatHistory
        ],
    });

    // If history is empty, we just triggered the system prompt setup above, so we need to generate the first message.
    // If history is NOT empty, the last message must be from the user (their answer).
    // EXCEPT: startChat history includes the system prompt "user" message.
    // So if existing history is empty, we need to send a "Start Interview" signal or just let the model generate the next turn.
    // However, Gemini startChat expects the history to alternate.
    // Our injection above ensures alternation: User(Prompt) -> Model(Ack) -> ...Real History...
    
    // If the real history is empty, we need to prompt the model to start.
    // If the real history ends with model (shouldn't happen), error.
    // If the real history ends with user (answer), we send an empty message? No, we send the answer.
    
    // Wait, the `history` passed in `startChat` implies *past* turns.
    // To get a *new* response, we call `sendMessage`.
    
    let messageToSend = "";
    if (history.length === 0) {
        messageToSend = "Please start the interview.";
    } else {
        // The last message in 'history' array was the user's answer.
        // We should NOT include it in the `history` of `startChat` AND send it.
        // We should exclude the last user message from `history` config and send it via `sendMessage`.
        const lastMsg = history[history.length - 1];
        if (lastMsg.role === 'user') {
            messageToSend = lastMsg.content;
            // Remove last user message from the history array passed to startChat
            chatHistory.pop(); 
            // NOTE: We must ensure history remains alternating. 
            // If we pop the last user message, the previous one was model. Correct.
        } else {
            // Last message was model?? User must answer.
            return NextResponse.json({ error: 'Waiting for user answer' }, { status: 400 });
        }
    }

    // Re-initialize chat with corrected history
    const finalHistory = [
        {
            role: "user",
            parts: [{ text: systemPrompt }]
        },
        {
            role: "model",
            parts: [{ text: "Understood. I am ready to conduct the interview." }]
        },
        ...chatHistory
    ];

    const newChat = model.startChat({ history: finalHistory });

    const result = await newChat.sendMessage(messageToSend);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error) {
    console.error('Interview API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
