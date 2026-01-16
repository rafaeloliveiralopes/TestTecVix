/**
 * Mapeamento de mensagens de erro do backend para chaves i18n.
 * Permite traduzir mensagens de erro da API para o idioma do usuário.
 */
export const backendErrorToI18nKey: Record<string, string> = {
  // Erros de permissão
  "Unauthorized": "generic.unauthorized",
  "Forbidden": "generic.forbidden",
};

/**
 * Mensagens de erro que indicam problemas de sessão/token.
 * Toast não deve ser exibido nesses casos, pois o usuário já está sendo redirecionado para login.
 */
const TOKEN_ERROR_PATTERNS = ["Invalid token", "expired", "jwt"];

/**
 * Verifica se a mensagem de erro é relacionada a token/sessão.
 */
export const isTokenError = (message: string): boolean =>
  TOKEN_ERROR_PATTERNS.some((pattern) => message.toLowerCase().includes(pattern.toLowerCase()));

/**
 * Traduz uma mensagem de erro do backend usando i18next.
 * Retorna null para erros de token (sessão expirada) - indica que toast não deve ser exibido.
 */
export const translateBackendError = (
  message: string,
  t: (key: string) => string,
): string | null => {
  if (isTokenError(message)) return null;
  
  const i18nKey = backendErrorToI18nKey[message];
  if (i18nKey) return t(i18nKey);
  
  return message;
};
