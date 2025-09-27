import { useState } from 'react';
import ResumeUploader from '../components/interviewee/ResumeUploader';
import ChatWindow from '../components/interviewee/ChatWindow';
// We'll import and use InterviewFlow in the next slice
// import InterviewFlow from '../components/interviewee/InterviewFlow';

const IntervieweePage = () => {
  const [step, setStep] = useState('upload'); // 'upload', 'collecting_info', 'interview'
  const [candidate, setCandidate] = useState(null);

  const handleUploadSuccess = (candidateData) => {
    setCandidate(candidateData);
    setStep('collecting_info');
  };
  
  const handleProfileComplete = (completeCandidateData) => {
      setCandidate(completeCandidateData);
      // For now, we'll just log this. In the next slice, we'll change the step to 'interview'
      console.log("Profile is complete! Ready for interview.", completeCandidateData);
      alert("Profile complete! The next step is the interview.");
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 p-4">
      <div className="mb-8">
         <h1 className="text-4xl font-bold text-white">AI Interview Assistant</h1>
      </div>
      
      {step === 'upload' && <ResumeUploader onUploadSuccess={handleUploadSuccess} />}
      {step === 'collecting_info' && <ChatWindow candidate={candidate} onProfileComplete={handleProfileComplete} />}
      {/* {step === 'interview' && <InterviewFlow candidate={candidate} />} */}

    </main>
  );
};

export default IntervieweePage;