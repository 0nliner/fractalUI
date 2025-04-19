import { combineReducers } from 'redux';
import searchResultsReducer from './SearchResults';
import selectionReducer from './SelectionStates';

const rootReducer = combineReducers({
    searchResults: searchResultsReducer,
    selection: selectionReducer
});

export default rootReducer;
