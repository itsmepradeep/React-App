import {GOOGLE_API_LOADED, SET_AUTHENTICATED, SET_ERROR, SET_USER_PROFILE} from "../actions/appActions";

const INITIAL_STATE = {
    googleApiLoaded: false,
    authenticated: false,
    userProfile: null,
    error: ''
}

function appReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GOOGLE_API_LOADED:
            return {...state, googleApiLoaded: true }
        case SET_AUTHENTICATED:
            return {...state, authenticated: action.isAuthenticated}
        case SET_USER_PROFILE:
            return {...state, userProfile: action.userProfile }
        case SET_ERROR:
            return {...state, error: action.error}
        default: return state;
    }
}

export default appReducer