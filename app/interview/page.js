'use client';

import { useInterviewStore } from '@/store/interviewStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InterviewScreen from '@/components/InterviewScreen';

export default function InterviewPage() {
  const { resumeText, jobDescription, status } = useInterviewStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if no data
    if (!resumeText || !jobDescription) {
      router.push('/');
    }
  }, [resumeText, jobDescription, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Interviewer</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Live Session</span>
        </header>

        <InterviewScreen />
      </div>
    </div>
  );
}
