import { API_TOKEN_INITIALIZE, API_TOKEN_RESET } from '../../constants/api';

export function receiveAPIToken (token) {
  return {
    type: API_TOKEN_INITIALIZE,
    token: token
  };
}

export function resetAPIToken () {
  return {
    type: API_TOKEN_RESET
  };
}
