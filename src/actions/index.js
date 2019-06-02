import {
  UPDATE_PLAYER_COUNT,
  REMOVE_PLAYER,
  ADD_STROKE,
  CLEAR_STROKES,
  UPDATE_STROKES,
  CREATE_SOCKET,
} from './types';

export function updatePlayerCount(newPlayerCount) {
  return {
    type: UPDATE_PLAYER_COUNT,
    payload: newPlayerCount,
  };
}

export function removePlayer() {
  return {
    type: REMOVE_PLAYER,
    payload: null,
  };
}

export function storeStroke(x, y, movementType) {
  return {
    type: ADD_STROKE,
    payload: {
      position: [x, y],
      movementType,
    },
  };
}

export function clearStrokes() {
  return {
    type: CLEAR_STROKES,
    payload: null,
  };
}

export function updateStrokes(strokes) {
  return {
    type: UPDATE_STROKES,
    payload: strokes,
  };
}

export function createSocket(socket) {
  return {
    type: CREATE_SOCKET,
    payload: socket,
  };
}
