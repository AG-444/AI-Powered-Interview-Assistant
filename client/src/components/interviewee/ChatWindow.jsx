import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ candidate, onProfileComplete }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(candidate);
  
  const chatEndRef = useRef(null);

  // This effect runs once to check for missing info and start the conversation
  useEffect(() => {
    const fields = [];
    if (!candidate.name) fields.push('name');
    if (!candidate.phone) fields.push('phone');
    // We assume email is always present as it's our unique identifier
    
    setMissingFields(fields);

    if (fields.length > 0) {
      setMessages([{ sender: 'ai', text: 'Thanks for uploading your resume! I just need a little more information to get started.' }]);
      askForNextField(fields);
    } else {
      // If nothing is missing, move on
      onProfileComplete(candidate);
    }
  }, [candidate]);

  // Scroll to the bottom of the chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const askForNextField = (fields) => {
    if (fields.length === 0) return;
    const nextField = fields[0];
    let question = '';
    switch (nextField) {
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
    }, 500);
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
    const updatedCandidate = { ...currentCandidate, [currentField]: userInput };
    setCurrentCandidate(updatedCandidate);
    
    setUserInput('');

    const remainingFields = missingFields.slice(1);
    setMissingFields(remainingFields);

    if (remainingFields.length > 0) {
      askForNextField(remainingFields);
    } else {
      // All info collected, update the database
      try {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Great, thank you! One moment while I save your profile.' }]);
        const response = await axios.patch(`http://localhost:5001/api/candidates/${currentCandidate._id}`, {
          [currentField]: userInput
        });
        onProfileComplete(response.data); // Notify parent component that profile is complete
      } catch (error) {
        console.error("Error updating candidate:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, there was an error saving your info. Please try refreshing.' }]);
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