import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { CONVERSATIONS_ROUTE, ALL_USERS } from "../utils/routes";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newConversationUsername, setNewConversationUsername] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [myId, setMyId] = useState("");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(ALL_USERS);
        const allUsers = response.data;
        setMyId(localStorage.getItem("userId"));
        const currentUserUsername = localStorage.getItem("username");
        setCurrentUser(currentUserUsername);
        const filteredExcludingCurrentUserAndInConversationsWith = allUsers.filter(
          (user) =>
            user.username !== currentUserUsername &&
            isParticipantInConversations(user._id)
        );
        setUsers(allUsers);
        setFilteredUsers(filteredExcludingCurrentUserAndInConversationsWith);
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
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
    fetchUsers();
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
      conversation.participants.some((participant) => participant._id === userId)
    );
  };

  const handleCreateConversation = async (participantId, participantName) => {
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

  return (
    <>
      <main className="w-full flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <div className="flex justify-center items-center align-middle flex-col">
          <h3 className="text-center text-2xl font-bold">
            {t("ConversationTitle")}
          </h3>

          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation._id}
                className="flex items-center justify-between bg-white rounded p-2 mt-2"
              >
                <button
                  className="px-4 py-1 rounded-3xl bg-[#8251ED] text-white"
                  onClick={() => {}}
                >
                  {t("OpenConversation")}
                  <span className="font-bold ml-2">
                    {conversation.title.includes(
                      localStorage.getItem("username")
                    )
                      ? conversation.participants[1].username
                      : conversation.participants[0].username}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center items-center">
          <h3 className="text-center text-2xl font-bold">
            {t("NewConversationTitle")}
          </h3>

          <input
            type="text"
            className="border border-[#8251ED] rounded-3xl px-4 py-2 mb-4 mt-4"
            placeholder={t("SearchUserPlaceholder")}
            value={newConversationUsername}
            onChange={(e) => {
              setNewConversationUsername(e.target.value);
              handleUserSearch(e.target.value);
            }}
          />

          <ul>
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between bg-white rounded p-2"
              >
                <button
                  className="px-4 py-1 rounded-3xl bg-[#8251ED] text-white"
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

        <Footer />
      </main>
    </>
  );
};

export default Dashboard;
