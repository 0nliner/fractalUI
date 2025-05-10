import React, { createContext, useContext, useState, useMemo } from 'react';

type WidgetComponent = React.FC<any>;

interface WidgetsContextType {
  widgets: Record<string, WidgetComponent>;
  registerWidget: (name: string, component: WidgetComponent) => void;
  unregisterWidget: (name: string) => void;
  getWidget: (name?: string) => WidgetComponent | undefined;
}

export const WidgetsContext = createContext<WidgetsContextType>({
  widgets: {},
  registerWidget: () => {},
  unregisterWidget: () => {},
  getWidget: () => undefined,
});

export const WidgetsProvider: React.FC<{
  children: React.ReactNode;
  initialWidgets: Record<string, WidgetComponent>;
}> = ({ children, initialWidgets }) => {
  const [widgets, setWidgets] = useState<Record<string, WidgetComponent>>(initialWidgets? initialWidgets: {});

  const value = useMemo<WidgetsContextType>(() => ({
    widgets,
    registerWidget: (name, component) => {
      setWidgets(prev => ({ ...prev, [name]: component }));
    },
    unregisterWidget: (name) => {
      setWidgets(prev => {
        const newWidgets = { ...prev };
        delete newWidgets[name];
        return newWidgets;
      });
    },
  
    getWidget: (name) => {
      if (name) {
        return widgets[name]}
      }
  }), [widgets]);

  return (
    <WidgetsContext.Provider value={value}>
      {children}
    </WidgetsContext.Provider>
  );
};

export const useWidgets = (): WidgetsContextType => {
  return useContext(WidgetsContext);
};
