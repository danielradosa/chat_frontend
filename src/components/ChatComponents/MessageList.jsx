import React, { useEffect, useRef, useState } from "react";
import Linkify from "linkify-react";
import io from "socket.io-client";
import { LIKE_MESSAGE } from "../../utils/routes";
import axios from "axios";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";

const MessageList = ({
  messages,
  myId,
  conversationId,
  setMessages,
  participants,
}) => {
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
    className: "font-bold italic",
    format: (value, type) => {
      if (type === "url" && value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    },
  };

  const [animatedHearts, setAnimatedHearts] = useState({});

  useEffect(() => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const shouldScroll =
        container.scrollHeight - container.scrollTop === container.clientHeight;

      if (shouldScroll) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (messageContainerRef.current && shouldAutoScroll) {
      const container = messageContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

  const handleLikeMessage = (messageId, isAlreadyLiked) => {
    if (
      messages.find((message) => message._id === messageId)?.sender === myId
    ) {
      return;
    }

    setAnimatedHearts((prevAnimatedHearts) => ({
      ...prevAnimatedHearts,
      [messageId]: true,
    }));

    setTimeout(() => {
      setAnimatedHearts((prevAnimatedHearts) => ({
        ...prevAnimatedHearts,
        [messageId]: false,
      }));
    }, 100);

    setShouldAutoScroll(false);
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

  const handleScroll = () => {
    setShouldAutoScroll(
      messageContainerRef.current.scrollTop ===
        messageContainerRef.current.scrollHeight -
          messageContainerRef.current.clientHeight
    );
  };

  return (
    <div
      className="flex overflow-auto flex-col w-full p-4 md:p-4 lg:pl-8 lg:pr-8 lg:pb-8
       md:top-[8.7rem] bottom-[85px] absolute top-[8.1rem]"
      ref={messageContainerRef}
      onScroll={handleScroll}
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
            {message.sender !== myId &&
              participants &&
              participants.length > 0 && (
                <Link to={`/profile/${message.sender}`} className="mr-2 md:mr-4">
                  <img
                    src={
                      participants.find((p) => p._id === message.sender)
                        .profilePicture || avatar
                    }
                    alt="sender-profile-pic"
                    className="w-8 h-8 rounded-full mt-4 bg-white"
                  />
                </Link>
              )}
            <div
              className={`${
                message.sender === myId
                  ? "self-end bg-black text-white bg-cover leading-6 rounded-full break-words"
                  : "self-start bg-white bg-cover leading-6 rounded-full break-words"
              } px-4 py-3 mb-2 mt-2 lg:max-w-[75%] max-w-[85%] ${
                isLiked ? "message-liked" : ""
              }`}
              onDoubleClick={() => handleLikeMessage(message._id)}
            >
              <Linkify options={options}>{message.content}</Linkify>

              {isLiked && (
                <span
                  className={`liked-icon ${
                    animatedHearts[messageId] ? "animate-heart" : ""
                  }`}
                >
                  🩷
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
