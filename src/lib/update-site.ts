import site from '../data/fdupdate-site.json';
import { publicProjects } from './projects';
export async function updateDocuments() {
  const projects = await publicProjects();
  return projects.some(project => project.data.detailsSource === 'fdupdate-site') ? site.docs : [];
}
