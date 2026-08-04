import type { ReactNode } from 'react';
import type { EditorIconName } from './types';

/**
 * Встроенные иконки редактора.
 *
 * Кит не зависит от иконочной библиотеки (см. `EditorTabs`): приложение может
 * передать свой набор через проп `icons`, а здесь лежит начертание по
 * умолчанию — один стиль, обводка 1.6, размер 14.
 */
function Ic({ children }: { children: ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Hn({ digit }: { digit: string }) {
  return (
    <Ic>
      <path d="M4 5v14M12 5v14M4 12h8" />
      <text x="14" y="19" fontSize="11" fill="currentColor" stroke="none">
        {digit}
      </text>
    </Ic>
  );
}

export const defaultIcons: Record<EditorIconName, ReactNode> = {
  grip: (
    <Ic>
      <circle cx="9" cy="6" r="1.2" fill="currentColor" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" />
      <circle cx="9" cy="18" r="1.2" fill="currentColor" />
      <circle cx="15" cy="6" r="1.2" fill="currentColor" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" />
      <circle cx="15" cy="18" r="1.2" fill="currentColor" />
    </Ic>
  ),
  plus: (
    <Ic>
      <path d="M12 5v14M5 12h14" />
    </Ic>
  ),
  close: (
    <Ic>
      <path d="M18 6 6 18M6 6l12 12" />
    </Ic>
  ),
  upload: (
    <Ic>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </Ic>
  ),
  download: (
    <Ic>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </Ic>
  ),
  busy: (
    <Ic>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </Ic>
  ),
  checked: (
    <Ic>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m8 12 3 3 5-6" />
    </Ic>
  ),
  unchecked: (
    <Ic>
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </Ic>
  ),
  collapsed: (
    <Ic>
      <path d="m9 6 6 6-6 6" />
    </Ic>
  ),
  expanded: (
    <Ic>
      <path d="m6 9 6 6 6-6" />
    </Ic>
  ),
  heading1: <Hn digit="1" />,
  heading2: <Hn digit="2" />,
  heading3: <Hn digit="3" />,
  paragraph: (
    <Ic>
      <path d="M4 6V4h16v2M12 4v16M9 20h6" />
    </Ic>
  ),
  bulleted_list: (
    <Ic>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1.2" fill="currentColor" />
    </Ic>
  ),
  numbered_list: (
    <Ic>
      <path d="M10 6h10M10 12h10M10 18h10M4 5h1v4M3.5 9h2M3.5 15h2l-2 3h2" />
    </Ic>
  ),
  to_do: (
    <Ic>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m8 12 3 3 5-6" />
    </Ic>
  ),
  toggle: (
    <Ic>
      <path d="m9 6 6 6-6 6" />
    </Ic>
  ),
  code: (
    <Ic>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </Ic>
  ),
  quote: (
    <Ic>
      <path d="M8 6H4v6h4l-2 5M20 6h-4v6h4l-2 5" />
    </Ic>
  ),
  divider: (
    <Ic>
      <path d="M4 12h16" />
    </Ic>
  ),
  image: (
    <Ic>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m21 15-4.5-4.5L6 21" />
    </Ic>
  ),
  file: (
    <Ic>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </Ic>
  ),
  formula: (
    <Ic>
      <path d="M18 4H6l6 8-6 8h12" />
    </Ic>
  ),
  table: (
    <Ic>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16M15 4v16" />
    </Ic>
  ),
  page_link: (
    <Ic>
      <path d="M10 13a4 4 0 0 0 5.7.4l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 11a4 4 0 0 0-5.7-.4l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </Ic>
  ),
  align_left: (
    <Ic>
      <path d="M4 6h16M4 12h10M4 18h13" />
    </Ic>
  ),
  align_center: (
    <Ic>
      <path d="M4 6h16M7 12h10M5 18h14" />
    </Ic>
  ),
  align_right: (
    <Ic>
      <path d="M4 6h16M10 12h10M7 18h13" />
    </Ic>
  ),
};
