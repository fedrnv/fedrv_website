import type { CollectionEntry } from 'astro:content';
import { t, type Language, type Messages } from './messages';
type Project = CollectionEntry<'projects'>['data'];
export function localizedProject(project: Project, language: Language = 'en') {
  return { ...project, ...(language === 'ru' ? {} : project.translations?.[language]) };
}
export function projectMessages(projects: Project[]): Messages {
  const result: Messages = { en: {}, de: {}, ru: {} };
  for (const language of ['en', 'de', 'ru'] as const) for (const project of projects) {
    const data = localizedProject(project, language);
    const prefix = `project.${project.slug}`;
    result[language][`${prefix}.summary`] = data.summary;
    result[language][`${prefix}.purpose`] = data.purpose;
    result[language][`${prefix}.read`] = t('readProject', language).replace('{name}', project.name);
    if (project.portal) result[language][`${prefix}.portal`] = data.portalLabel || project.portal.label;
  }
  return result;
}
