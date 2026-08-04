// @fractalui/data — служебный слой: обёртка над hey-api SDK + Zustand-сторы.
// Server-state: hey-api (+ опц. @tanstack/react-query плагин). UI-state: Zustand.
// Единственный слой (вместе с runtime), которому можно знать про SDK и стор.
export const DATA_PACKAGE = '@fractalui/data' as const;
