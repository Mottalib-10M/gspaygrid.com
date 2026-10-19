import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { PLANNED_AREAS } from '../../lib/planned';

const P = K.P;
const rus = K.area('RUS'), sf = K.area('SF');
const sorted = [...K.AREAS].sort((a, b) => b.pct - a.pct);
const named = K.AREAS.length - 3;
const multiState = K.AREAS.filter((a) => K.countiesOfArea(a.code).length > 1).length;
const g11 = (c: string) => K.pay(11, 1, c).annual;
const allRus = Object.keys(K.STATE_NAMES).filter((st) => !['AK', 'HI', 'PR', 'GU', 'VI'].includes(st) && K.countiesOf(st).length === 0).map((st) => K.STATE_NAMES[st]);

export default defineGuide({
  id: 'locality-pay', group: 'pay', order: 4, slug: 'locality-pay',
  nav: 'Locality pay by county', card: `Find your area from your county: ${K.AREAS.length} areas, ${K.dec(rus.pct, 2)} % to ${K.dec(sf.pct, 2)} %.`,
  title: 'Locality Pay 2026: Find Your GS Area by County and State',
  description: `Locality pay 2026 by county: ${K.AREAS.length} GS areas from ${K.dec(rus.pct, 2)} % (Rest of U.S.) to ${K.dec(sf.pct, 2)} % (${sf.short}). Pick a state and county to get your area and its pay.`,
  h1: 'Locality pay 2026: which area your county belongs to',
  intro: 'Choose the state and county of your official worksite. The calculator reads the OPM 2026 definitions and gives the area and its pay.',
  resume: `Locality pay is the percentage added to every General Schedule base rate according to where your official worksite is. In ${P.year} there are ${K.AREAS.length} locality pay areas: ${named} metropolitan areas defined by lists of counties, the State of Alaska, the State of Hawaii, and Rest of U.S., which covers every county not listed anywhere else. The percentages run from ${K.dec(rus.pct, 2)} % in Rest of U.S. to ${K.dec(sf.pct, 2)} % in ${sf.short}, and all of them are the same as in 2025 because the January ${P.year} executive order froze them. The area is set by the county or independent city of the duty station on your SF-50, not by where you live, so a teleworker who reports to the office at least twice each pay period keeps the office's area. A GS-11 step 1 earns ${K.usd(g11('RUS'))} in Rest of U.S. and ${K.usd(g11('SF'))} in ${sf.short}. Our calculator holds the ${K.num(K.countyCount)} counties and cities named in the OPM definitions for ${K.stateCount} states and the District.`,
  tool: 'lookup',
  toolArg: { st: 'VA', co: 'Fairfax County', g: '11' },
  faqs: [
    { q: 'How do I find my GS locality pay area?', a: 'Look at the duty station on your SF-50 or the job announcement, then find its county or independent city in the calculator above. If the county is listed in the OPM definitions, you get that area; if not, the worksite is in Rest of U.S. For Alaska and Hawaii the whole state is one area. Your SF-50 also prints the adjusted pay, which confirms the result.' },
    { q: 'Is locality pay based on cost of living?', a: 'No. Locality pay compares federal salaries with non-federal salaries for the same kinds of jobs in each area, using Bureau of Labor Statistics pay surveys. Housing prices and the cost of living play no direct part. That is why some expensive places sit in Rest of U.S. and why the percentages differ from cost-of-living indexes.' },
    { q: 'Do remote federal employees get locality pay?', a: `Yes, at the rate of their official worksite. For an employee approved for remote work who never reports to an agency office, the worksite is the home, so the home county decides the area. If that county is not in a named area, the rate is Rest of U.S., ${K.dec(rus.pct, 2)} % in ${P.year}.` },
    { q: 'Which states are entirely in the Rest of U.S. locality area?', a: `In ${P.year}, no county of ${allRus.length > 1 ? `${allRus.slice(0, -1).join(', ')} or ${allRus[allRus.length - 1]}` : allRus[0]} appears in a named locality area, so every worksite there is paid at the Rest of U.S. rate of ${K.dec(rus.pct, 2)} %. In other states only some counties belong to named areas and the rest are Rest of U.S.` },
    { q: 'Can a locality pay area include counties in several states?', a: `Yes. Areas follow commuting patterns, not state lines. ${multiState} of the ${named} metropolitan areas reach into more than one state; Washington-Baltimore-Arlington, for instance, covers counties in the District, Maryland, Virginia, West Virginia and Pennsylvania. The calculator lists each county under its own state with the area it belongs to.` },
  ],
  body: (h) => `
<h2>How an area is defined</h2>
<p>OPM's ${P.year} definitions start from the metropolitan statistical areas and combined statistical areas of the Office of Management and Budget. A locality pay area takes the counties of its core, then adds neighboring counties that pass commuting and employment tests set in 5 CFR 531.603. That is how a rural county can belong to a big-city area: enough of its workers commute there. Everything not listed falls into Rest of U.S. Alaska and Hawaii are each a single area that covers the whole state.</p>
<p>Virginia has independent cities that are not part of any county, so Alexandria city and Fairfax County are listed separately and could, in principle, belong to different areas. Baltimore city and St. Louis city are listed the same way.</p>
${h.mini('lookup', { t: 'Check a second worksite', p: ['st', 'co'], d: { st: 'TX', co: 'Travis County', g: '9' } })}
<h2>Worksite, telework and remote work</h2>
<p>The rule is in 5 CFR 531.605: you are paid at the locality of your official worksite. If you telework but are scheduled to report to the agency office at least twice each biweekly pay period on a regular and recurring basis, the office is your worksite. If you are not scheduled to report that often, the telework location is the worksite, usually your home. Agencies may make temporary exceptions, for example during a short medical recovery, without changing the worksite.</p>
<p>Two consequences follow. Moving house does not change your pay if you keep reporting to the same office twice a pay period. And changing from regular telework to full remote work can change your area, and your pay, overnight: a GS-12 step 5 who moves from a Washington office to a home in a Rest of U.S. county loses ${K.usd(K.pay(12, 5, 'DCB').annual - K.pay(12, 5, 'RUS').annual)} a year. ${h.a('area:washington-dc', 'The Washington area page')} lists every county of that area.</p>
<h2>Job announcements and transfers</h2>
<p>A USAJOBS announcement usually prints a salary range for each duty location. When several locations are listed, each has its own range, because the range is the grade's step 1 to step 10 in that location's area. If you accept a position in another area, your grade and step stay the same and only the locality percentage changes on the day you report. A transfer from ${K.area('HOU').short} to Rest of U.S. at GS-11 step 4 costs ${K.usd(K.pay(11, 4, 'HOU').annual - K.pay(11, 4, 'RUS').annual)} a year; the opposite move adds the same amount. Relocation incentives and moving expenses are separate and do not change the locality rate.</p>
<h2>All ${K.AREAS.length} areas ranked</h2>
${h.table(['Rank', 'Area', `${P.year} %`, 'GS-11 step 1', 'vs Rest of U.S.'], sorted.map((a, i) => [String(i + 1), PLANNED_AREAS.includes(a.slug) ? h.a(`area:${a.slug}`, a.short) : a.short, `${K.dec(a.pct, 2)} %`, K.usd(g11(a.code)), `+${K.usd(g11(a.code) - g11('RUS'))}`]), `Locality percentages for ${P.year}, highest first, with GS-11 step 1 for comparison.`, ['r', 'l', 'r', 'r', 'r'])}
<h2>Why the gap between areas matters</h2>
<p>The difference between the top and the bottom is ${K.dec(sf.pct - rus.pct, 2)} points, or ${K.pct((1 + sf.pct / 100) / (1 + rus.pct / 100) - 1, 1)} more pay for the same grade and step. Job seekers comparing two offers at the same grade should compare the adjusted rates, not the grade. For retirement, the area of your last three years decides your high-3, so a move to a higher area late in a career raises the pension, and a move to Rest of U.S. lowers it. The ${h.a('high-3-salary', 'high-3 page')} shows the effect.</p>
<h2>How percentages change</h2>
<p>Each year the Federal Salary Council, a body of federal pay experts and union representatives, reviews the survey results and recommends new percentages and new areas to the President's Pay Agent. The percentages that actually apply are set by the January executive order. For ${P.year} the order kept them all at their 2025 values; the ${h.a('federal-pay-raise-2026', '2026 raise page')} explains what that did to your pay, and the ${h.a('federal-pay-raise-2027', '2027 page')} the proposal for next year. New areas or changes to county lists take effect only through a regulation that amends 5 CFR 531.603.</p>
<h2>Puerto Rico, Guam and the other territories</h2>
<p>The Non-Foreign Area Retirement Equity Assurance Act of 2009 phased locality pay into the nonforeign areas listed in 5 CFR 591.205, replacing the old nonforeign cost-of-living allowances. Alaska and Hawaii became separate areas with their own tables. Puerto Rico, Guam, the U.S. Virgin Islands and the other nonforeign areas are part of Rest of U.S., so a GS-11 step 1 in San Juan earns ${K.usd(g11('RUS'))}, the same as in rural Kansas. Federal employees stationed abroad are outside the locality system altogether.</p>
`,
  related: ['gs-pay-scale-2026', 'area:rest-of-us', 'area:washington-dc', 'area:san-francisco', 'federal-pay-raise-2026'],
  sources: ['opm_locality_defs', 'ecfr_531_603', 'ecfr_531_605', 'usc_5304', 'opm_gs_2026'],
});
