
import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const bubbleClasses = isUser
    ? 'bg-indigo-500 text-white self-end rounded-br-none'
    : 'bg-gray-200 text-gray-800 self-start rounded-bl-none';

  return (
    <div className={`flex flex-col max-w-[80%] my-2 p-3 rounded-xl shadow-sm ${bubbleClasses}`}>
      <p className="whitespace-pre-wrap text-lg">{message.text}</p>
      {message.urls && message.urls.length > 0 && (
        <div className="mt-2 text-base text-gray-600">
          <p className="font-semibold text-indigo-100">関連情報:</p>
          <ul className="list-disc list-inside">
            {message.urls.map((url, index) => (
              <li key={index} className="break-words">
                <a href={url.uri} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline">
                  {url.title || url.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {message.category && message.subCategory && (
        <p className={`mt-1 text-sm ${isUser ? 'text-indigo-100' : 'text-gray-600'}`}>
          <span className="font-semibold">カテゴリ:</span> {message.category} &gt; {message.subCategory}
        </p>
      )}
    </div>
  );
};

export default MessageBubble;