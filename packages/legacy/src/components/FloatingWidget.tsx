import Draggable from 'react-draggable';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

// Стиль для основного контейнера виджета
const FloatingWidgetContainer = styled('div')({
  position: 'fixed',
  top: '100px',
  left: '100px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
});

// Стиль для топбара
const TopBar = styled('nav')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(24, 26, 27, 0.2)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  width: '100%',
  height: '20px',
  border: '1px solid #ccc',
  borderRadius: '100px',
  padding: '5px 10px',
});

// Стиль для содержимого виджета
const WidgetContent = styled('div')({
  marginTop: '5px',
  borderRadius: '20px',
  // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.7)',
  // backgroundColor: 'white',
  // padding: '10px',
});

// Компонент FloatingWidget
const FloatingWidget: React.FC<{
  height?: string;
  width?: string;
  widgetTitle: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ height, width, widgetTitle, onClose, children }) => {
  return (
    <Draggable>
      <FloatingWidgetContainer style={{ height, width }}>
        {/* Топбар */}
        <TopBar>
          <Typography variant="subtitle2">{widgetTitle}</Typography>
          <div onClick={onClose} style={{ cursor: 'pointer' }}>
            <CloseIcon color="error" fontSize="small" />
          </div>
        </TopBar>

        {/* Содержимое виджета */}
        <WidgetContent>{children}</WidgetContent>
      </FloatingWidgetContainer>
    </Draggable>
  );
};

export { FloatingWidget };