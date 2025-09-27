const ChatMessage = ({ message }) => {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-md rounded-lg px-4 py-2 ${
          isAi ? 'bg-gray-700 text-white' : 'bg-violet-600 text-white'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;