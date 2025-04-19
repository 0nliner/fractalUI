// @ts-nocheck
import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import 'react-datasheet-grid/dist/style.css'
import './style.css'

import { createNewSection, 
         applyExistingSectionConfigurationOnSelection} 
        from '../redux/actions'; 

import { ParsingConfiguratorContext } from '.';

import {v4 as uuid4} from "uuid";
import { Stack, Button } from '@mui/material';


const ContextMenu = ({
    clientX,
    clientY,
    items,
    cursorIndex,
    close
    }) => {
      const dispatch = useDispatch();
      const {currentSelection, tableRef, 
             activeSheet,
             selectionFrom, setSelectionFrom,
             selectionTo, setSelectionTo
            } = useContext(ParsingConfiguratorContext);

      const [showConfigSelectionMenu, setShowConfigSelectionMenu] = React.useState(false);

      const createSectionFromSelected = () => { 
        dispatch(createNewSection({sheet: activeSheet,
                                   selection: currentSelection,
                                   id: uuid4()}));
        close();
      }
  
      const selectAllLower = () => {
      }

      const setSelectionAreaByFromTo = () => {
        const min = selectionFrom;
        // min.row = min.row - 1;
        
        const max = currentSelection.min;
        // max.row = max.row -1;
        
        tableRef?.current?.setSelection({min, max});
        setSelectionFrom(null);
        close();
      }

      const actions = [
        {label: "создать секцию", onClick: createSectionFromSelected},
        {label: "применить существующую настройку", onClick: ()=>{setShowConfigSelectionMenu(true)}},
        {label: "начать выделение тут", onClick: ()=>{
          setSelectionFrom(currentSelection.min);
          close()}},
        {label: "закончить выделение тут", onClick: setSelectionAreaByFromTo},
        {label: "выделить всё что ниже", onClick: selectAllLower},
        {label: "выделить всё что выше"},
      ];

      return (
        <div id="contextMenu" style={{zIndex: 100, position: "fixed", top: clientY, left: clientX, display: 'flex', gap: 10}}>
          <div style={{width: 260,
                       background: "#161616",
                       height: 210,
                       overflowY: "scroll",      
                       color: "white",
                       paddingBottom: 15,
                       paddingTop: 15,
                       borderRadius: 7,
                       boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
                       }}>
            <div onClick={close}
                style={{position: "absolute",
                        right: -10,
                        top: -10,
                        height: 13,
                        width: 13}}><b>X</b>
                </div>
            <div id='contextMenuActionSelection'>
                <div style={{top: clientX, left: clientY, display: "flex", flexDirection: "column", gap: 5, justifyContent: "space-between", width: 245}}>
                  {actions.map((action, index)=>(<div key={index} onClick={action.onClick}>{action.label}</div>))}          
                </div>
            </div>
          </div>
          {showConfigSelectionMenu?<ConfigurationSelectionMenu exitMenu={()=>setShowConfigSelectionMenu(false)}/>:null}
        </div>
      );
};


const ConfigurationSelectionMenu = ({exitMenu}) => {
  const {currentSelection, activeSheet} = React.useContext(ParsingConfiguratorContext);
  const [chosenId, setChosenId] = React.useState();

  const sections = useSelector(state => state.selection.sections);
  const dispatch = useDispatch();

  const applyExistingConfiguration = ({selection, sectionId}) => {    
    dispatch(applyExistingSectionConfigurationOnSelection(
      {selection, sectionId, sheet: activeSheet}
    ));
    exitMenu();
  };

  return (
    <div style={{width: 245,
                 height: 210,
                 overflowY: "scroll",
                 background: "#161616",
                 color: "white",
                 paddingBottom: 15,
                 paddingTop: 15,
                 borderRadius: 7,
                 boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"}}>
      <Stack direction={'column'}>
        {sections.map(({title, id})=>(
          <div onClick={()=>setChosenId(id)}
                style={{border: chosenId===id?"solid 1px rgb(69, 128, 230)":null}}>
            {title}
          </div>))}
      <Button onClick={()=>{applyExistingConfiguration(
                  {selection: currentSelection,
                   sectionId: chosenId});
                   exitMenu();
                   }}>
        Применить
      </Button>
      </Stack>
    </div>
  );
}

export {ContextMenu};