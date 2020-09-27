// import { connect } from 'mongoose';
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
// Alerts inside state will look like array of objects
// initialState = [{ id:1,msg:'You logged in',alertType:'success or danger'}]
const initialState = [];

// Action has TYPE and PAYLOAD(DATA) always
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      // Payload here in this TYPE is just the id
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
