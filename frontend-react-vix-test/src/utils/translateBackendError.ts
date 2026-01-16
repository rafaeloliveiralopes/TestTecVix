/**
 * Mapeamento de mensagens de erro do backend para chaves i18n.
 * Permite traduzir mensagens de erro da API para o idioma do usuário.
 */
export const backendErrorToI18nKey: Record<string, string> = {
  // Erros de permissão
  "Unauthorized": "generic.unauthorized",
  "Forbidden": "generic.forbidden",
  // Adicionar outros mapeamentos conforme necessário
};

/**
 * Traduz uma mensagem de erro do backend usando i18next, se houver tradução disponível.
 * @param message Mensagem de erro retornada pelo backend
 * @param t Função de tradução do i18next
 * @returns Mensagem traduzida ou a mensagem original se não houver tradução
 */
export const translateBackendError = (
  message: string,
  t: (key: string) => string,
): string => {
  const i18nKey = backendErrorToI18nKey[message];
  if (i18nKey) {
    return t(i18nKey);
  }
  return message;
};
