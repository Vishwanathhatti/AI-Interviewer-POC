'use client';

import { useInterviewStore } from '@/store/interviewStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResultPage() {
  const { evaluation, resetInterview } = useInterviewStore();
  const router = useRouter();

  useEffect(() => {
    if (!evaluation) {
      // If no evaluation, maybe redirect home or just show empty
     // router.push('/');
    }
  }, [evaluation, router]);

  const handleHome = () => {
    resetInterview();
    router.push('/');
  };

  if (!evaluation) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700">No Evaluation Found</h2>
                <button onClick={handleHome} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go Home</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Interview Results</h1>
        
        {/* Score */}
        <div className="flex items-center gap-6">
            <div className={`text-6xl font-extrabold ${evaluation.score >= 7 ? 'text-green-600' : evaluation.score >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                {evaluation.score}/10
            </div>
            <div>
                <h3 className="text-xl font-semibold">Overall Score</h3>
                <p className="text-gray-500">Based on your answers and relevance.</p>
            </div>
        </div>

        {/* Feedback */}
        <div className="bg-blue-50 p-6 rounded-lg text-blue-900">
            <h3 className="font-bold mb-2">Feedback</h3>
            <p>{evaluation.feedback}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div>
                <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">💪</span> Strengths
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {evaluation.strengths?.map((str, i) => <li key={i}>{str}</li>)}
                </ul>
            </div>

            {/* Weaknesses */}
            <div>
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">🚩</span> Areas for Improvement
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {evaluation.weaknesses?.map((weak, i) => <li key={i}>{weak}</li>)}
                </ul>
            </div>
        </div>

        <div className="pt-8 border-t flex justify-end">
            <button 
                onClick={handleHome}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                Start New Interview
            </button>
        </div>
      </div>
    </div>
  );
}
