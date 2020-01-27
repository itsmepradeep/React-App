import * as Actions from '../actions/appActions';

export function googleApiLoaded() {
    return { type: Actions.GOOGLE_API_LOADED }
} 

export function setAuthenticated(isAuthenticated = false) {
    return { type: Actions.SET_AUTHENTICATED, isAuthenticated }
} 

export function setError(error = '') {
    return { type: Actions.SET_ERROR, error }
} 

export function setUserProfile(userProfile = {}) {
    return { type: Actions.SET_USER_PROFILE, userProfile }
} 