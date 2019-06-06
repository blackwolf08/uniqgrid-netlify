import { FETCH_CONNECTION_INFO } from "../actions/types";

const DEFAULT_STATE = {
  data: {}
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH_CONNECTION_INFO:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};
