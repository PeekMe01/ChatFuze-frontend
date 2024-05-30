import React, { createContext, useContext, useState } from 'react';

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [friendUnreadCounts, setFriendUnreadCounts] = useState({});
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const updateUnreadCounts = (friendId, count) => {
    setFriendUnreadCounts(prevCounts => {
      const newCounts = { ...prevCounts, [friendId]: count };
      const totalUnread = Object.values(newCounts).reduce((acc, curr) => acc + curr, 0);
      setTotalUnreadMessages(totalUnread);
      return newCounts;
    });
  };

  return (
    <UnreadMessagesContext.Provider value={{ friendUnreadCounts, totalUnreadMessages, setTotalUnreadMessages, updateUnreadCounts }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => useContext(UnreadMessagesContext);