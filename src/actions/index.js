// export const DRAW_STROKE = 'stroke_drawn';
// export const CLEAR_STROKES = 'clear_strokes';
//
// export function drawStroke(strokes) {
//   return {
//     type: DRAW_STROKE,
//     payload: []
//   };
// }
//
// export function clearStrokes() {
//   return {
//     type: CLEAR_STROKES,
//     payload: null
//   };
// }

export const ADD_PLAYER = 'add_player';
export const REMOVE_PLAYER = 'remove_player';
export const UPDATE_PLAYERS = 'update_players';

export function addPlayer() {
  return {
    type: ADD_PLAYER,
    payload: null
  };
}

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
