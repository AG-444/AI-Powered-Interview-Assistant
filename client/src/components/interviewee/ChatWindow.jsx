import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage.jsx';

const ChatWindow = ({ candidate, resumeFilename, onProfileComplete }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(candidate);

  const chatEndRef = useRef(null);
  const initCheckDone = useRef(false);

  useEffect(() => {
    if (initCheckDone.current) return;

    const fields = [];
    if (!candidate.email) fields.push('email');
    if (!candidate.name) fields.push('name');
    if (!candidate.phone) fields.push('phone');

    setMissingFields(fields);

    // Add the file confirmation message first
    const initialMessages = [{ sender: 'ai', text: `Thanks for uploading "${resumeFilename}"!` }];

    if (fields.length > 0) {
      initialMessages.push({ sender: 'ai', text: 'I just need a bit more info to get started.' });
      setMessages(initialMessages);
      askForNextField(fields);
    } else {
      initialMessages.push({ sender: 'ai', text: 'Your profile looks complete.' });
      setMessages(initialMessages);
      // Small delay so the user can read the messages before the screen changes
      setTimeout(() => {
        onProfileComplete(candidate);
      }, 2000);
    }

    initCheckDone.current = true;
  }, [candidate, onProfileComplete, resumeFilename]);

  // ... (The rest of your ChatWindow.jsx code remains the same) ...

  const askForNextField = (fields) => {
    if (fields.length === 0) return;
    const nextField = fields[0];
    let question = '';
    switch (nextField) {
      case 'email':
        question = 'I couldn\'t find an email in the resume. What is your email address?';
        break;
      case 'name':
        question = 'What is your full name?';
        break;
      case 'phone':
        question = 'What is your phone number?';
        break;
      default:
        return;
    }
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: question }]);
    }, 1200); // Increased delay slightly
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);

    const currentField = missingFields[0];
    const updatedCandidateData = { ...currentCandidate, [currentField]: userInput };
    setCurrentCandidate(updatedCandidateData);

    setUserInput('');

    const remainingFields = missingFields.slice(1);
    setMissingFields(remainingFields);

    if (remainingFields.length > 0) {
      askForNextField(remainingFields);
    } else {
      try {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Great, thank you! One moment...' }]);
        const response = await axios.patch(`http://localhost:5001/api/candidates/${updatedCandidateData._id}`, updatedCandidateData);

        setTimeout(() => {
          onProfileComplete(response.data);
        }, 1000);

      } catch (error) {
        console.error("Error updating candidate:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, there was an error saving your info.' }]);
      }
    }
  };

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-lg border border-gray-700 bg-gray-800 text-white">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {missingFields.length > 0 && (
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              className="flex-grow rounded-l-md border-0 bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-violet-500"
              placeholder="Type your answer..."
              autoFocus
            />
            <button
              type="submit"
              className="rounded-r-md bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-500"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;