import { useState } from 'react';
import ResumeUploader from '../components/interviewee/ResumeUploader.jsx';
import ChatWindow from '../components/interviewee/ChatWindow.jsx';

const IntervieweePage = () => {
  const [step, setStep] = useState('upload');
  const [candidate, setCandidate] = useState(null);
  const [resumeFilename, setResumeFilename] = useState(''); // New state for filename

  const handleUploadSuccess = (candidateData, filename) => {
    setCandidate(candidateData);
    setResumeFilename(filename); // Set the filename
    setStep('collecting_info');
  };

  const handleProfileComplete = (completeCandidateData) => {
    setCandidate(completeCandidateData);
    setStep('interview');
    console.log("Profile complete! Ready for interview.", completeCandidateData);
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">AI Interview Assistant</h1>
      </div>

      {step === 'upload' && <ResumeUploader onUploadSuccess={handleUploadSuccess} />}
      {step === 'collecting_info' && <ChatWindow candidate={candidate} resumeFilename={resumeFilename} onProfileComplete={handleProfileComplete} />}

      {step === 'interview' && (
        <div className="w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-4 text-center text-white">
          <h2 className="text-2xl font-semibold">Thank you, {candidate.name}.</h2>
          <p className="mt-2">Your profile is complete. We are now ready to begin the interview.</p>
        </div>
      )}
    </main>
  );
};

export default IntervieweePage;