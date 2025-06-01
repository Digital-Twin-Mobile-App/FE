import React, { createContext, useContext, useState } from 'react';

interface RefreshContextType {
  refreshHome: () => void;
  shouldRefresh: boolean;
  setShouldRefresh: (value: boolean) => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const refreshHome = () => {
    setShouldRefresh(true);
  };

  return (
    <RefreshContext.Provider value={{ refreshHome, shouldRefresh, setShouldRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
}; 