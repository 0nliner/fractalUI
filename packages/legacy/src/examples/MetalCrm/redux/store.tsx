// @ts-nocheck
import { createStore } from 'redux';
import rootReducer from './reducers'; // Импортируйте корневой редюсер

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Для интеграции с Redux DevTools
);

export default store;
