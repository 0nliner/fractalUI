import type { CSSProperties, ReactNode } from 'react';
import { vars } from '@fractalui/tokens';

/** Мелкие presentational-хелперы для витрин токенов (используют только vars.*). */

export function Title({ children }: { children: ReactNode }) {
  return (
    <h2 style={{ fontSize: vars.font.sizeLg, fontWeight: vars.font.weightBold, margin: `0 0 ${vars.space.lg}` }}>
      {children}
    </h2>
  );
}

export function Grid({ children, min = '180px' }: { children: ReactNode; min?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: vars.space.md,
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export function Tile({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        border: `1px solid ${vars.color.border}`,
        borderRadius: vars.radius.md,
        padding: vars.space.md,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <div style={{ fontWeight: vars.font.weightBold, marginBottom: vars.space.xs }}>{children}</div>;
}

export function Mono({ children }: { children: ReactNode }) {
  return <code style={{ fontSize: vars.font.sizeSm, color: vars.color.muted }}>{children}</code>;
}
