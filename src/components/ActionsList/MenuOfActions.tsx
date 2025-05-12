import React from "react";
import { useMemo } from "react";

import { Action } from "@easyUI/contentWrappers";
import { ActionWrapper, ActionWrapperProps } from ".";

import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { v4 } from "uuid";


export interface MenuItemComponentProps extends ActionWrapperProps {
    action: Action;
    handleCloseContextMenu: () => void;
  }
  
export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
    action,
    handleCloseContextMenu,
    ...props
  }) => (
    <ActionWrapper action={action} handleCloseContextMenu={handleCloseContextMenu} {...props}>
      {/* @ts-ignore */}
      <MenuItem
        size="small"
        style={{ fontSize: 10, color: "white" }}
        onClick={handleCloseContextMenu}
      >
        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
          {action.icon??<div>{action.icon}</div>}
          <div>
            {action.label}
          </div>
        </div>
      </MenuItem>
    </ActionWrapper>
  );


export interface UseMenuOfActionsProps<T> {
    actions: Action[];
    injectionValues: T
}


export interface MenuButtonProps {
    buttonId: string;
    isOpen: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    menuContent: React.ReactNode;
  }
  
export const MenuButtonComponent = React.memo(({
    buttonId,
    isOpen,
    anchorEl,
    onClose,
    onClick,
    menuContent
  }: MenuButtonProps) => (
    <div>
      <IconButton
        size="small"
        aria-label="more"
        id={buttonId}
        aria-controls={isOpen ? buttonId : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        aria-haspopup="true"
        onClick={onClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={buttonId}
        MenuListProps={{ 'aria-labelledby': buttonId }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 48 * 4.5,
              width: '28ch',
            },
          },
        }}
      >
        {menuContent}
      </Menu>
    </div>
  ));


export const useMenuOfActions = <T,>({actions, injectionValues}: UseMenuOfActionsProps<T>) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isContextOpened = Boolean(anchorEl);
    const buttonId = React.useMemo(()=>v4(), [])

    const handleClickContextMenu = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
    }, []);
    
    const handleCloseContextMenu = React.useCallback(
        () => {
            setAnchorEl(null);
    }, [])

    // TODO: оптимизировать рендер
    const menuContent = useMemo(() => 
        isContextOpened 
          ? actions.map((action) => (
              <MenuItemComponent
                key={action.operationId}
                action={action}
                // @ts-ignore
                injectionValues={injectionValues}
                handleCloseContextMenu={handleCloseContextMenu}
              />
            ))
          : null,
        [actions, injectionValues, isContextOpened, handleCloseContextMenu]
      );

    return {
        MenuButton: (
            <MenuButtonComponent
              buttonId={buttonId}
              isOpen={isContextOpened}
              anchorEl={anchorEl}
              onClose={handleCloseContextMenu}
              onClick={handleClickContextMenu}
              menuContent={menuContent}
            />),
        menuContent,
        anchorEl,
        isContextOpened,
        handleClickContextMenu,
        handleCloseContextMenu
      };
}

