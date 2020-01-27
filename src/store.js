import { createStore } from 'redux';
import AppReducer from './reducers/app-reducer';

const store = createStore(AppReducer);

console.log(store.getState())

export default store;

store.subscribe(() => console.log(store.getState()))
