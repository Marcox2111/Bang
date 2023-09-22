import React, { useState, useContext } from 'react';

const GlobalIdContext = React.createContext({
  globalIdCounter: 0,
  incrementGlobalId: () => {}
});

export function GlobalIdProvider({ children }) {
  const [globalIdCounter, setGlobalIdCounter] = useState(0);

  const incrementGlobalId = () => {
    setGlobalIdCounter(prevId => prevId + 1);
  };

  return (
      <GlobalIdContext.Provider value={{ globalIdCounter, incrementGlobalId }}>
        {children}
      </GlobalIdContext.Provider>
  );
}

export function useGlobalId() {
  return useContext(GlobalIdContext);
}

export default GlobalIdContext;
