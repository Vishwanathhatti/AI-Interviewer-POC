'use client';

import { useState } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import { useRouter } from 'next/navigation';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const { setResumeText, setJobDescription, setStatus, setDifficulty, difficulty } = useInterviewStore();
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStart = async () => {
    if (!file || !jd) {
      alert('Please upload a resume and enter a job description.');
      return;
    }

    setLoading(true);
    try {
      // 1. Parse Resume
      const formData = new FormData();
      formData.append('file', file);

      const parseRes = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) throw new Error('Failed to parse resume');
      const { text: resumeText } = await parseRes.json();

      // 2. Store in Zustand
      setResumeText(resumeText);
      setJobDescription(jd);
      setStatus('interviewing');

      // 3. Navigate to Interview Page (we'll creating this next)
      // For now, let's just log it or maybe redirect to a tentative path
      router.push('/interview'); 
      console.log('Resume Text:', resumeText);
      console.log('JD:', jd);
      alert('Ready to start interview! (Next step: AI Implementation)');
      
    } catch (error) {
      console.error(error);
      alert('Error processing input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Start Interview</h2>
      
      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF/DOCX)</label>
        <input 
          type="file" 
          accept=".pdf,.docx" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-black"
          placeholder="Paste the job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
      </div>

      {/* Difficulty Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Interview Difficulty</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          loading 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
        }`}
      >
        {loading ? 'Processing...' : 'Start Interview'}
      </button>
    </div>
  );
}
