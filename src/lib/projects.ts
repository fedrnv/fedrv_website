import { getCollection } from 'astro:content';

export async function publicProjects() {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  const used = new Set<string>();
  for (const entry of entries) {
    if (used.has(entry.data.slug)) throw new Error(`Duplicate project slug: ${entry.data.slug}`);
    used.add(entry.data.slug);
  }
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'ru'));
}
