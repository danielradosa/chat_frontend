import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { MessageList } from "../components/ChatComponents";
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
  // eslint-disable-next-line
  const apiURL = process.env.REACT_APP_API;
  // eslint-disable-next-line
  const currentUser = localStorage.getItem("username");

  const socket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
  });

  const messageInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesResponse, conversationsResponse] = await Promise.all([
          axios.get(MESSAGES_ROUTE(conversationId), {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(CONVERSATIONS_ROUTE, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setMessages(messagesResponse.data);

        const conversation = conversationsResponse.data.find(
          (conversation) => conversation._id === conversationId
        );

        if (conversation) {
          setParticipants(conversation.participants);
        } else {
          console.log("Conversation not found");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [conversationId]);

  const sendMessage = () => {
    const userId = localStorage.getItem("userId");
    const message = messageInputRef.current.value;

    if (!message) {
      console.log("Message content is empty.");
      return;
    }

    messageInputRef.current.value = "";
    messageInputRef.current.scrollTop = 0;

    const timestamp = new Date().getTime();

    axios
      .post(
        MESSAGES_ROUTE(conversationId),
        {
          sender: userId,
          content: message,
          timestamp: timestamp,
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
          message: newMessage,
          conversationId,
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);

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
    if (participants.length > 0) {
      const userId = localStorage.getItem("userId");
      setMyId(userId);
    }
  }, [participants]);

  useEffect(() => {
    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on("sendMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageLiked");
      socket.off("sendMessage");
    };
  }, [conversationId, myId, socket, t]);

  useEffect(() => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const lastMessage = container.lastElementChild;

      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, conversationId, t]);

  return (
    <div className="w-full flex flex-col justify-between align-middle min-h-screen">
      <Header />

      <div className="flex justify-center align-middle items-center flex-col">
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
          <MessageList
            messages={messages}
            myId={myId}
            conversationId={conversationId}
            setMessages={setMessages}
          />
        )}

        <div className="flex items-center justify-center fixed 
        bottom-12 md:bottom-8 text-center w-full p-4 lg:p-8">
          <textarea
            ref={messageInputRef}
            rows={1}
            placeholder={t("ChatPlaceholder")}
            maxLength={500}
            style={{ resize: "none" }}
            className="bg-blue-300 transition-all outline-none focus:bg-blue-400 placeholder:text-white 
            text-white rounded-3xl px-4 py-2 mb-4 mt-4 h-auto w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (e.target.value.trim() !== "") {
                  sendMessage();
                }
              }
            }}
          />

          <button
            className="bg-blue-300 rounded-full ml-2"
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

      <Footer />
    </div>
  );
};

export default Chat;
