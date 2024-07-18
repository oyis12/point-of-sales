// import { createContext } from "react";
// const AppContext = createContext()

// export default AppContext;

import { createContext, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export default AppContext;