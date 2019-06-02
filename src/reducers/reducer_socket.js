import { CREATE_SOCKET } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case CREATE_SOCKET: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
