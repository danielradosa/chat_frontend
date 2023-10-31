import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { CONVERSATIONS_ROUTE, ALL_USERS } from "../utils/routes";
import { useTranslation } from "react-i18next";
import { Oval } from "react-loader-spinner";

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
        (participant) => participant._id === userId
      )
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

  const handleDeleteConversation = async (conversationId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      await axios.delete(`${CONVERSATIONS_ROUTE}/${conversationId}`, config);
      setConversations(
        conversations.filter(
          (conversation) => conversation._id !== conversationId
        )
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const goToConversation = (conversationId) => {
    window.location.href = `/chat/${conversationId}`;
  };

  return (
    <>
      <main className="w-full flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <div className="flex justify-center items-center align-middle flex-col">
          <h3 className="text-center text-2xl font-bold">
            {t("ConversationTitle")}
          </h3>

          {!loading ? (
            <>
              {conversations.length > 0 ? (
                <ul>
                  {conversations.map((conversation) => (
                    <li
                      key={conversation._id}
                      className="flex items-center justify-center bg-white rounded p-2 mt-2"
                    >
                      <button
                          className="px-4 py-1 w-[280px] truncate rounded-3xl bg-[#8251ED] lg:w-[350px] text-white
                          transition-all"
                        onClick={() => {
                          goToConversation(conversation._id);
                        }}
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

                      <button
                        className="px-4 py-1 rounded-3xl bg-red-500 text-white ml-2 transition-all"
                        onClick={() =>
                          handleDeleteConversation(conversation._id)
                        }
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/542/542724.png"
                          alt="trash"
                          className="w-4 py-1 invert"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4">
                  {t("NoConversations")}
                </div>
              )}
            </>
          ) : (
            <div className="mt-4">
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
          )}
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

          {loading ? (
           <div className="mt-2">
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
            <ul>
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-center bg-white rounded p-2 mt-2"
                >
                  <button
                    className="px-4 py-1 rounded-3xl bg-[#8251ED] text-white w-[280px] truncate lg:w-[350px] transition-all"
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
          )}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Dashboard;
