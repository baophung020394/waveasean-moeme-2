export const createErrorReducer =
  (actionType: any) =>
  (state: any = null, action: any) => {
    switch (action.type) {
      case `${actionType}_INIT`:
        return null;
      case `${actionType}_ERROR`:
        return action.error;
      default:
        return state;
    }
  };

export const createIsFetchingReducer =
  (actionType: any) =>
  (state = false, action: any) => {
    switch (action.type) {
      case `${actionType}_INIT`: {
        return true;
      }
      case `${actionType}_SUCCESS`:
      case `${actionType}_ERROR`:
        return false;
      default:
        return state;
    }
  };

export const logoutReducer =
  (actionType: any) =>
  (state: any = null, action: any) => {
    switch (action.type) {
      case `${actionType}_INIT`:
        return false;
      case `${actionType}_SUCCESS`:
      case `${actionType}_ERROR`:
        return null;
      default:
        return state;
    }
  };
