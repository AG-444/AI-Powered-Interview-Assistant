import { useState } from 'react';
import { useSelector } from 'react-redux';
import ResumeUploader from '../components/interviewee/ResumeUploader.jsx';
import ChatWindow from '../components/interviewee/ChatWindow.jsx';

const IntervieweePage = () => {
  const [step, setStep] = useState('upload');
  const [candidate, setCandidate] = useState(null);
  const [resumeFilename, setResumeFilename] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const handleUploadSuccess = (candidateData, filename) => {
    // We need to make sure the candidate object has the user's name if available
    const finalCandidate = {
      ...candidateData,
      name: candidateData.name || userInfo.name,
    };
    setCandidate(finalCandidate);
    setResumeFilename(filename);
    setStep('collecting_info');
  };
  
  const handleProfileComplete = (completeCandidateData) => {
    setCandidate(completeCandidateData);
    setStep('interview');
    console.log("Profile complete! Ready for interview.", completeCandidateData);
  }

  return (
    // --- LAYOUT FIX IS HERE ---
    // Changed justify-center to justify-start and added vertical padding
    <main className="flex w-full flex-grow flex-col items-center justify-start p-4 py-12">
      <div className="mb-8 text-center">
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