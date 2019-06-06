import {
  USERDATA,
  CUSTOMERINFO,
  DEVICETYPES,
  LOADING,
  MAP_RAW_DATA_TO_MODIFIED_DATA,
  SET_VID
} from "../actions/types";

const initialState = {
  data: {},
  customerInfo: {},
  deviceTypes: {},
  isLoading: true,
  rawdatamapping: {},
  vid: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DEVICETYPES:
      return {
        ...state,
        deviceTypes: action.payload
      };
    case USERDATA:
      return {
        ...state,
        data: action.payload
      };
    case CUSTOMERINFO:
      return {
        ...state,
        customerInfo: action.payload
      };
    case LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case MAP_RAW_DATA_TO_MODIFIED_DATA:
      return {
        ...state,
        rawdatamapping: action.payload
      };
    case SET_VID:
      return {
        ...state,
        vid: action.payload
      };
    default:
      return state;
  }
}
