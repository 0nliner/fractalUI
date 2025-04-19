// reducer.js
const initialState = {
    data: [],
  };
  
const searchResultsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_SEARCH_RESULTS':
        return {
          ...state,
          data: action.payload,
        };
      default:
        return state;
    }
  };
  
export default searchResultsReducer;
  