import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MESSAGES_ROUTE, CONVERSATIONS_ROUTE } from "../utils/routes";
import io from "socket.io-client";
import { Oval } from "react-loader-spinner";

const Chat = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [myId, setMyId] = useState("");
  const messageContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const socket = io("https://chatappdoveme.fly.dev", {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
  });

  const messageInputRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(MESSAGES_ROUTE(conversationId), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data);
        setLoading(false);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    if (participants.length > 0) {
      const userId = localStorage.getItem("userId");

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
    const message = messageInputRef.current.value;

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

        socket.emit("sendMessage", {
          conversationId,
          message: newMessage,
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        messageInputRef.current.value = "";

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
    console.log("Chat component rendered");

    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId, myId, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, conversationId]);

  return (
    <>
      <div className="w-full flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <div className="flex justify-center align-middle items-center flex-col">
          <div className="text-center absolute top-6 text-black lg:block hidden">
            <h2>
              {t("ChatID")}{" "}
              <Link
                className="text-[#8251ED]"
                to={`/account/${
                  participants.length > 0 ? participants[0].username : ""
                }`}
              >
                {participants.length > 0 ? participants[0].username : ""}
              </Link>
            </h2>
          </div>

          {loading ? (
            <div className="mt-[-4rem]">
              <Oval
                height={40}
                width={40}
                color="#8251ED"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#8251ED"
                strokeWidth={6}
                strokeWidthSecondary={6}
              />
            </div>
          ) : (
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
                      message.sender === myId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        message.sender === myId
                          ? "bg-[#8251ED] text-white self-end"
                          : "bg-white text-[#8251ED] self-start border border-[#8251ED]"
                      } rounded-3xl px-4 py-2 mb-2 mt-2`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center align-middle items-center flex-col">
            <div className="flex items-center justify-center fixed bottom-16 text-center">
              <input
                ref={messageInputRef}
                type="text"
                placeholder={t("ChatPlaceholder")}
                className="border border-[#8251ED] rounded-3xl w-[260px] px-4 py-2 mb-4 mt-4 md:w-[660px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
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
