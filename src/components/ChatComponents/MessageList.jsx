import React, { useEffect, useRef } from "react";
import Linkify from 'linkify-react';

const MessageList = ({ messages, myId }) => {
  const messageContainerRef = useRef(null);

  const options = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "font-bold italic flex",
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex overflow-auto flex-col w-[95%] lg:w-[60%] max-h-[70%] rounded-3xl p-8 fixed top-[4.3rem]"
      ref={messageContainerRef}
    >
      {messages.map((message) => {
        if (!message.content) {
          return null;
        }

        return (
          <div
            key={message._id}
            className={`flex ${
              message.sender === myId ? "justify-end " : "justify-start"
            }`}
          >
            <div
              className={`${
                message.sender === myId
                  ? "bg-[#8251ED] text-white self-end"
                  : "text-[#8251ED] self-start border border-[#8251ED]"
              } rounded-3xl px-4 py-2 mb-2 mt-2`}
            >
              <Linkify options={options}>{message.content}</Linkify>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
