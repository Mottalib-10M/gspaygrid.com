import { route, type Locale } from './routes';
import { GUIDES, guideById, GRADE_PAGES, gradeId, gradePageById, AREA_PAGES, areaId, areaPageById } from '../lib/pages';
import { areaBySlug } from '../lib/engine/gs';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'GS pay calculator', method: 'How the figures are built', about: 'About', widget: 'Embed a calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'pay', label: 'GS pay tables' },
  { id: 'career', label: 'Steps and promotions' },
  { id: 'fers', label: 'FERS retirement' },
  { id: 'more', label: 'TSP and benefits' },
];
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const g = guideById(id); if (g) return g.nav;
  const gr = gradePageById(id); if (gr) return `GS-${gr.grade} pay`;
  const a = areaPageById(id); if (a) return `${areaBySlug(a.slug)!.short} locality pay`;
  return id;
};
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return [
    ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  ];
}
// Methode : liee en bas de page, hors du menu du haut pour qu'il tienne sur une ligne.
export const navDirect = (_lang: Locale): NavLink[] => [];
export const gradeLinks = (lang: Locale): NavLink[] => GRADE_PAGES.map((g) => ({ href: route(gradeId(g.grade), lang), label: `GS-${g.grade}` }));
export const areaLinks = (lang: Locale): NavLink[] => AREA_PAGES.map((a) => ({ href: route(areaId(a.slug), lang), label: areaBySlug(a.slug)!.short }));
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  { label: 'Pay by grade', links: gradeLinks(lang) },
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Every locality page from the footer: one click from any page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => areaLinks(lang);
