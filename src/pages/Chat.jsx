import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MESSAGES_ROUTE, CONVERSATIONS_ROUTE } from "../utils/routes";
import io from "socket.io-client";

const Chat = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [myId, setMyId] = useState("");
  const messageContainerRef = useRef(null);

  const socket = io("https://chatappdoveme.fly.dev", {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(MESSAGES_ROUTE(conversationId), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const fetchConversation = async () => {
      try {
        const response = await axios.get(CONVERSATIONS_ROUTE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const conversation = response.data.find(
          (conversation) => conversation._id === conversationId
        );

        if (conversation) {
          setParticipants(conversation.participants);
        } else {
          console.log("Conversation not found");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    if (participants.length > 0) {
      const userId = localStorage.getItem("userId");
      const otherParticipant = participants.find((id) => id !== userId);

      setMyId(userId);
    }
  }, [participants]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const lastMessage = container.lastElementChild;

      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const sendMessage = () => {
    const userId = localStorage.getItem("userId");

    if (!message) {
      console.log("Message content is empty.");
      return;
    }

    axios
      .post(
        MESSAGES_ROUTE(conversationId),
        {
          sender: userId,
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const newMessage = response.data;
        setMessages((prevMessages) => [...prevMessages, message]);
        setMessage("");

        socket.emit("sendMessage", {
          conversationId,
          message: newMessage,
        });

        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop =
            messageContainerRef.current.scrollHeight;
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (data) => {
      console.log("Received a new message:", data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId, myId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, conversationId]);

  return (
    <>
      <div className="w-full flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <div className="flex justify-center align-middle items-center flex-col">
          <div className="text-center absolute top-3 text-gray-400 lg:block hidden">
            <h1>{t("ChatTitle")}</h1>
            <h2>
              {t("ChatID")} {conversationId}
            </h2>
          </div>

          <div
            className="flex overflow-auto flex-col w-[95%] lg:w-[60%] max-h-[70%] rounded-3xl p-8 fixed top-[4.3rem]"
            ref={messageContainerRef}
          >
            {messages.map((message) => {
              // Check if the message content is empty
              if (!message.content) {
                return null; // Skip rendering empty messages
              }

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender === myId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.sender === myId
                        ? "bg-[#8251ED] text-white self-end shadow-lg"
                        : "bg-white text-[#8251ED] self-start border border-[#8251ED]"
                    } rounded-3xl px-4 py-2 mb-2 mt-2`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center align-middle items-center flex-col">
            <div className="flex items-center justify-center fixed bottom-16 text-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("ChatPlaceholder")}
                className="border border-[#8251ED] rounded-3xl w-[260px] px-4 py-2 mb-4 mt-4 lg:w-[720px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim() !== "") {
                    sendMessage();
                  }
                }}
              />

              <button
                className="bg-[#8251ED] rounded-full ml-2"
                onClick={sendMessage}
              >
                <img
                  src="https://cdn.icon-icons.com/icons2/1678/PNG/512/wondicon-ui-free-send_111204.png"
                  alt="send"
                  className="w-10 p-2 invert rounded-full"
                />
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Chat;
