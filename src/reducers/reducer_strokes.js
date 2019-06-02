import { ADD_STROKE, CLEAR_STROKES, UPDATE_STROKES } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case ADD_STROKE:
      // Add stroke movements to array
      return [...state, action.payload];
    case UPDATE_STROKES:
      return action.payload;
    case CLEAR_STROKES:
      return [];
    default:
      return state;
  }
}
