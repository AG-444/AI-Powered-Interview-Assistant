import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // 1. Import useSelector

const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  
  // 2. Get user info from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // 3. Create a config object with the Authorization header
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // 4. Pass the config object to the axios call
      const response = await axios.post('http://localhost:5001/api/candidates', formData, config);
      
      onUploadSuccess(response.data, file.name);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred during upload.');
      } else {
        setError('An error occurred. Is the server running?');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 p-8 text-center"
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"
      >
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      
      <p className="mt-4 text-lg font-semibold text-white break-all">
        {file ? file.name : 'Upload a new or updated resume'}
      </p>
      
      <p className="mt-2 text-sm text-gray-400">PDF or DOCX, up to 10MB</p>
      <div className="mt-6">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-500 focus-within:outline-none"
        >
          <span>{file ? 'Change file' : 'Select a file'}</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept=".pdf,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </label>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-gray-500"
          disabled={!file}
        >
          Start Interview
        </button>
      </div>
    </form>
  );
};

export default ResumeUploader;