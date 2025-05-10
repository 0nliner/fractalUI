// WidgetWindow.tsx
import { useWidgets } from './widgetsProvider';
import { useWidgetsStore, WidgetInstance } from './store';

import { useShallow } from "zustand/shallow";
import { memo } from 'react';


const WidgetWindow = memo(({ widgetInstance }: { widgetInstance: WidgetInstance }) => {
  const { getWidget } = useWidgets();
  const WidgetComponent = getWidget(widgetInstance.widgetName);
  
  if (!WidgetComponent) {
    return <div>Widget not found: {widgetInstance.widgetName}</div>;
  }
  
  return (
    <div style={{ order: widgetInstance.orderIndex }}>
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
