import { useState, type ReactNode } from 'react';
import { Button, Container, Drawer } from '@fractalui/primitives';
import * as s from './StorefrontShell.css';

export type StorefrontShellProps = {
  /** Логотип и всё, что слева в шапке. */
  brand?: ReactNode;
  /** Поиск. На телефоне уезжает под шапку отдельной строкой. */
  search?: ReactNode;
  /** Корзина, аккаунт, переключатель темы. */
  actions?: ReactNode;
  /** Навигация: на десктопе в шапке, на телефоне — в шторке под бургером. */
  nav?: ReactNode;
  /** Хлебные крошки или подзаголовок раздела. */
  subheader?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  containerSize?: 'md' | 'lg' | 'xl';
};

/**
 * Каркас витрины.
 *
 * Новый слайс, а НЕ перекрашенный `AppShell`. Тот сделан для плотных
 * приложений: `height: 100vh; overflow: hidden`, шапка 44px, рельса 48px,
 * и его главное свойство — рабочая область не перекомпоновывается при смене
 * раздела. Витрине нужно ровно противоположное: скролл документа, широкая
 * липкая шапка с поиском и корзиной, бургер на телефоне, футер. Попытка
 * согнуть `AppShell` под это сломала бы его для process_automation_bureau.
 *
 * Шапка липкая: на длинном каталоге корзина и поиск должны оставаться под рукой.
 */
export function StorefrontShell({
  brand,
  search,
  actions,
  nav,
  subheader,
  footer,
  children,
  containerSize = 'lg',
}: StorefrontShellProps) {
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <div className={s.root}>
      <header className={s.header}>
        <Container size={containerSize}>
          <div className={s.headerRow}>
            {nav ? (
              <Button
                variant="ghost"
                className={s.burger}
                onPress={() => setNavOpen(true)}
                aria-label="Меню"
              >
                ☰
              </Button>
            ) : null}

            <div className={s.brand}>{brand}</div>

            {/* Поиск в шапке — только на широком экране. */}
            {search ? <div className={s.searchDesktop}>{search}</div> : null}

            {nav ? <nav className={s.navDesktop}>{nav}</nav> : null}

            <div className={s.actions}>{actions}</div>
          </div>

          {/* На телефоне поиск отдельной строкой: в одну строку с логотипом
              и корзиной он сжимается до бесполезного. */}
          {search ? <div className={s.searchMobile}>{search}</div> : null}
        </Container>

        {subheader ? (
          <div className={s.subheader}>
            <Container size={containerSize}>{subheader}</Container>
          </div>
        ) : null}
      </header>

      <main className={s.main}>
        <Container size={containerSize}>{children}</Container>
      </main>

      {footer ? (
        <footer className={s.footer}>
          <Container size={containerSize}>{footer}</Container>
        </footer>
      ) : null}

      {nav ? (
        <Drawer isOpen={isNavOpen} onOpenChange={setNavOpen} side="left" title="Меню">
          <div onClick={() => setNavOpen(false)}>{nav}</div>
        </Drawer>
      ) : null}
    </div>
  );
}
