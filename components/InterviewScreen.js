'use client';

import { useState, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import { useRouter } from 'next/navigation';

export default function InterviewScreen() {
    const { 
        chatHistory, 
        resumeText, 
        jobDescription, 
        addChatMessage,
        status, 
        setStatus,
        evaluation,
        setEvaluation,
        difficulty 
    } = useInterviewStore();

    const { 
        isListening, 
        transcript, 
        startListening, 
        stopListening, 
        hasRecognition 
    } = useSpeechRecognition();

    const { speak, isSpeaking, cancel: cancelSpeech } = useSpeechSynthesis();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const bottomRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, transcript]);

    // Initial Greeting
    useEffect(() => {
        if (status === 'interviewing' && chatHistory.length === 0 && !isProcessing) {
            handleSend("Please start the interview."); 
        }
    }, [status]);

    const handleSend = async (textOverride) => {
        const text = textOverride || transcript;
        if (!text && !textOverride) return;

        // Add user message to UI
        if (!textOverride) {
            addChatMessage({ role: 'user', content: text });
        }
        
        setIsProcessing(true);
        stopListening(); // Stop listening while processing

        try {
            const res = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    history: chatHistory, 
                    resumeText, 
                    jobDescription,
                    difficulty 
                })
            });

            if (!res.ok) throw new Error('API request failed');
            
            const data = await res.json();
            const aiResponse = data.text;

            // Add AI message
            addChatMessage({ role: 'model', content: aiResponse });
            
            // Speak AI response
            speak(aiResponse);

        } catch (error) {
            console.error(error);
            alert("Failed to get response from AI");
            setIsProcessing(false);
        } finally {
            setIsProcessing(false); 
            // Note: We don't auto-start listening after AI speaks to avoid capturing Echo. 
            // User manually clicks to reply.
        }
    };

    const handleStopRecording = () => {
        stopListening();
        handleSend(); // Send whatever is in transcript
    };

    const handleEndInterview = async () => {
        setIsProcessing(true);
        cancelSpeech();
        stopListening();

        try {
            const res = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    history: chatHistory, 
                    jobDescription 
                })
            });
            
            if (res.ok) {
                const evalData = await res.json();
                setEvaluation(evalData);
                setStatus('completed');
                router.push('/result');
            } else {
                alert("Failed to generate evaluation.");
                // Provide fallback or force exit
                setStatus('completed');
                router.push('/');
            }
        } catch (e) {
            console.error(e);
            alert(`Error ending interview: ${e.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!hasRecognition) {
        return <div className="p-8 text-center text-red-500">Browser does not support Speech Recognition. Please use Chrome.</div>;
    }

    return (
        <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-lg ${
                            msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                
                {/* Real-time transcript preview */}
                {isListening && transcript && (
                    <div className="flex justify-end opacity-50">
                        <div className="max-w-[80%] p-4 rounded-lg bg-blue-400 text-white rounded-br-none italic">
                            {transcript}...
                        </div>
                    </div>
                )}
                
                {isProcessing && (
                     <div className="flex justify-start opacity-70">
                        <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
                            AI is thinking...
                        </div>
                    </div>
                )}
                
                <div ref={bottomRef} />
            </div>

            {/* Controls */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
                <button 
                    onClick={handleEndInterview}
                    className="px-4 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50"
                >
                    End Interview
                </button>

                <div className="flex items-center gap-4">
                     {isListening ? (
                        <button 
                            onClick={handleStopRecording}
                            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center animate-pulse text-white shadow-lg"
                        >
                            {/* Stop Icon */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4z" /></svg>
                        </button>
                     ) : (
                        <button 
                            onClick={startListening}
                            disabled={isProcessing || isSpeaking}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                                (isProcessing || isSpeaking) 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                            }`}
                        >
                            {/* Mic Icon */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                     )}
                </div>

                <div className="w-24 text-center text-sm text-gray-500">
                    {isListening ? "Listening..." : isProcessing ? "Thinking..." : isSpeaking ? "Speaking..." : "Tap to Speak"}
                </div>
            </div>
        </div>
    );
}
