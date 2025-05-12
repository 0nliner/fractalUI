// WidgetWindow.tsx
import { useWidgets } from './widgetsProvider';
import { useWidgetsStore, WidgetInstance } from './store';

import { useShallow } from "zustand/shallow";
import { memo } from 'react';


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
  
  return (
    <div style={{ order: widgetInstance.orderIndex, position: "relative", paddingTop: "10px", background: "rgb(29, 29, 29)", borderRadius: 13 }}>
      <div style={{position: "absolute", right: "10px", top: "4px", display: "flex"}}>
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
      {widgets
        .filter(widget=>Boolean(widget.widgetName))
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((widget) => (
          <WidgetWindow key={widget.id} widgetInstance={widget} />
        ))}
    </div>
  );
};
