/**
 * Идентификатор блока.
 *
 * `crypto.randomUUID` есть только в защищённом контексте: dev-сервер по http
 * на адрес в локальной сети его не даёт, поэтому нужен запасной путь — иначе
 * редактор падает ровно там, где его чаще всего и открывают.
 */
export function createBlockId(): string {
  const c: Crypto | undefined = typeof crypto === 'undefined' ? undefined : crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return 'b-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}
