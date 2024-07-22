export const initialState = {
    toggle: false,
    loginStatus: "not-authenticated",
    authError: null,
    isAuthenticated: false,
    authToken: null,
    user: null,
    clearance: null
  };
  
  export const reducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return {
          ...state,
          toggle: !state.toggle,
        };
      case "LOGIN_SUCCESS":
        return {
          ...state,
          loginStatus: "authenticated",
          isAuthenticated: true,
          authToken: action.payload.authToken,
          user: action.payload.user,
          clearance: action.payload.user.clearance,
          authError: null
        };
        case "UPDATE_USER":
          return {
            ...state,
            user: action.payload,
          };
      case "LOGIN_FAILURE":
        return {
          ...state,
          loginStatus: "failed",
          authError: action.payload.authError,
        };
      case "LOGOUT":
        return {
            ...initialState,
          };
      case "UNAUTHORIZED_ACCESS":
       return {
        ...state,
        authError: "Unauthorized access"
      };
      default:
        return state;
    }
  };
  