import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { CONVERSATIONS_ROUTE, ALL_USERS } from "../utils/routes";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import trash from "../assets/trash.png";
import avatar from "../assets/avatar.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  let userExists = localStorage.getItem("token") ? true : false;

  if (!userExists) {
    window.location.href = "/";
  } else {
    userExists = true;
  }

  const SkeletonConversationList = () => (
    <SkeletonTheme baseColor="#fff" highlightColor="#f2f2f2">
      <Skeleton width={320} height={128} count={1} />
    </SkeletonTheme>
  );

  const socket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    transports: ["websocket"],
    autoConnect: true,
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
              isParticipantInConversations(user._id)
          );
        setUsers(allUsers);
        setFilteredUsers(filteredExcludingCurrentUserAndInConversationsWith);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

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
    // eslint-disable-next-line
  }, []);

  const handleUserSearch = (username) => {
    const currentUserUsername = localStorage.getItem("username");
    if (!username.trim()) {
      setFilteredUsers([]);
      return;
    }
    const filtered = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(username.toLowerCase()) &&
        user.username !== currentUserUsername &&
        !isParticipantInConversations(user.username)
      );
    });
    setFilteredUsers(filtered);
  };

  const isParticipantInConversations = (username) => {
    return conversations.some((conversation) =>
      conversation.participants.some(
        (participant) => participant.username === username
      )
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
          (conversation) => conversation._id !== conversationId
        )
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleCreateConversation = async (participantId, participantName) => {
    const existingConversation = conversations.find((conversation) =>
      conversation.participants.some(
        (participant) => participant._id === participantId
      )
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
        config
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
          (conversation) => conversation._id !== conversationId
        )
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
          <h3 className="mb-6 text-center text-2xl font-bold">
            {t("ConversationTitle")}
          </h3>

          {!loading ? (
            <>
              {conversations.length > 0 ? (
                <ul>
                  {conversations.map((conversation) => (
                    <li
                      key={conversation._id}
                      className="mt-4 flex items-center justify-center mx-auto bg-white 
                      w-[320px] transition-all rounded-md shadow-lg hover:bg-gray-100"
                    >
                      <button
                        className="w-full text-left focus:outline-none focus:ring-2 
                        focus:ring-gray-300 focus:ring-offset-2 p-2 rounded-md"
                        onClick={() => {
                          goToConversation(conversation._id);
                        }}
                      >
                        <span className="ml-2 font-bold flex items-center gap-4">
                          <img src={avatar} alt="" className="w-12" />
                          {conversation.title.includes(
                            localStorage.getItem("username")
                          )
                            ? conversation.participants[1].username
                            : conversation.participants[0].username}
                        </span>
                      </button>

                      <div className="w-1 bg-red-500 h-8 ml-4 rounded-md"></div>

                      <button
                        className="btnes mx-4 border-red-500 border p-2 
                        hover:bg-red-500/20 transition-all rounded-full hover:rotate-[45deg]"
                        onClick={() =>
                          handleDeleteConversation(conversation._id)
                        }
                      >
                        <img src={trash} alt="trash" className="w-6" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t("NoConversations")}</p>
              )}
            </>
          ) : (
            <SkeletonConversationList />
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="mb-6 text-center text-2xl font-bold">
            {t("NewConversationTitle")}
          </h3>

          {loading ? (
            <SkeletonConversationList />
          ) : (
            <div>
              <input
                type="text"
                className="mt-4 p-2 font-bold w-[320px] rounded-md shadow-lg border-2"
                placeholder={t("SearchUserPlaceholder")}
                value={newConversationUsername}
                onChange={(e) => {
                  setNewConversationUsername(e.target.value);
                  handleUserSearch(e.target.value);
                }}
              />

              <ul className="h-[20svh] overflow-auto mb-8 rounded-md">
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="mt-4 flex items-center justify-center px-4 py-2 bg-white w-[320px] 
                  hover:bg-black hover:text-white rounded-md"
                  >
                    <button
                      className="w-full text-left"
                      onClick={() =>
                        handleCreateConversation(user._id, user.username)
                      }
                    >
                      {t("CreateConversation")}
                      <span className="font-bold ml-2">{user.username}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Dashboard;
