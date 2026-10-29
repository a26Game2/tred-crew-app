const usernameKey = 'tred-crew-remembered-username';

export function rememberedUsername(): string {
  try {
    return localStorage.getItem(usernameKey) || '';
  } catch {
    return '';
  }
}

/** Store only the username locally; password storage belongs to the browser. */
export function rememberLogin(identifier: string, password: string, remember: boolean): void {
  try {
    if (remember) localStorage.setItem(usernameKey, identifier);
    else localStorage.removeItem(usernameKey);
  } catch {
    // Storage can be disabled by the browser.
  }

  if (!remember || !window.isSecureContext || !navigator.credentials?.store) return;
  const PasswordCredential = (window as Window & {
    PasswordCredential?: new (data: { id: string; password: string }) => Credential;
  }).PasswordCredential;
  if (!PasswordCredential) return;

  try {
    void navigator.credentials.store(new PasswordCredential({ id: identifier, password })).catch(() => {
      // The browser or user may decline saving credentials.
    });
  } catch {
    // Password managers are optional and differ between browsers.
  }
}
