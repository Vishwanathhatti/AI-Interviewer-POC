import FileUpload from '@/components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">AI Interview Bot</h1>
        <p className="text-lg text-gray-600">Simulate a real interview with AI. Upload your resume to begin.</p>
      </header>
      
      <main className="w-full max-w-4xl">
        <FileUpload />
      </main>
    </div>
  );
}
