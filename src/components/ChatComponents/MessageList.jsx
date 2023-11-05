import React, { useEffect, useRef, useState } from "react";
import Linkify from "linkify-react";
import io from "socket.io-client";
import { LIKE_MESSAGE } from "../../utils/routes";
import axios from "axios";

const MessageList = ({ messages, myId, conversationId, setMessages }) => {
  const messageContainerRef = useRef(null);
  const apiURL = process.env.REACT_APP_API;

  const socket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
  });

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

  const [animatedHearts, setAnimatedHearts] = useState({});

  const handleLikeMessage = (messageId, isAlreadyLiked) => {
    if (messages.find((message) => message._id === messageId)?.sender === myId) {
      return;
    }

    setAnimatedHearts((prevAnimatedHearts) => ({
      ...prevAnimatedHearts,
      [messageId]: true,
    }));

    setTimeout(() => {
      // Reset the specific message's animatedHeart state to false.
      setAnimatedHearts((prevAnimatedHearts) => ({
        ...prevAnimatedHearts,
        [messageId]: false,
      }));
    }, 200);

    const newIsLiked = !isAlreadyLiked;

    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message._id === messageId) {
          return { ...message, isLiked: newIsLiked };
        } else {
          return message;
        }
      })
    );

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    axios
      .put(LIKE_MESSAGE(messageId, conversationId), null, { headers })
      .then((response) => {})
      .catch((error) => {
        console.error("Error liking/unliking message:", error);
      });
  };

  useEffect(() => {
    socket.on("messageLiked", (data) => {
      const { messageId, isLiked } = data;

      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message._id === messageId) {
            return { ...message, isLiked };
          } else {
            return message;
          }
        })
      );
    });
  }, [socket, setMessages]);

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

        const isLiked = message.isLiked;
        const messageId = message._id;

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
              } rounded-3xl px-4 py-2 mb-2 mt-2 lg:max-w-[75%] max-w-[85%] flex ${
                isLiked ? "message-liked" : ""
              }`}
              onDoubleClick={() => handleLikeMessage(message._id)}
            >
              <Linkify options={options}>{message.content}</Linkify>
              {isLiked && (
                <span className={`liked-icon ${animatedHearts[messageId] ? "animate-heart" : ""}`}>🩵</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
