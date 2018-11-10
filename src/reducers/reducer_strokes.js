import { ADD_STROKE, CLEAR_STROKES } from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case ADD_STROKE:
      // Add stroke movements to array
      return [...state, action.payload];
    case CLEAR_STROKES:
      return [];
  }
  return state;
}
