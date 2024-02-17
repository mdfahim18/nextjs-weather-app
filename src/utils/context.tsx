import React, { createContext, useContext, useState } from 'react';

interface GlobalState {
  globalState: any;
  setGlobalState: React.Dispatch<React.SetStateAction<any>>;
}

const AppStateContext = createContext<GlobalState | undefined>(undefined);

export const AppStateProvider: React.FC = ({ children }: any) => {
  const [globalState, setGlobalState] = useState<any>('sylhet');

  return (
    <AppStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): GlobalState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
