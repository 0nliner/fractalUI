import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import * as s from './AgentChat.css';

/** Вызов инструмента, показанный над репликой агента. */
export type AgentToolCall = {
  /** Машинное имя — фолбэк, если подписи нет. */
  name: string;
  /** Человеческая подпись: «генерирую изображение». */
  label?: string;
  status?: 'running' | 'done' | 'failed';
  /** Приписка справа: «в очереди», «готово», текст ошибки. */
  note?: string;
};

export type AgentMessage = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  tools?: AgentToolCall[];
  /**
   * Интерактивный блок под сообщением: список действий, выбор, форма.
   *
   * Слот, а не доменная модель: чат остаётся чистой презентацией и ничего не
   * знает о том, что именно туда положило приложение. Панелью под лентой такое
   * не сделать — блок обязан скроллиться вместе с перепиской и принадлежать
   * конкретному ходу, иначе теряется связь «к какому вопросу это относится».
   */
  extra?: ReactNode;
};

export type AgentConversation = {
  id: string;
  title: string;
  /** Метка времени в миллисекундах — форматирует потребитель через `formatTime`. */
  updatedAt?: number;
  /** Произвольная приписка: «7 вопросов». */
  meta?: string;
};

export type AgentChatIcons = {
  brand?: ReactNode;
  history?: ReactNode;
  newChat?: ReactNode;
  settings?: ReactNode;
  close?: ReactNode;
  send?: ReactNode;
  stop?: ReactNode;
  delete?: ReactNode;
  tool?: ReactNode;
  busy?: ReactNode;
};

export type AgentChatProps = {
  messages: AgentMessage[];
  onSend: (text: string) => void;
  title?: string;
  /** Идёт ответ: показывается «думаю…» и кнопка остановки. */
  streaming?: boolean;
  onAbort?: () => void;
  onClose?: () => void;

  /** Строка «видит: …» — что агенту сейчас видно на экране. */
  contextLabel?: ReactNode;
  placeholder?: string;
  emptyState?: ReactNode;
  /** Работать не с чем (не выбран проект): ввод заблокирован. */
  isDisabled?: boolean;

  conversations?: AgentConversation[];
  activeConversationId?: string | null;
  onOpenConversation?: (id: string) => void;
  onNewConversation?: () => void;
  onDeleteConversation?: (id: string) => void;
  /** Как показать `updatedAt`. Кит не решает за приложение локаль и формат. */
  formatTime?: (ms: number) => string;

  /**
   * Содержимое полки настроек. Слотом, а не пропсами: набор моделей, цены и
   * прочее — знание приложения, кит про них ничего не знает и знать не должен.
   */
  settings?: ReactNode;

  /** Иконки задаёт потребитель — кит не тянет иконочную библиотеку. */
  icons?: AgentChatIcons;
  className?: string;
};

/**
 * Чат с ИИ-агентом: лента реплик, вызовы инструментов, история бесед,
 * полка настроек и поле ввода.
 *
 * Чистая презентация: ни сети, ни стора. Стрим, история и модель живут в
 * приложении, сюда приходят пропсами — иначе компонент нельзя переиспользовать
 * между проектами с разными бэкендами.
 */
export function AgentChat({
  messages,
  onSend,
  title = 'Ассистент',
  streaming,
  onAbort,
  onClose,
  contextLabel,
  placeholder = 'Что сделать?  (Shift+Enter — новая строка)',
  emptyState,
  isDisabled,
  conversations,
  activeConversationId,
  onOpenConversation,
  onNewConversation,
  onDeleteConversation,
  formatTime,
  settings,
  icons = {},
  className,
}: AgentChatProps) {
  const [text, setText] = useState('');
  const [shelf, setShelf] = useState<'none' | 'history' | 'settings'>('none');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Лента прокручивается к последней реплике, в том числе на каждый кусок
  // стрима — иначе ответ «уезжает» вниз и его приходится догонять руками.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  // Поле растёт под текст. Layout-эффект, а не обычный: иначе видно, как
  // высота скачет уже после отрисовки.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const submit = () => {
    const value = text.trim();
    if (!value || isDisabled || streaming) return;
    onSend(value);
    setText('');
  };

  const toggle = (which: 'history' | 'settings') =>
    setShelf((v) => (v === which ? 'none' : which));

  return (
    <div className={className ? `${s.root} ${className}` : s.root}>
      <div className={s.header}>
        {icons.brand}
        <span className={s.title}>{title}</span>
        {conversations && (
          <button
            type="button"
            className={s.iconButton}
            data-active={shelf === 'history' ? 'true' : undefined}
            title="История бесед"
            onClick={() => toggle('history')}
          >
            {icons.history ?? '⟲'}
          </button>
        )}
        {onNewConversation && (
          <button
            type="button"
            className={s.iconButton}
            title="Новая беседа"
            disabled={isDisabled}
            onClick={() => {
              onNewConversation();
              setShelf('none');
            }}
          >
            {icons.newChat ?? '+'}
          </button>
        )}
        {settings && (
          <button
            type="button"
            className={s.iconButton}
            data-active={shelf === 'settings' ? 'true' : undefined}
            title="Настройки чата"
            onClick={() => toggle('settings')}
          >
            {icons.settings ?? '⚙'}
          </button>
        )}
        {onClose && (
          <button type="button" className={s.iconButton} title="Закрыть" onClick={onClose}>
            {icons.close ?? '×'}
          </button>
        )}
      </div>

      {shelf === 'history' && conversations && (
        <div className={s.shelf}>
          {conversations.length === 0 ? (
            <div className={`${s.shelfPad} ${s.convMeta}`}>Пока нет бесед.</div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={s.convRow}
                data-active={c.id === activeConversationId ? 'true' : undefined}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onOpenConversation?.(c.id);
                  setShelf('none');
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  onOpenConversation?.(c.id);
                  setShelf('none');
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div className={s.convTitle}>{c.title}</div>
                  <div className={s.convMeta}>
                    {c.updatedAt !== undefined && formatTime ? formatTime(c.updatedAt) : null}
                    {c.updatedAt !== undefined && formatTime && c.meta ? ' · ' : null}
                    {c.meta}
                  </div>
                </span>
                {onDeleteConversation && (
                  <button
                    type="button"
                    className={s.iconButton}
                    title="Удалить беседу"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(c.id);
                    }}
                  >
                    {icons.delete ?? '×'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {shelf === 'settings' && settings && (
        <div className={s.shelf}>
          <div className={s.shelfPad}>{settings}</div>
        </div>
      )}

      {contextLabel && <div className={s.contextLine}>{contextLabel}</div>}

      <div className={s.feed}>
        {messages.length === 0 && emptyState ? (
          <div className={s.empty}>{emptyState}</div>
        ) : null}
        {messages.map((m, i) => {
          const mine = m.role === 'user';
          const last = i === messages.length - 1;
          return (
            <div key={m.id ?? i} className={s.row} data-mine={mine ? 'true' : 'false'}>
              {m.tools && m.tools.length > 0 && (
                <div className={s.tools}>
                  {m.tools.map((t, j) => (
                    <span key={j} className={s.tool} data-status={t.status}>
                      {t.status === 'running' ? icons.busy ?? icons.tool : icons.tool}
                      {t.label ?? t.name}
                      {t.note ? ` · ${t.note}` : null}
                    </span>
                  ))}
                </div>
              )}
              {/* Пустая последняя реплика во время стрима — это «агент думает»,
                  а не пустой пузырь: без подсказки диалог выглядит зависшим.
                  А вот ЗАВЕРШЁННАЯ реплика без текста пузыря не получает вовсе:
                  когда ход ушёл целиком на вызовы инструментов, пустая рамка
                  под ними читается как сломанный ответ. */}
              {(() => {
                const text = m.content || (streaming && last ? 'думаю…' : '');
                if (!text) return null;
                return (
                  <div className={s.bubble} data-mine={mine ? 'true' : 'false'}>
                    {text}
                  </div>
                );
              })()}
              {m.extra ? <div className={s.extra}>{m.extra}</div> : null}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className={s.composer}>
        <textarea
          ref={inputRef}
          rows={1}
          className={s.input}
          placeholder={placeholder}
          value={text}
          disabled={isDisabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        {streaming && onAbort ? (
          <button
            type="button"
            className={s.sendButton}
            data-variant="stop"
            title="Прервать"
            onClick={onAbort}
          >
            {icons.stop ?? '■'}
          </button>
        ) : (
          <button
            type="button"
            className={s.sendButton}
            title="Отправить (Enter)"
            disabled={isDisabled || !text.trim() || streaming}
            onClick={submit}
          >
            {icons.send ?? '▸'}
          </button>
        )}
      </div>
    </div>
  );
}
