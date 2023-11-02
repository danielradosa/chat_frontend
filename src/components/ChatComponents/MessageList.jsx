import React, { useEffect, useRef } from "react";
import Linkify from "linkify-react";

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
      className="flex overflow-auto flex-col w-[95%] lg:max-w-[900px] 
      rounded-3xl p-4 lg:p-8 top-[4.3rem] md:bottom-28 bottom-32 absolute"
      ref={messageContainerRef}
    >
      {messages.map((message, index) => {
        if (!message.content) {
          return null;
        }

        const isMyMessage = message.sender === myId;
        const isLastMessage = index === messages.length - 1;

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
              } rounded-3xl px-4 py-2 mb-2 mt-2 lg:max-w-[75%] max-w-[85%] flex`}
            >
              <Linkify options={options}>{message.content}</Linkify>
            </div>
            {isLastMessage && isMyMessage && message.status === "sent" && (
              <p className="rounded-3xl w-2 h-2 bg-gray-300 my-auto relative ml-2"></p>
            )}
            {isLastMessage && isMyMessage && message.status === "delivered" && (
              <p className="rounded-3xl w-2 h-2 bg-[#8251ED] my-auto relative ml-2"></p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
