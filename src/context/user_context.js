import { createContext, useContext, useState } from 'react';

const userContext = createContext();

export const User_provider = ({ children }) => {
  const [user , set_user] = useState('')
  const [refreshToken , set_refreshToken] = useState('')
  return (
    <userContext.Provider value={{ user ,set_user ,refreshToken ,set_refreshToken}}>
      {children}
    </userContext.Provider>
  );
};

export default userContext 