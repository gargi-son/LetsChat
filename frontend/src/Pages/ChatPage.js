// import React, { useEffect, useState } from "react";
// import axios from "axios";

import { Box } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/chatProvider";

const ChatPage = () => {
  // const [chats, setChats] = useState([]);
  // const fetchChats = async () => {
  //   const { data } = await axios.get("/api/chat");

  //   setChats(data);
  // };
  // //whenever the component is rendered for the first time fetchChats will be called
  // useEffect(() => {
  //   fetchChats();
  // }, []);

  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>

      {/* {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))} */}
    </div>
  );
};

export default ChatPage;
