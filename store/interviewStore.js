import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useInterviewStore = create(
  persist(
    (set) => ({
      resumeText: '',
      jobDescription: '',
      chatHistory: [],
      evaluation: null,
      status: 'idle', // 'idle' | 'interviewing' | 'completed'
      difficulty: 'Medium', // 'Easy' | 'Medium' | 'Hard'

      setResumeText: (text) => set({ resumeText: text }),
      setJobDescription: (text) => set({ jobDescription: text }),
      setDifficulty: (level) => set({ difficulty: level }),
      addChatMessage: (message) => set((state) => ({ 
        chatHistory: [...state.chatHistory, message] 
      })),
      setEvaluation: (evalData) => set({ evaluation: evalData }),
      setStatus: (status) => set({ status: status }),
      resetInterview: () => set({
        resumeText: '',
        jobDescription: '',
        chatHistory: [],
        evaluation: null,
        status: 'idle',
        difficulty: 'Medium'
      }),
      clearChat: () => set({ chatHistory: [], evaluation: null, status: 'idle' }), // Keep resume/JD
    }),
    {
      name: 'ai-interview-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // handle hydration manually if needed, or rely on useEffect in components
    }
  )
);
