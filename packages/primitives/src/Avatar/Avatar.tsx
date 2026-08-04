import { useMemo } from 'react';
import * as s from './Avatar.css';

export type AvatarProps = {
  /** Детерминированный seed (например, user id / uuid) — из него генерится градиент. */
  seed?: string;
  /** Картинка поверх градиента (если есть). */
  src?: string;
  /** Инициалы/символ, если нет картинки. */
  label?: string;
  size?: number;
  alt?: string;
  className?: string;
};

function hashHue(str: string, salt: number): number {
  let h = salt >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

/**
 * Аватар с радиальным градиентом, детерминированно сгенерированным из `seed`
 * (айдентика fractalUI — «иконка из uuid»). Без seed — фирменный orange→green.
 */
export function Avatar({ seed, src, label, size = 32, alt, className }: AvatarProps) {
  const background = useMemo(() => {
    if (!seed) return 'linear-gradient(135deg, #ff5733 0%, #33ff57 100%)';
    const h1 = hashHue(seed, 17);
    const h2 = hashHue(seed, 131);
    return `radial-gradient(circle at 30% 30%, hsl(${h1} 75% 58%), hsl(${h2} 70% 42%))`;
  }, [seed]);

  return (
    <span
      className={[s.root, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, background, fontSize: Math.round(size * 0.42) }}
      role="img"
      aria-label={alt ?? label ?? 'avatar'}
    >
      {src ? (
        <img src={src} alt={alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        label
      )}
    </span>
  );
}
