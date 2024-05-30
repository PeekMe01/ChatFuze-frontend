import React, { createContext, useState } from 'react';

export const RequestContext = createContext();

const RequestProvider = ({ children }) => {
  const [requestID, setRequestID] = useState(null);
  const [userId, setUserId] = useState(null);
  return (
    <RequestContext.Provider value={{ requestID, setRequestID, userId, setUserId }}>
      {children}
    </RequestContext.Provider>
  );
};

export default RequestProvider;
