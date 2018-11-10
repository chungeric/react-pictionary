import {
  REMOVE_PLAYER,
  UPDATE_PLAYERS,
  ADD_STROKE,
  CLEAR_STROKES
} from './types';

export function removePlayer() {
  return {
    type: REMOVE_PLAYER,
    payload: null
  };
}

export function updatePlayers(numPlayers) {
  return {
    type: UPDATE_PLAYERS,
    payload: numPlayers
  };
}

export function storeStroke(x, y, movementType) {
  return {
    type: ADD_STROKE,
    payload: {
      position: [x, y],
      movementType
    }
  };
}

export function clearStrokes() {
  return {
    type: CLEAR_STROKES,
    payload: null
  }
}
