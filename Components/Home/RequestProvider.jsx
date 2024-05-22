import React, { createContext, useState } from 'react';

export const RequestContext = createContext();

const RequestProvider = ({ children }) => {
  const [requestID, setRequestID] = useState(null);

  return (
    <RequestContext.Provider value={{ requestID, setRequestID }}>
      {children}
    </RequestContext.Provider>
  );
};

export default RequestProvider;
