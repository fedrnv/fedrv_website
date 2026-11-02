type Language = 'en' | 'de' | 'ru';
const dictionary = document.getElementById('language-messages');
if (dictionary?.textContent) {
  const messages = JSON.parse(dictionary.textContent) as Record<Language, Record<string, string>>;
  const select = document.getElementById('language') as HTMLSelectElement | null;
  const locales = { en: 'en_US', de: 'de_DE', ru: 'ru_RU' };
  const apply = (language: Language) => {
    const values = messages[language];
    for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
      const key = element.dataset.i18n!;
      if (values[key] !== undefined) element.textContent = values[key];
    }
    for (const attribute of ['aria-label', 'content', 'alt', 'title']) {
      for (const element of document.querySelectorAll(`[data-i18n-${attribute}]`)) {
        const key = element.getAttribute(`data-i18n-${attribute}`)!;
        if (values[key] !== undefined) element.setAttribute(attribute, values[key]);
      }
    }
    document.documentElement.lang = language;
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locales[language]);
    if (select) select.value = language;
    document.documentElement.dataset.languageReady = 'true';
  };
  // Only the primary browser language controls automatic selection.
  // An unsupported primary remains English even if a secondary preference is supported.
  const primary = (navigator.languages?.[0] || navigator.language || '').toLowerCase().split(/[-_]/)[0];
  let selected: Language = primary === 'de' || primary === 'ru' ? primary : 'en';
  try {
    const saved = sessionStorage.getItem('fdweb.language');
    if (saved === 'en' || saved === 'de' || saved === 'ru') selected = saved;
  } catch { /* Browser privacy settings must not prevent automatic selection. */ }
  apply(selected);
  select?.addEventListener('change', () => {
    const value = select.value;
    apply(value === 'de' || value === 'ru' ? value : 'en');
    try { sessionStorage.setItem('fdweb.language', document.documentElement.lang); } catch { /* Optional preference only. */ }
  });
}
