import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './lib/project-schema';
import { pathToFileURL } from 'node:url';
import { resolve, sep } from 'node:path';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', generateId: ({ entry }) => entry.replace(/\.md$/, ''), base: process.env.FDWEB_CONTENT_DIR
    ? pathToFileURL(resolve(process.env.FDWEB_CONTENT_DIR) + sep) : './src/content/projects' }),
  schema: projectSchema,
});

export const collections = { projects };
