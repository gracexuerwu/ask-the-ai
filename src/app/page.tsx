"use client"

import React, { useState } from 'react';

const Home: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const askTheAI = async () => {
    if (inputMessage.trim() === '' || isProcessing) return; // Ignore empty messages or if processing is in progress

    try {
      // Start processing, disable the button, and update button text
      setProcessing(true);

      // Make a POST request to the /api/openai endpoint
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();

      // Update the message history with the user's input and AI's response
      setMessageHistory((prevHistory) => [
        ...prevHistory,
        `User: ${inputMessage}`,
        `Assistant: ${data.response}`,
      ]);

      // Clear the input field after asking the AI
      setInputMessage('');
    } catch (error) {
      console.error('Error making the API call:', error);
    } finally {
      // Stop processing, enable the button, and reset button text
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full mx-auto p-6">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md w-full text-black">
          {/* Display the message history */}
          {messageHistory.map((message, index) => (
            <div key={index} className="mb-2 p-2 border border-gray-300 rounded">
              <p>{message}</p>
            </div>
          ))}
        </div>

        <textarea
          className="w-full p-4 mb-4 rounded-lg shadow-md resize-none text-black"
          rows={6}
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        ></textarea>

        <button
          className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isProcessing ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={askTheAI}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Ask the AI'}
        </button>
      </div>
    </div>
  );
};

export default Home;
