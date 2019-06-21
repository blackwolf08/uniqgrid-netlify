import { DEVICE_POOL, OUTPUT_ARR } from '../actions/types';

const DEFAULT_STATE = {
  data: '',
  device_pool: ''
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case OUTPUT_ARR:
      return {
        ...state,
        data: action.payload
      };
    case DEVICE_POOL:
      return {
        ...state,
        device_pool: action.payload
      };
    default:
      return state;
  }
};
