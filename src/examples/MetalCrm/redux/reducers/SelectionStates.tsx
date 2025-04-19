// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';


// reducer.js
const initialState = {
    sections: [],
    currentSectionIndex: null
  };




function getLettersBetween(char1, char2) {
    // Проверяем, что оба символа - это заглавные буквы
    if (char1.length !== 1 || char2.length !== 1 || 
        !char1.match(/[A-Z]/) || !char2.match(/[A-Z]/)) {
        throw new Error("Обе буквы должны быть заглавными буквами английского алфавита.");
    }

    // Приводим буквы к кодам ASCII
    const start = char1.charCodeAt(0);
    const end = char2.charCodeAt(0);

    // Создаем массив для хранения букв между ними
    const letters = [];

    // Заполняем массив буквами от start до end (исключая сами буквы)
    for (let i = start; i <= end; i++) {
        letters.push(String.fromCharCode(i));
    }
    return letters;
}


const ABC = getLettersBetween("A", "Z");

const calcBiasBetweenLetters = (a1, a2) => {
    const indexA1 = ABC.indexOf(a1);
    const indexA2 = ABC.indexOf(a2);

    if (indexA1 === -1 || indexA2 === -1) {
        alert('Одна из букв не найдена в массиве.');
    } else {
        const distance = indexA1 - indexA2;
        return distance;
    }
}

function getAlphabetIndex(letter) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const lowerCaseLetter = letter.toLowerCase();
    const index = alphabet.indexOf(lowerCaseLetter);

    if (index !== -1) {
        return index; // Возвращаем индекс, начиная с 1
    } else {
        return -1; // Если символ не является буквой алфавита
    }
}

export {getAlphabetIndex};


const createColumnData = ({index, alias, min, max, isHardcoded, hardcodedValue}) => {
    return {
        id: uuidv4(),
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
const selectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case "RESET_SECTIONS":
            return {...state, sections: action.payload};

        case "SET_SECTIONS":
            return {...state, ...action.payload};

        case "APPLY_EXISTING_SECTION_CONFIGURATION_ON_SELECTED":
            // сначала ищем конфигурацию, которую хотим задублировать
            const configurationSourceSection = state.sections.find(section=>section.id===action.sectionId);
            // TODO: проверяем, что секция по размеру = выделенному
            const duplicatedSection = JSON.parse(JSON.stringify(configurationSourceSection));
            // не забудем сгенерить новый id для секции
            duplicatedSection.id = uuidv4();
            duplicatedSection.selection = action.selection;
            duplicatedSection.sheet = action.sheet;
            duplicatedSection.title = `КОПИЯ ${duplicatedSection.title}`;
            const dubicatedColumnsAliasesRange = getLettersBetween(action.selection.min.colId, action.selection.max.colId);

            const newLetterBias = calcBiasBetweenLetters(dubicatedColumnsAliasesRange[0], duplicatedSection.columns[0].alias);
            duplicatedSection.columns.forEach((column, index)=>{
                column.start = action.selection.min.row + 1;
                column.end = action.selection.max.row + 1;
                column.id = uuidv4();
                column.alias = column.alias?ABC[ABC.indexOf(column.alias) + newLetterBias]:column.alias;
                column.index = column.alias?ABC.indexOf(column.alias):0;
            });
            return {...state, sections: [...state.sections, duplicatedSection]};

        case 'CREATE_NEW_SECTION':
            let columns = []

            if (action.payload.selection) {
                const min = action.payload.selection.min
                const max = action.payload.selection.max
                const columns_names = getLettersBetween(min.colId, max.colId);
                columns = columns_names.map((alias)=>createColumnData({index: ABC.indexOf(alias), alias, min, max}));
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

        case 'ADD_COLUMN':
            return {
                ...state,
                sections: state.sections.map(section => 
                    section.id === action.sectionId
                        ? { ...section, columns: [...section.columns, {id: uuidv4(), ...action.payload}]} 
                        : section
                )
            };

        case "CHANGE_COLUMN":
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

        case 'DELETE_COLUMN':
            return {
                ...state,
                sections: state.sections.map(section => {
                    // console.log("to find sec, col", action.sectionId, action.colId);
                    return (section.id === action.sectionId
                        ? { 
                            ...section, 
                            columns: section.columns.filter(col => {
                                // console.log("trying", col.id, col.id !== action.colId);
                                return col.id !== action.colId;
                            })
                        }
                        : section
                    );
                })
            };            
        case 'CHANGE_SECTION':
            // console.log('action', action.payload);
            return {
                ...state,
                sections: state.sections.map(section => 
                    section.id === action.sectionId 
                        ? { ...section, ...action.payload} 
                        : section
                ),
            };
        case 'DELETE_SECTION_INDEX':
            return {
                ...state,
                sections: state.sections.filter(section => section.id !== action.sectionId)
            };
        default:
            return state;
        
    }
  };
  
export default selectionReducer;
