import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('san-francisco')!;
const sac = K.area('SAC'), fn = K.area('FN'), la = K.area('LA'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const second = ranked[1];
const counties = K.countiesOfArea(a.code)[0].names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const t = K.table(a.code);
const cap15 = t[14].filter((x) => x >= K.CAP).length;
const cap14 = t[13].filter((x) => x >= K.CAP).length;
const first15 = t[14].findIndex((x) => x >= K.CAP) + 1;
const first14 = t[13].findIndex((x) => x >= K.CAP) + 1;
const others14 = K.AREAS.filter((x) => x.code !== a.code && K.table(x.code)[13].some((v) => v >= K.CAP)).length;
const raw1510 = Math.round(K.pay(15, 10, a.code).base * (1 + a.pct / 100));

export default defineArea({
  slug: 'san-francisco',
  where: ['CA', 'San Francisco County'],
  title: 'San Francisco Locality Pay 2026: Highest GS Rates and Cap',
  description: `San Francisco locality pay 2026 is ${K.dec(a.pct, 2)} %, the highest GS rate: GS-11 step 1 pays ${K.usd(g(11))}, GS-13 ${K.usd(g(13))}. The ${counties.length} Bay Area counties and the capped cells.`,
  intro: `No locality pays more: ${K.dec(a.pct, 2)} % above the base table, so much that the cap cuts into GS-14. Pick your county to confirm.`,
  resume: `The San Jose-San Francisco-Oakland locality pay area carries the highest percentage on the General Schedule in ${K.P.year}: ${K.dec(a.pct, 2)} %, frozen at its 2025 level by Executive Order 14368 while base rates rose ${K.dec(K.RAISE, 1)} %. The next area, ${second.short}, is ${K.dec(a.pct - second.pct, 2)} points lower. Starting salaries reflect the gap: GS-5 step 1 earns ${K.usd(g(5))}, GS-7 ${K.usd(g(7))}, GS-9 ${K.usd(g(9))}, GS-11 ${K.usd(g(11))}, GS-12 ${K.usd(g(12))} and GS-13 ${K.usd(g(13))}. The percentage is so high that the ${K.usd(K.CAP)} pay cap binds earlier than anywhere else: ${cap15} of the ten GS-15 steps and ${cap14} GS-14 steps show the capped figure. The area covers ${counties.length} California counties, from Sonoma and Napa to Monterey and San Benito, and inland as far as San Joaquin, Stanislaus, Merced and Calaveras. Against Rest of U.S., a GS-12 step 1 earns ${K.usd(g(12) - g(12, 1, 'RUS'))} more a year.`,
  body: (h) => `
<h2>Why the rate stops climbing at GS-14</h2>
<p>Every locality rate is limited to the Executive Schedule level IV salary, ${K.usd(K.CAP)} in ${K.P.year}. In most areas only the upper GS-15 steps reach it. Here, GS-15 hits the ceiling at step ${first15}, and GS-14 reaches it at step ${first14}. ${others14 === 0 ? 'No other locality area caps any GS-14 cell.' : `Only ${others14} other area${others14 > 1 ? 's' : ''} cap a GS-14 cell.`} Without the limit, GS-15 step 10 would pay ${K.usd(raw1510)}, which is ${K.usd(raw1510 - K.CAP)} more than anyone can receive.</p>
<p>The practical effect is compression. A GS-14 step ${first14} employee and a GS-15 step 10 supervisor earn the same salary. Step increases, quality step increases and promotions inside the capped zone change the grade and step on the SF-50 but not the pay. The calculator below shows the uncapped figure for any cell you choose.</p>
${h.mini('cap', { t: 'How far above the cap is your Bay Area cell?', p: ['g', 's'], d: { g: '14', s: '10', a: a.code } })}
<h2>Counties that are not on the bay</h2>
<p>People expect San Francisco, San Mateo, Santa Clara, Alameda, Contra Costa and Marin. Fewer expect the Central Valley and the coast to the south. San Joaquin, Stanislaus and Merced counties are in this area, as are Monterey, Santa Cruz and San Benito, plus Calaveras in the foothills, and Napa, Solano and Sonoma to the north. A worksite in Modesto or Stockton is paid at ${K.dec(a.pct, 2)} %, not at a valley rate.</p>
<p>The lines with the neighbors are sharp. Sacramento, Yolo and Placer counties form the Sacramento area at ${K.dec(sac.pct, 2)} %. Fresno, Madera, Mariposa, Kings and Tulare belong to Fresno at ${K.dec(fn.pct, 2)} %, one of the lowest named rates. A GS-11 step 1 moving from Merced County to Madera County would go from ${K.usd(g(11))} to ${K.usd(g(11, 1, 'FN'))}.</p>
<h2>What the percentage measures</h2>
<p>Locality percentages come from surveys of non-federal salaries for similar work, compared with federal salaries in the same area. They are not a housing or living-cost index. The Bay Area figure is high because private and public employers there pay high wages for the jobs the surveys match. In ${K.P.year} every area was frozen, so the survey results did not change the percentage at all.</p>
<h2>Remote work from outside the Bay Area</h2>
<p>An employee assigned to a San Francisco office but approved for remote work from Reno, Sacramento or anywhere else is paid the locality of the home, because the home becomes the official worksite under 5 CFR 531.605. Reporting to the office at least twice every biweekly pay period keeps the Bay Area rate. Compared with ${h.a('area:los-angeles', 'Los Angeles')} at ${K.dec(la.pct, 2)} %, a GS-12 step 1 in this area earns ${K.usd(g(12) - g(12, 1, 'LA'))} more.</p>
`,
  faqs: [
    { q: 'Why is San Francisco locality pay so high?', a: `The percentage, ${K.dec(a.pct, 2)} % in ${K.P.year}, reflects the gap between federal pay and non-federal pay for comparable jobs measured by Bureau of Labor Statistics surveys in the Bay Area. It is not tied to housing prices. The rate was frozen at its 2025 level, as every locality was in ${K.P.year}.` },
    { q: 'Is Stockton in the San Francisco locality pay area?', a: `Yes. San Joaquin County, which includes Stockton, is listed in the San Jose-San Francisco-Oakland area, as are Stanislaus and Merced counties. A GS-9 step 1 there earns ${K.usd(g(9))}. Sacramento County, to the north, is a separate area at ${K.dec(sac.pct, 2)} %.` },
    { q: 'Why does GS-14 step 10 pay the same as GS-15 in San Francisco?', a: `Both are held at the ${K.usd(K.CAP)} cap, the rate of Executive Schedule level IV. In the Bay Area the uncapped GS-14 rates from step ${first14} up and the GS-15 rates from step ${first15} up exceed that limit, so they are all paid the capped amount until the cap itself is raised.` },
  ],
  related: ['gs-pay-cap', 'locality-pay', 'gs-14', 'gs-15', 'gs-pay-scale-2026', 'area:los-angeles', 'area:san-diego'],
});
