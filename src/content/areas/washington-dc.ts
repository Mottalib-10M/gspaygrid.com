import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('washington-dc')!;
const rus = K.area('RUS');
const g7 = K.pay(7, 1, a.code), g9 = K.pay(9, 1, a.code), g11 = K.pay(11, 1, a.code), g13 = K.pay(13, 1, a.code), g14 = K.pay(14, 1, a.code);
const capped = K.table(a.code)[14].filter((x) => x >= K.CAP).length;
const states = K.countiesOfArea(a.code);
const nCounties = states.reduce((n, s) => n + s.names.length, 0);

export default defineArea({
  slug: 'washington-dc',
  where: ['VA', 'Arlington County'],
  title: 'Washington DC Locality Pay 2026: GS Pay Table and Counties',
  description: `Washington DC locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-12 step 1 earns ${K.usd(K.pay(12, 1, a.code).annual)}, GS-13 ${K.usd(g13.annual)}. Full GS table, every DC, Maryland and Virginia county, the cap.`,
  intro: `The largest federal workforce in the country is paid ${K.dec(a.pct, 2)} % above the base table. Choose your county to confirm your area.`,
  resume: `The Washington-Baltimore-Arlington locality pay area adds ${K.dec(a.pct, 2)} % to every General Schedule base rate in ${K.P.year}, the same percentage as in 2025 because Executive Order 14368 froze all localities while raising the base table by ${K.dec(K.RAISE, 1)} %. A GS-7 step 1 earns ${K.usd(g7.annual)}, a GS-9 ${K.usd(g9.annual)}, a GS-11 ${K.usd(g11.annual)}, a GS-13 ${K.usd(g13.annual)} and a GS-14 ${K.usd(g14.annual)}. The area reaches well beyond the District: ${nCounties} counties and independent cities in ${states.length} jurisdictions, from Baltimore and Frederick in Maryland to Fredericksburg and Winchester in Virginia, plus counties of West Virginia and Pennsylvania. At the top, ${capped} of the ten GS-15 steps are held at the ${K.usd(K.CAP)} pay cap. Compared with Rest of U.S., the same grade and step pays ${K.pct((1 + a.pct / 100) / (1 + rus.pct / 100) - 1, 1)} more.`,
  body: (h) => `
<h2>Which offices are in the Washington area</h2>
<p>OPM's 2026 definition starts from the Washington-Baltimore-Arlington combined statistical area and adds a ring of counties that qualified through commuting. That is why a worksite in Hagerstown, Maryland, or in Winchester, Virginia, is paid at the Washington rate, while one in Richmond belongs to a separate area at ${K.dec(K.area('RCH').pct, 2)} %. The calculator above uses the official list: choose the state, then the county or independent city of your duty station, and it shows the area and the pay. Virginia's independent cities, such as Alexandria, Fairfax city or Manassas, are listed separately from the counties around them.</p>
${h.mini('lookup', { t: 'Is your duty station in the Washington area?', p: ['st', 'co'], d: { st: 'MD', co: 'Frederick County' } })}
<h2>Telework and remote work in the region</h2>
<p>The locality follows the official worksite on your SF-50. A teleworker who reports to an office in Arlington at least twice each pay period keeps the Washington rate, even when living in a Rest of U.S. county in Pennsylvania. A fully remote employee whose approved worksite is the home is paid the locality of the home. Moving from a remote agreement back to office reporting can therefore raise or cut pay by the gap between two areas: ${K.usd(K.pay(12, 5, a.code).annual - K.pay(12, 5, 'RUS').annual)} a year for a GS-12 step 5 between Washington and Rest of U.S.</p>
<h2>The cap in Washington</h2>
<p>Because the Washington percentage is high and the base GS-15 rates are high too, the top of the table hits the ${K.usd(K.CAP)} ceiling, the rate of Executive Schedule level IV. ${capped} steps of GS-15 show that figure, so a step increase in that zone adds nothing to pay until a later raise lifts the cap. The ${h.a('gs-pay-cap', 'pay cap page')} lists every capped cell in every area.</p>
<h2>2027 in Washington</h2>
<p>The President's alternative pay plan of August 26, 2026 proposes no across-the-board raise and no locality change for January 2027. If Congress or a later executive order sets another figure, the Washington rates will move with it; the ${h.a('federal-pay-raise-2027', '2027 raise page')} lets you test a raise on your cell and will be updated with the official tables, expected ${K.P.pay.y2027.tablesExpected}.</p>
`,
  faqs: [
    { q: 'What is the Washington DC locality pay percentage for 2026?', a: `It is ${K.dec(a.pct, 2)} %, unchanged from 2025. The ${K.dec(K.RAISE, 1)} % raise of January 2026 applied to the base table only, so Washington rates rose by about ${K.dec(K.RAISE, 1)} % as well. The percentage applies to every grade and step, then the result is rounded to the dollar and capped at ${K.usd(K.CAP)}.` },
    { q: 'Is Baltimore in the Washington DC locality pay area?', a: `Yes. Baltimore city and the Maryland counties around it belong to the Washington-Baltimore-Arlington area, so a GS-11 step 1 in Baltimore earns ${K.usd(g11.annual)} like one in the District. The area also covers Frederick, Annapolis and Hagerstown in Maryland and reaches into Virginia, West Virginia and Pennsylvania.` },
    { q: 'Does a fully remote employee living near DC get Washington locality pay?', a: 'Only if the approved alternative worksite, usually the home, is itself in one of the counties of the area. The rate follows the worksite on the SF-50, not the office the team belongs to. A remote employee whose home is in Richmond is paid the Richmond rate, and one in rural Pennsylvania the Rest of U.S. rate.' },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-12', 'gs-13', 'gs-pay-cap', 'area:virginia-beach', 'area:philadelphia'],
});
