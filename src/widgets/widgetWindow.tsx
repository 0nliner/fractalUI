// WidgetWindow.tsx
import { useWidgets } from './widgetsProvider';
import { useWidgetsStore, WidgetInstance } from './store';

import { useShallow } from "zustand/shallow";
import { memo, useMemo } from 'react';


const WidgetWindow = memo(({ widgetInstance }: { widgetInstance: WidgetInstance }) => {
  const { getWidget } = useWidgets();
  const WidgetComponent = getWidget(widgetInstance.widgetName);
  const { closeWidget } = useWidgetsStore(useShallow(
    (state) => ({
      closeWidget: state.closeWidget
    })
  ));

  if (!WidgetComponent) {
    return <div>Widget not found: {widgetInstance.widgetName}</div>;
  }
  
  // @ts-ignore
  const windowName = useMemo<string>(() => widgetInstance.widgetParams?.windowName || widgetInstance.widgetName, [])

  return (
    <div style={{ order: widgetInstance.orderIndex,
                  position: "relative",
                  paddingTop: "10px",
                  background: "rgb(29, 29, 29)",
                  borderRadius: 13,
                  height: "85vh",
                  overflow: "scroll",
                  scrollbarWidth: "none",
                  minWidth: "310px"
                  }}>
      <div style={{position: "absolute", right: "10px", top: "4px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "94%", backgroundColor: "rgb(29, 29, 29)", zIndex: 2}}>
        <div style={{fontSize: "0.8em", color: "rgb(69, 69, 69)"}}>{windowName}</div>
        <div style={{background: "#a74a4a", height: 13, width: 13, borderRadius: 1000}} onClick={()=>closeWidget(widgetInstance.id)}></div>
      </div>
      <WidgetComponent {...widgetInstance.widgetParams} />
    </div>
  );
});

// WidgetsContainer.tsx
export const WidgetsContainer = () => {
  const { widgets } = useWidgetsStore(useShallow(
    (state) => ({
      widgets: state.widgets
    })
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', overflowX: "scroll", scrollbarWidth: "none" }}>
      <div style={{width: "70px"}}></div>
      {widgets
        .filter(widget=>Boolean(widget.widgetName))
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((widget) => (
          <WidgetWindow key={widget.id} widgetInstance={widget} />
        ))}
    </div>
  );
};
