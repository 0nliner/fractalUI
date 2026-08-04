// OverlayContext.tsx
import { Card, Paper } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React, { createContext, useState, ReactNode, FC, useContext } from 'react';


type OverlayProps = {
    children: ReactNode;
}
const DefaultOverlay: React.FC<OverlayProps> = ({ children }) => {
    const {clearOverlay} = useContext(OverlayContext);
    return (
        <div
            style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
            height: "100vh",
            width: "100vw",
            left: 0,
            top: 0
        }}>
            <Paper sx={{
                position: "absolute",
                top: "20px",
                height: window.innerHeight - 40,
                width: "50vw",
                right: "20px",
                background: "#1D1D1D",
                scrollbarWidth: "none",
                overflow: "scroll"}}>
                {children}
            </Paper>
            <div
                onClick={clearOverlay}  
                style={{
                    height: window.innerHeight - 20,
                    width: window.innerWidth - 20,
                    left: 0,
                    top: 0,
                    zIndex: -1
            }}></div>
        </div>
        
    );
  };


interface IOverlayContext {
  setOverlay: (content: ReactNode) => void;
  clearOverlay: () => void;
}

// Создаём контекст с "пустыми" заглушками для функций
export const OverlayContext = createContext<IOverlayContext>({
  setOverlay: () => {},
  clearOverlay: () => {},
});

interface OverlayProviderProps {
  children: ReactNode;
}

export const OverlayProvider: FC<OverlayProviderProps> = ({ children }) => {
  const [overlayContent, setOverlayContent] = useState<ReactNode>(null);

  const setOverlay = (content: ReactNode) => {
    setOverlayContent(content);
  };

  const clearOverlay = () => {
    setOverlayContent(null);
  };

  return (
    <OverlayContext.Provider value={{ setOverlay, clearOverlay }}>
      {children}
      {overlayContent?<DefaultOverlay>{overlayContent}</DefaultOverlay>:null}
    </OverlayContext.Provider>
  );
};
