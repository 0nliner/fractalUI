// @ts-nocheck
// reducer.js
const initialState = {
    sections: [],
    currentSectionIndex: null
  };


const createColumnData = ({index, alias, min, max, isHardcoded, hardcodedValue}) => {
    return {
        index: index,
        alias: alias,
        productAttributeName: "",
        fieldType: "str",
        isHardcoded: isHardcoded,
        hardcodedValue: hardcodedValue,
        start: min.row? min.row + 1 : null,
        end: max.row? max.row + 1 : null
    };
}

// TODO: переделать под ReactContext
const vendorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_VENDORS":
            return {...state, vendors: action.vendors};

        case 'CREATE_NEW_VENDOR':
            let columns = []

            if (action.payload.selection) {
                const min = action.payload.selection.min
                const max = action.payload.selection.max
                const columns_names = getLettersBetween(min.colId, max.colId);
                columns = columns_names.map((alias, index)=>createColumnData({index, alias, min, max}));
                // console.log(columns)
            }
            return {
                ...state,
                sections: [
                    ...state.sections,
                    {index: state.sections.length + 1,
                     columns: columns,
                     ...action.payload,
                    }]
            };
        case 'ADD_CONFIGURATION':
            return {
                ...state,
                sections: state.sections.map(section => 
                    section.id === action.sectionId
                        ? { ...section, columns: [...section.columns, action.payload]} 
                        : section
                )
            };
        case "CHANGE_VENDOR":
            // console.log('like edited', );
            return {
                ...state,
                sections: state.sections.map(section => 
                    section.id === action.sectionId
                        ? { ...section, columns: [...section.columns.map(col=>
                            col.id === action.colId
                            ? {...col, ...action.payload} : col
                        )]} 
                        : section
                )
            };
        case 'CHANGE_VENDOR':
            return {
                ...state,
                sections: state.sections.map(section => 
                    section.id === action.sectionId
                        ? { ...section, ...action.payload} 
                        : section
                ),
            };
        case 'DELETE_VENDOR_INDEX':
            return {
                ...state,
                sections: state.sections.filter(section => section.id !== action.sectionId)
            };
        default:
            return state;
        
    }
  };
  
export default vendorsReducer;
