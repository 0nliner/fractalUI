// widgets.store.ts
import { v4 } from 'uuid';
import { create } from 'zustand';

type WidgetParams = Record<string, unknown>;

export interface WidgetInstance {
  id: string;
  widgetName: string;
  widgetParams: WidgetParams;
  orderIndex: number;
}

// NEW_WINDOW - создаёт вовое окно
// OPEN_IN_EXISTING_WINDOW (передать в парамтеры id окна windowId)

export const NEW_WINDOW = "NEW_WINDOW"
export const OPEN_IN_EXISTING_WINDOW = "OPEN_IN_EXISTING_WINDOW"

export type WidgetOpenningMode = typeof NEW_WINDOW | typeof OPEN_IN_EXISTING_WINDOW;


interface WidgetsStore {
  widgets: WidgetInstance[];
  addBlankWindow: () => string;
  openWidget: (
    widgetName: string, 
    params?: WidgetParams, 
    mode?: WidgetOpenningMode
  ) => string;
  reorderWidget: (widgetId: string, newIndex: number) => void;
  closeWidget: (widgetId: string) => void;
}

export const useWidgetsStore = create<WidgetsStore>((set) => ({
  widgets: [],

  addBlankWindow: () => {
    console.log("adding new blank window");
    const widgetId = `widget-${v4()}`
    set((state) => ({
      widgets: [
        ...state.widgets,
        {
          id: widgetId,
          widgetName: '',
          widgetParams: {},
          orderIndex: state.widgets.length,
        },
      ],
    }));
    return widgetId
  },

  openWidget: (widgetName, params = {}, mode = NEW_WINDOW) => {
    let widgetId: string;

    if (mode === OPEN_IN_EXISTING_WINDOW && !params.windowId) {
      throw new Error(
        `You must provide windowId param when using ${OPEN_IN_EXISTING_WINDOW} mode`
      );
    }

    set((state) => {
      switch (mode) {
        case NEW_WINDOW:
          widgetId = `${widgetName}-${Date.now()}`;
          const maxIndex = Math.max(...state.widgets.map(w => w.orderIndex), -1);
          
          return {
            widgets: [
              ...state.widgets,
              {
                id: widgetId,
                widgetName,
                widgetParams: params,
                orderIndex: maxIndex + 1,
              }
            ]
          };
        case OPEN_IN_EXISTING_WINDOW:
          // @ts-ignore
          widgetId = params.windowId!;
          return {
            widgets: state.widgets.map(widget => 
              widget.id === widgetId ? {
                ...widget,
                widgetName,
                widgetParams: params,
              } : widget
            )
          };
        default:
          throw new Error(`Unknown mode: ${mode}`);
      }
    });

    return widgetId!;
  },
  
  reorderWidget: (widgetId, newIndex) => {
    set((state) => {
      const widgetToMove = state.widgets.find((w) => w.id === widgetId);
      if (!widgetToMove) return state;
      
      const currentIndex = widgetToMove.orderIndex;
      if (currentIndex === newIndex) return state;
      
      const direction = newIndex > currentIndex ? 1 : -1;
      
      const updatedWidgets = state.widgets.map((widget) => {
        // Перемещаемый виджет
        if (widget.id === widgetId) {
          return { ...widget, orderIndex: newIndex };
        }
        
        // Виджеты между старым и новым положением
        if (
          (direction === 1 && 
           widget.orderIndex > currentIndex && 
           widget.orderIndex <= newIndex) ||
          (direction === -1 && 
           widget.orderIndex < currentIndex && 
           widget.orderIndex >= newIndex)
        ) {
          return { ...widget, orderIndex: widget.orderIndex - direction };
        }
        
        return widget;
      });
      
      return { widgets: updatedWidgets };
    });
  },
  
  closeWidget: (widgetId) => {
    set((state) => ({
      widgets: state.widgets.filter((widget) => widget.id !== widgetId),
    }));
  },
}));