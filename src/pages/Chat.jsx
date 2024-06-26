import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Header } from "../components";
import { MessageList } from "../components/ChatComponents";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MESSAGES_ROUTE, CONVERSATIONS_ROUTE } from "../utils/routes";
import io from "socket.io-client";
import { Oval } from "react-loader-spinner";
import avatar from "../assets/avatar.png";

const Chat = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [myId, setMyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [notificationPermission, setNotificationPermission] = useState(
    localStorage.getItem("notificationPermission") || "default"
  );
  const apiURL = process.env.REACT_APP_API;

  const socket = io(`${apiURL}?token=${localStorage.getItem("token")}`, {
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

  const sendMessage = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const message = messageInputRef.current.innerText.trim();

    if (!message) {
      console.log("Message content is empty.");
      return;
    }

    messageInputRef.current.scrollTop = 0;
    messageInputRef.current.innerText = "";

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

      // Show notification if page is not visible
      if (document.visibilityState === "hidden") {
        showNotification(data.message.content);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageLiked");
      socket.off("sendMessage");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line
  }, [conversationId, myId, socket, fetchData, participants]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const allowNotifications = () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setNotificationPermission("granted");
        localStorage.setItem("notificationPermission", permission);
      } else if (permission === "denied") {
        setNotificationPermission("denied");
      } else {
        setNotificationPermission("default");
      }
    });
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationPermission("granted");
    }
  }, []);

  const showNotification = (message) => {
    const senderUsername =
      participants[0]?._id === myId
        ? participants[1]?.username
        : participants[0]?.username;

    if (Notification.permission === "granted") {
      try {
        new Notification(senderUsername, {
          body: message,
          vibrate: [200],
          icon: "logo.png",
          tag: "NewMessage",
        });
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    }
  };

  const handleSendValue = (e) => {
    setInputValue(e.target.innerText.trim());
  };

  return (
    <div className="">
      <div>
        <Header />
        <div
          className="w-full md:p-6 h-[64px] flex items-center gap-4 md:gap-8 z-[1000] fixed
        top-[64px] md:top-[73px] pl-2"
        >
          <button onClick={goBack}>
            <img
              src="https://cdn-icons-png.freepik.com/512/7792/7792299.png"
              alt=""
              className="w-10 invert ml-1"
            />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={
                participants[0]?._id === myId
                  ? participants[1]?.profilePicture || avatar
                  : participants[0]?.profilePicture || avatar
              }
              alt=""
              className="w-10 h-10 border-2 rounded-full border-white"
            />
            <h1 className="font-bold text-white text-lg">
              {participants[0]?._id === myId
                ? participants[1]?.username
                : participants[0]?.username}
            </h1>
          </div>
          {"Notification" in window &&
            (notificationPermission === "granted" ? (
              <button
                onClick={allowNotifications}
                className="py-2 px-4 bg-red-500 rounded-xl text-white font-semibold truncate max-w-[48%] md:w-auto"
              >
                {t("notifs-disable")}
              </button>
            ) : (
              <button
                onClick={allowNotifications}
                className="py-2 px-4 bg-green-500 rounded-xl text-white font-semibold"
              >
                {t("notifs")}
              </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center align-middle">
        {loading ? (
          <div className="mt-36">
            <Oval
              height={40}
              width={40}
              color="#000"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#444"
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
            participants={participants}
          />
        )}

        <div
          className="flex w-full items-center justify-center py-8 px-4 text-center lg:p-8
          absolute bottom-0 backdrop-blur-sm"
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-full relative bg-white rounded-3xl overflow-auto min-h-[46px]"
          >
            <div
              ref={messageInputRef}
              aria-describedby=":r2r:"
              inputMode="text"
              enterKeyHint="send"
              className="bg-white text-black w-[90%] rounded-3xl h-auto max-h-[124px] outline-none
              p-2 px-4 leading-6 text-left min-h-[36px] resize-none overflow-auto md:mb-0"
              contentEditable={true}
              spellCheck={true}
              tabIndex={0}
              style={{
                userSelect: "text",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              role="textbox"
              data-lexical-editor="true"
              dir="ltr"
              onInput={handleSendValue}
              onKeyDown={handleKeyDown}
              data-lexical-text="true"
            ></div>

            <button
              className={`bg-white rounded-full w-8 bottom-2 right-2 absolute ${
                inputValue.trim().length > 0 ? "bg-black" : "bg-white"
              }`}
              onClick={sendMessage}
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png"
                alt="send"
                className={`p-2 ${inputValue.length > 0 ? "invert" : ""}`}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
