import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

  const socket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
  });

  const messageInputRef = useRef(null);

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
    fetchData();
    // eslint-disable-next-line
  }, [conversationId]);

  useEffect(() => {
    if (participants.length > 0) {
      const userId = localStorage.getItem("userId");
      setMyId(userId);
    }
  }, [participants]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification(t("NotificationWelcome"), {
            body: t("NotificationAllow"),
          });

          notification.onclick = () => {
            window.open("https://doveme.netlify.app");
          };
        }
      });
    }

    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("receiveMessage");
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
        <div className="text-center absolute top-6 text-black lg:block hidden">
          <h2>
            {t("ChatID")}{" "}
            <Link
              className="text-[#8251ED]"
              to={`/account/${
                participants.length > 0
                  ? participants[0]._id === myId
                    ? participants[1].username
                    : participants[0].username
                  : ""
              }`}
            >
              {participants.length > 0
                ? participants[0]._id === myId
                  ? participants[1].username
                  : participants[0].username
                : ""}
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
          <MessageList
            messages={messages}
            myId={myId}
            conversationId={conversationId}
            setMessages={setMessages}
          />
        )}

        <div className="flex justify-center align-middle items-center flex-col">
          <div className="flex items-center justify-center fixed bottom-16 text-center">
            <textarea
              ref={messageInputRef}
              rows={1}
              placeholder={t("ChatPlaceholder")}
              maxLength={500}
              style={{ resize: "none" }}
              className="border border-[#8251ED] rounded-3xl w-[290px] 
              px-4 py-2 mb-4 mt-4 sm:w-[580px] md:w-[660px] lg:w-[790px] h-auto"
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
  );
};

export default Chat;
