import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('boston')!;
const har = K.area('HAR'), bn = K.area('BN'), alb = K.area(K.areaOf('MA', 'Berkshire County')), ny = K.area('NY');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const st = K.countiesOfArea(a.code);
const n = st.reduce((s, x) => s + x.names.length, 0);
const of = (s: string) => st.find((x) => x.st === s)!.names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const whole = st.filter((x) => K.countiesOf(x.st).every(([, c]) => c === a.code)).map((x) => K.STATE_NAMES[x.st]);

export default defineArea({
  slug: 'boston',
  where: ['MA', 'Suffolk County'],
  title: 'Boston Locality Pay 2026: GS Pay Table for New England',
  description: `Boston locality pay 2026 is ${K.dec(a.pct, 2)} % in ${st.length} states: GS-11 step 1 pays ${K.usd(g(11))}, GS-13 ${K.usd(g(13))}. Counties in MA, RI, NH, ME, CT and VT, with Hartford compared.`,
  intro: `Six New England states share one Boston rate of ${K.dec(a.pct, 2)} %. Pick your state and county to see whether your office is inside.`,
  resume: `The Boston-Worcester-Providence locality pay area adds ${K.dec(a.pct, 2)} % to General Schedule base pay in ${K.P.year}, the rate it already had in 2025, and stands ${rank}th among the ${K.AREAS.length} areas. Its reach is unusual: ${n} counties spread over ${st.length} states, ${of('MA').length} in Massachusetts, ${of('NH').length} in New Hampshire, ${of('RI').length} in Rhode Island, ${of('ME').length} in Maine, ${of('VT').length} in Vermont and ${of('CT').length} in Connecticut. ${whole.length ? `Every listed county of ${whole.join(' and ')} is in this area. ` : ''}Pay at step 1 runs ${K.usd(g(5))} for GS-5, ${K.usd(g(7))} for GS-7, ${K.usd(g(9))} for GS-9, ${K.usd(g(11))} for GS-11, ${K.usd(g(12))} for GS-12 and ${K.usd(g(13))} for GS-13. At the top, GS-15 steps ${firstCap} to 10 stop at the ${K.usd(K.CAP)} cap, ${capped} capped cells in all. The Hartford area next door is only ${K.dec(a.pct - har.pct, 2)} points lower, which makes a GS-12 step 1 just ${K.usd(g(12) - g(12, 1, 'HAR'))} apart between the two.`,
  body: (h) => `
<h2>A state-by-state reading of the list</h2>
<p><strong>Massachusetts.</strong> The eastern and central counties are in: Suffolk, Middlesex, Norfolk, Essex, Plymouth, Bristol, Worcester, Barnstable and the islands of Dukes and Nantucket. The western part of the state is not. Franklin, Hampden and Hampshire counties belong to Hartford at ${K.dec(har.pct, 2)} %, and Berkshire County to ${alb.name} at ${K.dec(alb.pct, 2)} %.</p>
<p><strong>Rhode Island.</strong> All five counties, from Providence to Newport and Washington, use the Boston table.</p>
<p><strong>New Hampshire and Maine.</strong> ${of('NH').length} New Hampshire counties are listed, including Hillsborough, Rockingham, Merrimack, Grafton and Carroll. In Maine the area covers ${of('ME').join(', ')}. Any other Maine county is Rest of U.S.</p>
<p><strong>Vermont and Connecticut.</strong> Two Vermont counties, ${of('VT').join(' and ')}, are in Boston, while Chittenden and its neighbors form the Burlington area at ${K.dec(bn.pct, 2)} %. In Connecticut only ${of('CT')[0]} belongs to Boston; Hartford and New London counties go to Hartford, and Fairfield and New Haven to ${h.a('area:new-york', 'New York')} at ${K.dec(ny.pct, 2)} %.</p>
${h.mini('lookup', { t: 'Check a New Hampshire or Maine duty station', p: ['st', 'co'], d: { st: 'NH', co: 'Hillsborough County', g: '11' } })}
<h2>Same name, two states</h2>
<p>Bristol County exists in both Massachusetts and Rhode Island, and both are in this area. Washington County, Rhode Island, is also here, while the Washington counties of Texas, Maryland and Wisconsin belong to ${K.area(K.areaOf('TX', 'Washington County')).short}, ${K.area(K.areaOf('MD', 'Washington County')).short} and ${K.area(K.areaOf('WI', 'Washington County')).short}. Essex County, Massachusetts, is Boston; Essex County, New Jersey, is New York. Always pick the state before the county.</p>
<h2>Boston or Hartford: a small gap</h2>
<p>The two areas are close in percentage, so moving between them changes little. For a GS-13 step 5, Boston pays ${K.usd(g(13, 5))} and Hartford ${K.usd(g(13, 5, 'HAR'))}. Moving from Burlington, Vermont, to a Boston-area office is a different story: the same cell gains ${K.usd(g(13, 5) - g(13, 5, 'BN'))}.</p>
<h2>Teleworking from New Hampshire or Maine</h2>
<p>Many people who work in Massachusetts offices live across a state line. The state does not matter for pay. Under 5 CFR 531.605, the official worksite is the office if you are scheduled to report there at least twice each biweekly pay period. For a fully remote employee, the home is the worksite: a home in Portland, Maine (Cumberland County) or in Manchester, New Hampshire (Hillsborough County) is still in the Boston area, while a home in Bangor is not.</p>
<h2>The capped steps</h2>
<p>Because the percentage is above 30 %, GS-15 crosses the ${K.usd(K.CAP)} limit from step ${firstCap}. GS-14 step 10 stays below at ${K.usd(K.table(a.code)[13][9])}. See the ${h.a('gs-pay-cap', 'pay cap page')} and ${h.a('gs-15', 'GS-15 pay')} for what this means for a step increase.</p>
`,
  faqs: [
    { q: 'What is the Boston locality pay for 2026?', a: `The Boston-Worcester-Providence area pays ${K.dec(a.pct, 2)} % above the base table in ${K.P.year}, unchanged from 2025. A GS-9 step 1 earns ${K.usd(g(9))} and a GS-12 step 1 ${K.usd(g(12))}. The rate covers ${n} counties in ${st.length} New England states, though western Massachusetts is not one of them.` },
    { q: 'Is Providence in the Boston locality pay area?', a: `Yes. Providence County and the other four Rhode Island counties are all in the Boston-Worcester-Providence area, so a federal worksite in Providence uses the same table as one in Boston: ${K.usd(g(11))} for GS-11 step 1 in ${K.P.year}. Rhode Island has no other locality area.` },
    { q: 'Is Springfield, Massachusetts, in the Boston locality area?', a: `No. Springfield is in Hampden County, which OPM places in the Hartford-East Hartford area at ${K.dec(har.pct, 2)} %, along with Franklin and Hampshire counties. The difference with Boston is small: ${K.usd(g(12) - g(12, 1, 'HAR'))} a year for a GS-12 step 1. Worcester, farther east, is in the Boston area.` },
    { q: 'Are Portland and Bangor in Maine paid at Boston locality rates?', a: `Portland is, through Cumberland County, one of ${of('ME').length} Maine counties in the Boston area. Bangor is in Penobscot County, which is not on the list, so it is paid at the Rest of U.S. rate of ${K.dec(K.area('RUS').pct, 2)} %. A GS-11 step 1 differs by ${K.usd(g(11) - g(11, 1, 'RUS'))} a year between the two.` },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-11', 'gs-13', 'gs-pay-cap', 'area:new-york', 'area:rest-of-us'],
});
