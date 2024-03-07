import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const apiURL = process.env.REACT_APP_API;
  // eslint-disable-next-line
  const currentUser = localStorage.getItem("username");

  const socket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
    autoConnect: true,
  });

  const messageInputRef = useRef(null);

  const fetchData = useCallback(async () => {
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
  }, [conversationId]);

  useEffect(() => {
    fetchData();

    return () => {};
  }, [conversationId, fetchData]);

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
    socket.on("connect", () => {
      socket.emit("joinConversation", conversationId);
    });

    const handleVisibilityChange = () => {
      const isPageVisible = !document.hidden;

      if (isPageVisible && !socket.connected) {
        fetchData();
        socket.connect();
      } else if (!isPageVisible && socket.connected) {
        socket.disconnect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [conversationId, myId, socket, t, fetchData, participants]);

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
    <div className="flex min-h-screen w-full flex-col justify-between align-middle">
      <Header />

      <div className="flex flex-col items-center justify-center align-middle">
        {loading ? (
          <div className="mt-[-4rem]">
            <Oval
              height={40}
              width={40}
              color="#92c5fd"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#3696ff"
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

        <div
          className="fixed flex w-full items-center justify-center p-4 text-center 
          bottom-[20px] lg:p-8"
        >
          <textarea
            ref={messageInputRef}
            rows={1}
            placeholder={t("ChatPlaceholder")}
            maxLength={500}
            style={{ resize: "none" }}
            className="mb-4 mt-4 h-auto w-full px-4 py-2  shadow-lg text-white rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (e.target.value.trim() !== "") {
                  sendMessage();
                }
              }
            }}
          />

          <button className="ml-2 bg-slate-800 shadow-lg rounded-md" onClick={sendMessage}>
            <img
              src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png"
              alt="send"
              className="w-10 p-2 hover:rotate-[-35deg] transition-all invert"
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;
