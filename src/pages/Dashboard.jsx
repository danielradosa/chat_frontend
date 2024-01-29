import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { CONVERSATIONS_ROUTE, ALL_USERS } from "../utils/routes";
import { useTranslation } from "react-i18next";
import { Oval } from "react-loader-spinner";
import io from "socket.io-client";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newConversationUsername, setNewConversationUsername] = useState("");
  // eslint-disable-next-line
  const [currentUser, setCurrentUser] = useState("");
  // eslint-disable-next-line
  const [myId, setMyId] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const apiURL = process.env.REACT_APP_API;

  const socket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(ALL_USERS);
        const allUsers = response.data;
        setMyId(localStorage.getItem("userId"));
        const currentUserUsername = localStorage.getItem("username");
        setCurrentUser(currentUserUsername);
        const filteredExcludingCurrentUserAndInConversationsWith =
          allUsers.filter(
            (user) =>
              user.username !== currentUserUsername &&
              isParticipantInConversations(user._id),
          );
        setUsers(allUsers);
        setFilteredUsers(filteredExcludingCurrentUserAndInConversationsWith);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchConversations = async () => {
      try {
        const response = await axios.get(CONVERSATIONS_ROUTE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setConversations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleUserSearch = (username) => {
    const currentUserUsername = localStorage.getItem("username");
    const filtered = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(username.toLowerCase()) &&
        user.username !== currentUserUsername &&
        !isParticipantInConversations(user._id)
      );
    });
    setFilteredUsers(filtered);
  };

  const isParticipantInConversations = (userId) => {
    return conversations.some((conversation) =>
      conversation.participants.some(
        (participant) => participant._id === userId,
      ),
    );
  };

  const handleDeleteConversation = async (conversationId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      await axios.delete(`${CONVERSATIONS_ROUTE}/${conversationId}`, config);
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation._id !== conversationId,
        ),
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleCreateConversation = async (participantId, participantName) => {
    const existingConversation = conversations.find((conversation) =>
      conversation.participants.some(
        (participant) => participant._id === participantId,
      ),
    );

    if (existingConversation) {
      goToConversation(existingConversation._id);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.post(
        CONVERSATIONS_ROUTE,
        {
          participants: [participantId],
          title: participantName,
          createdAt: "",
        },
        config,
      );

      setConversations([...conversations, response.data]);
      setFilteredUsers([]);
      setNewConversationUsername("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  useEffect(() => {
    socket.on("receiveConversation", (conversation) => {
      setConversations((prevConversations) => [
        ...prevConversations,
        conversation,
      ]);
    });

    socket.on("deleteConversation", (conversationId) => {
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation._id !== conversationId,
        ),
      );
    });

    return () => {
      socket.off("receiveConversation");
      socket.off("deleteConversation");
    };
  }, [socket]);

  const goToConversation = (conversationId) => {
    window.location.href = `/chat/${conversationId}`;
  };

  return (
    <>
      <main className="flex min-h-screen w-full flex-col justify-between align-middle">
        <Header />

        <div className="flex flex-col items-center justify-center align-middle">
          <h3 className="mb-6 text-center text-2xl font-bold text-white">
            {t("ConversationTitle")}
          </h3>

          {!loading ? (
            <>
              {conversations.length > 0 ? (
                <ul>
                  {conversations.map((conversation) => (
                    <li
                      key={conversation._id}
                      className="mt-2 flex items-center justify-center rounded p-2 md:w-full w-[85%] mx-auto"
                    >
                      <button
                        className="w-full truncate rounded-3xl bg-white px-4 py-2 text-blue-300
                          transition-all hover:bg-blue-300 hover:text-white"
                        onClick={() => {
                          goToConversation(conversation._id);
                        }}
                      >
                        {t("OpenConversation")}
                        <span className="ml-2 font-bold">
                          {conversation.title.includes(
                            localStorage.getItem("username"),
                          )
                            ? conversation.participants[1].username
                            : conversation.participants[0].username}
                        </span>
                      </button>

                      <button
                        className="btnes ml-2 rounded-3xl bg-red-500 px-4 py-1 text-white transition-all"
                        onClick={() =>
                          handleDeleteConversation(conversation._id)
                        }
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/542/542724.png"
                          alt="trash"
                          className="w-4 py-2 invert"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4">{t("NoConversations")}</div>
              )}
            </>
          ) : (
            <div className="mt-4">
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
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="mb-6 text-center text-2xl font-bold text-white">
            {t("NewConversationTitle")}
          </h3>

          <input
            type="text"
            className="mb-4 mt-4 rounded-3xl
            bg-blue-300 px-4 py-2 font-bold text-white transition-all placeholder:font-normal placeholder:text-white"
            placeholder={t("SearchUserPlaceholder")}
            value={newConversationUsername}
            onChange={(e) => {
              setNewConversationUsername(e.target.value);
              handleUserSearch(e.target.value);
            }}
          />

          {loading ? (
            <div className="mt-2">
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
            <ul className="h-[30svh] overflow-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="mt-2 flex items-center justify-center rounded p-2"
                >
                  <button
                    className="w-[280px] truncate rounded-3xl bg-blue-300 px-4 py-2 text-white
                    shadow-lg transition-all hover:bg-blue-400 lg:w-[350px]"
                    onClick={() =>
                      handleCreateConversation(user._id, user.username)
                    }
                  >
                    {t("CreateConversation")}
                    <span className="ml-2 font-bold">{user.username}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Dashboard;
