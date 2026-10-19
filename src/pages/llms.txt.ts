/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, GRADE_PAGES, AREA_PAGES, gradeId, areaId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Calculators for United States federal employees on the General Schedule: ${K.P.year} GS pay by grade, step and county of work (the ${K.AREAS.length} locality pay area tables reproduced to the dollar, the ${K.pct(K.RAISE / 100)} raise of Executive Order 14368, the ${K.usd(K.CAP)} pay cap and the special table 001M for GS-1 to GS-4), within-grade increases and the two-step promotion rule, and FERS retirement: minimum retirement age, the 1 % and 1.1 % multipliers, high-3, MRA+10 reduction, the FERS supplement and its earnings test, survivor benefits, the diet COLA and sick leave credit. ${K.P.year + 1} figures are shown as proposals until they are official. Independent site published by Radif Partners, not affiliated with any government agency; general information, not personal advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## Pay by grade', ...GRADE_PAGES.map((g) => `- [${label(gradeId(g.grade))}](${SITE_URL}${route(gradeId(g.grade), 'en')}): ${g.intro}`), '',
    '## Locality pay areas', ...AREA_PAGES.map((a) => `- [${label(areaId(a.slug))}](${SITE_URL}${route(areaId(a.slug), 'en')}): ${a.intro}`), '',
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
