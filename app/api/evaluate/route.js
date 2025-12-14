import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req) {
  try {
    const { history, jobDescription } = await req.json();

    if (!model) {
        return NextResponse.json({ error: 'Gemini API not configured' }, { status: 503 });
    }

    const evaluationPrompt = `
      You are an expert interviewer. Evaluate the following interview for the position of: ${jobDescription}.
      
      Chat History:
      ${JSON.stringify(history)}

      Please provide a structured evaluation in JSON format with the following fields:
      - score (0-10)
      - strengths (array of strings)
      - weaknesses (array of strings)
      - feedback (overall summary string)
      
      Do not include markdown formatting (like \`\`\`json). Just return the raw JSON object.
    `;

    const result = await model.generateContent(evaluationPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown if present (Gemini sometimes adds it)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        const evaluation = JSON.parse(jsonStr);
        return NextResponse.json(evaluation);
    } catch (e) {
        console.error("Failed to parse JSON evaluation", text);
        return NextResponse.json({ error: 'Failed to parse evaluation' }, { status: 500 });
    }

  } catch (error) {
    console.error('Evaluation API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
