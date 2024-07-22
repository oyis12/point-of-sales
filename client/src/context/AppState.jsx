// import { useReducer, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { reducer, initialState } from "../reducers/authReducer";
// import AppContext from "./AppContext";

// const initializeState = () => {
//   const token = Cookies.get("token");
//   const user = Cookies.get("user");
//   if (token && user) {
//     return {
//       ...initialState,
//       authToken: token,
//       user: JSON.parse(user),
//       loginStatus: "authenticated",
//     };
//   }
//   return initialState;
// };

// export const AppState = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, {}, initializeState);

//   useEffect(() => {
//     const token = Cookies.get("token");
//     const user = Cookies.get("user");
//     if (token && user) {
//       dispatch({
//         type: "LOGIN_SUCCESS",
//         payload: { authToken: token, user: JSON.parse(user) },
//       });
//     }
//   }, []);

//   const authenticate = async (email, password) => {
//     try {
//       const response = await axios.post('https://cashify-wzfy.onrender.com/api/v1/accounts/auth', {
//         email,
//         password
//       });

//       if (response.data.code === 600) {
//         Cookies.set("token", response.data.data.access_token, { expires: 1 });
//         Cookies.set("user", JSON.stringify(response.data.data.user), { expires: 1 });
//         dispatch({ type: "LOGIN_SUCCESS", payload: { authToken: response.data.data.access_token, user: response.data.data.user } });
//       } else {
//         dispatch({ type: "LOGIN_FAILURE", payload: { authError: response.data.data.msg } });
//       }
//     } catch (error) {
//       dispatch({
//         type: "LOGIN_FAILURE",
//         payload: { authError: error.response ? error.response.data.msg : "An error occurred during authentication." }
//       });
//     }
//   };

//   const handleToggle = (navigate) => {
//     dispatch({ type: "TOGGLE" });
//   };

//   const logout = (navigate) => {
//     Cookies.remove("token");
//     Cookies.remove("user");
//     dispatch({ type: "LOGOUT" });
//     setTimeout(() => {
//       navigate('/');
//     }, 100);
//   };

//   const getRole = (user) => {
//     if (!user || !user.previleges) return null;
//     if (user.previleges.includes(111)) return 'owner';
//     if (user.previleges.includes(112)) return 'productManager';
//     if (user.previleges.includes(113)) return 'storeManager';
//     if (user.previleges.includes(114)) return 'cashier';
//     return null;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.getFullYear();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();
  
//     const getDayWithSuffix = (day) => {
//       if (day > 3 && day < 21) return `${day}th`;
//       switch (day % 10) {
//         case 1: return `${day}st`;
//         case 2: return `${day}nd`;
//         case 3: return `${day}rd`;
//         default: return `${day}th`;
//       }
//     };
  
//     const formatTime = (hours, minutes, seconds) => {
//       const pad = (num) => String(num).padStart(2, '0');
//       const period = hours >= 12 ? 'PM' : 'AM';
//       const formattedHours = hours % 12 || 12;
//       return `${formattedHours}:${pad(minutes)}:${pad(seconds)} ${period}`;
//     };
  
//     return `${getDayWithSuffix(day)} ${month}, ${year} @ ${formatTime(hours, minutes, seconds)}`;
//   };

//   useEffect(() => {
//     if (state.authToken) {
//       Cookies.set("token", state.authToken, { expires: 1 });
//     } else {
//       Cookies.remove("token");
//     }
//     if (state.user) {
//       Cookies.set("user", JSON.stringify(state.user), { expires: 1 });
//     } else {
//       Cookies.remove("user");
//     }
//   }, [state.authToken, state.user]);

//   useEffect(() => {
//     if (state.user) {
//       // console.log('User role:', getRole(state.user));
//     }
//   }, [state.user]);

//   const values = {
//     ...state,
//     authenticate,
//     logout,
//     getRole,
//     handleToggle,
//     formatDate
//   };

//   return (
//     <AppContext.Provider value={values}>
//       {children}
//     </AppContext.Provider>
//   );
// };

import { useReducer, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { reducer, initialState } from "../reducers/authReducer";
import AppContext from "./AppContext";

const initializeState = () => {
  const token = Cookies.get("token");
  const user = Cookies.get("user");
  if (token && user) {
    return {
      ...initialState,
      authToken: token,
      user: JSON.parse(user),
      loginStatus: "authenticated",
    };
  }
  return initialState;
};

export const AppState = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {}, initializeState);

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    if (token && user) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { authToken: token, user: JSON.parse(user) },
      });
    }
  }, []);

  const authenticate = async (email, password) => {
    try {
      const response = await axios.post('https://cashify-wzfy.onrender.com/api/v1/accounts/auth', {
        email,
        password
      });

      if (response.data.code === 600) {
        Cookies.set("token", response.data.data.access_token, { expires: 1 });
        Cookies.set("user", JSON.stringify(response.data.data.user), { expires: 1 });
        dispatch({ type: "LOGIN_SUCCESS", payload: { authToken: response.data.data.access_token, user: response.data.data.user } });
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: { authError: response.data.data.msg } });
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { authError: error.response ? error.response.data.msg : "An error occurred during authentication." }
      });
    }
  };

  const handleToggle = (navigate) => {
    dispatch({ type: "TOGGLE" });
  };

  const logout = (navigate) => {
    Cookies.remove("token");
    Cookies.remove("user");
    dispatch({ type: "LOGOUT" });
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const updateUser = (userData) => {
    dispatch({
      type: "UPDATE_USER",
      payload: userData,
    });
  };

  const getRole = (user) => {
    if (!user || !user.previleges) return null;
    if (user.previleges.includes(111)) return 'owner';
    if (user.previleges.includes(112)) return 'productManager';
    if (user.previleges.includes(113)) return 'storeManager';
    if (user.previleges.includes(114)) return 'cashier';
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    const getDayWithSuffix = (day) => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
      }
    };
  
    const formatTime = (hours, minutes, seconds) => {
      const pad = (num) => String(num).padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${pad(minutes)}:${pad(seconds)} ${period}`;
    };
  
    return `${getDayWithSuffix(day)} ${month}, ${year} @ ${formatTime(hours, minutes, seconds)}`;
  };

  useEffect(() => {
    if (state.authToken) {
      Cookies.set("token", state.authToken, { expires: 1 });
    } else {
      Cookies.remove("token");
    }
    if (state.user) {
      Cookies.set("user", JSON.stringify(state.user), { expires: 1 });
    } else {
      Cookies.remove("user");
    }
  }, [state.authToken, state.user]);

  useEffect(() => {
    if (state.user) {
      // console.log('User role:', getRole(state.user));
    }
  }, [state.user]);

  const values = {
    ...state,
    authenticate,
    logout,
    getRole,
    handleToggle,
    formatDate,
    updateUser
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};
