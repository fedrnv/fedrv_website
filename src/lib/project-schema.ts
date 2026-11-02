import { z } from 'astro/zod';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const text = z.string().trim().min(1);
const link = z.object({ label: text, url: z.url().refine(value => new URL(value).protocol === 'https:', 'Use a verified HTTPS URL') });
const localImage = z.string().startsWith('/images/').refine(value => {
  const root = resolve('public/images');
  const target = resolve('public', value.slice(1));
  return target.startsWith(root + sep) && existsSync(target);
}, 'Image must exist under public/images');

export const projectSchema = z.object({
  name: text,
  slug: text.regex(/^[a-z][a-z0-9-]*$/).refine(value => !['index', '404', 'robots', 'sitemap'].includes(value), 'Reserved route'),
  summary: text.max(240),
  purpose: text,
  status: z.enum(['planned', 'development', 'available', 'information']),
  draft: z.boolean().default(false),
  order: z.number().int().nonnegative().default(100),
  icon: z.enum(['/icons/fd-update.svg', '/icons/fd-storage.svg', '/icons/fd-agent.svg', '/icons/fd-remote-desktop.svg', '/icons/fd-vpn.svg']).optional(),
  capabilities: z.array(text).default([]),
  benefits: z.array(text).default([]),
  plannedCapabilities: z.array(text).default([]),
  documentation: z.array(link).default([]),
  portal: link.optional(),
  image: z.object({ src: localImage, alt: text }).optional(),
  translations: z.object({
    en: z.object({ summary: text.max(240), purpose: text, portalLabel: text.optional() }),
    de: z.object({ summary: text.max(240), purpose: text, portalLabel: text.optional() }),
  }).optional(),
});
