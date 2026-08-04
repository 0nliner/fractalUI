export const resetSections = (payload) => ({
  type: "RESET_SECTIONS",
  payload,
}); 

export const setSections = (payload) => ({
  type: "SET_SECTIONS",
  payload,
});

export const applyExistingSectionConfigurationOnSelection = ({selection, sectionId, sheet}) => ({
  type: "APPLY_EXISTING_SECTION_CONFIGURATION_ON_SELECTED",
  selection,
  sheet,
  sectionId,
});

// 
export const updateSearchResults = (payload) => ({
    type: 'UPDATE_SEARCH_RESULTS',
    payload,
  });

  // SECTIONS
export const createNewSection = (payload) => ({
  type: "CREATE_NEW_SECTION",
  payload
});

export const addColumn = (sectionId, payload) => ({
  type: "ADD_COLUMN",
  sectionId: sectionId,
  payload
});

export const changeColumn = ({sectionId, colId, payload}) => ({
  type: "CHANGE_COLUMN",
  sectionId: sectionId,
  colId: colId,
  payload
});


export const deleteColumn = ({sectionId, colId}) => ({
  type: "DELETE_COLUMN",
  sectionId: sectionId,
  colId: colId,
});


// -------------------- sections

export const changeSection = (sectionId, payload) => ({
  type: "CHANGE_SECTION",
  sectionId: sectionId,
  payload
});


export const deleteSection = (sectionId) => ({
  type: "DELETE_SECTION_INDEX",
  sectionId: sectionId,
}); 


// VENDORS
export const setVendors = (vendors) => ({
  type: 'SET_VENDORS',
  vendors: vendors
});


export const addVendor = ({vendorIndex, payload}) => ({
  type: "ADD_VENDOR",
  vendorIndex: vendorIndex,
  payload,
});

export const changeVendor = ({vendorIndex, payload}) => ({
  type: "ADD_VENDOR",
  vendorIndex: vendorIndex,
  payload,
});


export const deleteVendor = (vendorIndex) => ({
  type: "DELETE_VENDOR",
  vendorIndex: vendorIndex,
}); 
