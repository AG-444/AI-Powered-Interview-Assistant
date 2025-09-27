import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Mock data for now
const mockAttempts = [
  { _id: 1, createdAt: '2025-09-26T10:00:00Z', score: 85 },
  { _id: 2, createdAt: '2025-09-24T14:30:00Z', score: 72 },
];

const IntervieweeDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userInfo?.name || 'User'}!</h1>
      <p className="text-gray-400 mb-8">Review your past interviews or start a new one.</p>

      <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Past Attempts</h2>
          <Link
            to="/interview"
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            + Start New Interview
          </Link>
        </div>

        <div className="space-y-4">
          {mockAttempts.length > 0 ? (
            mockAttempts.map((attempt) => (
              <div key={attempt._id} className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{new Date(attempt.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-violet-400">{attempt.score}<span className="text-base text-gray-400">/100</span></p>
                  <button className="text-sm text-violet-400 hover:underline">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-8">You have no past interview attempts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntervieweeDashboard;