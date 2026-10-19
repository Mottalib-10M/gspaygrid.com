import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('los-angeles')!;
const sd = K.area('SD'), sf = K.area('SF'), fn = K.area('FN');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const counties = K.countiesOfArea(a.code)[0].names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const nyOrange = K.areaOf('NY', 'Orange County');

export default defineArea({
  slug: 'los-angeles',
  where: ['CA', 'Los Angeles County'],
  title: 'Los Angeles Locality Pay 2026: GS Pay by Grade and County',
  description: `Los Angeles locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-7 step 1 pays ${K.usd(g(7))}, GS-12 ${K.usd(g(12))}. See the ${counties.length} counties from Kern to Imperial, the GS-15 cap and nearby areas.`,
  intro: `Southern California's largest area adds ${K.dec(a.pct, 2)} % to GS base pay and reaches far past Los Angeles County. Select a county to check.`,
  resume: `In ${K.P.year} the Los Angeles-Long Beach locality pay area pays ${K.dec(a.pct, 2)} % above the General Schedule base table, which places it ${rank === 3 ? 'third' : `at rank ${rank}`} of ${K.AREAS.length} areas, after ${ranked[0].short} and ${ranked[1].short}. The figure is unchanged from 2025; only the base rates moved, by ${K.dec(K.RAISE, 1)} %. A GS-4 step 1 earns ${K.usd(g(4))}, GS-7 ${K.usd(g(7))}, GS-9 ${K.usd(g(9))}, GS-11 ${K.usd(g(11))}, GS-12 ${K.usd(g(12))}, GS-13 ${K.usd(g(13))} and GS-14 ${K.usd(g(14))}. Nine is the number to remember: the area spans ${counties.length} counties, Los Angeles, Orange, Riverside, San Bernardino and Ventura, but also Kern, Santa Barbara, San Luis Obispo and Imperial. The cap of ${K.usd(K.CAP)} limits ${capped} GS-15 steps. San Diego County, the neighbor to the south, has its own area at ${K.dec(sd.pct, 2)} %, so a GS-12 step 1 earns ${K.usd(g(12) - g(12, 1, 'SD'))} less there than in Los Angeles.`,
  body: (h) => `
<h2>From Bakersfield to El Centro</h2>
<p>The OPM list for this area is short but wide. Alongside the core counties of Los Angeles and Orange, it includes the Inland Empire (Riverside and San Bernardino), the coast north to Ventura, Santa Barbara and San Luis Obispo, Kern County in the southern Central Valley, and Imperial County on the Mexican border. That makes a federal office in Bakersfield, Lompoc or El Centro part of the Los Angeles table.</p>
<p>Imperial County is the one that trips people up. On the map it sits east of San Diego County, yet it is not in the San Diego area: it is listed with Los Angeles, at ${K.dec(a.pct, 2)} % rather than ${K.dec(sd.pct, 2)} %. Kern is the other surprise, because Kings and Tulare counties next to it belong to Fresno at ${K.dec(fn.pct, 2)} %.</p>
${h.mini('gs', { t: 'Your pay at a Kern or Imperial County worksite', p: ['g', 's', 'co'], d: { g: '9', s: '1', st: 'CA', co: 'Kern County' } })}
<h2>Two Orange Counties</h2>
<p>If you search the county list, you will find an Orange County in California and another in New York. The California one is in this area. The New York one belongs to ${K.area(nyOrange).short}, at ${K.dec(K.area(nyOrange).pct, 2)} %. The calculator asks for the state first for this reason; the same name in a different state can mean a different table.</p>
<h2>How far a step goes here</h2>
<p>At ${K.dec(a.pct, 2)} %, each within-grade increase is worth more than in most areas. Moving from GS-11 step 1 to step 2 adds ${K.usd(g(11, 2) - g(11))} a year; from GS-13 step 1 to step 2, ${K.usd(g(13, 2) - g(13))}. Promotions follow the same rule: the two-step test is applied to base pay, then the Los Angeles percentage is added, so the dollar raise is larger than the base-table raise.</p>
<p>The upper end flattens. GS-15 step ${firstCap} and every step after it pay ${K.usd(K.CAP)}. GS-14 never reaches the cap here; its step 10 pays ${K.usd(K.table(a.code)[13][9])}. Above GS-14, a promotion can therefore add less than people expect. The ${h.a('gs-pay-cap', 'pay cap guide')} lists each capped cell.</p>
<h2>Bay Area and San Diego offices compared</h2>
<p>For the same GS-12 step 1, the San Jose-San Francisco-Oakland area at ${K.dec(sf.pct, 2)} % pays ${K.usd(g(12, 1, 'SF'))}, Los Angeles ${K.usd(g(12))} and ${h.a('area:san-diego', 'San Diego')} ${K.usd(g(12, 1, 'SD'))}. These percentages come from salary surveys of non-federal employers, which is why they do not line up with rents or home prices.</p>
<h2>Telework across county lines</h2>
<p>A worker based in a downtown Los Angeles office who lives in San Diego County keeps the Los Angeles rate when scheduled to report at least twice per biweekly pay period, as 5 CFR 531.605 requires. A fully remote arrangement moves the worksite to the home, and the home county sets the pay.</p>
`,
  faqs: [
    { q: 'What is the Los Angeles locality pay percentage for 2026?', a: `It is ${K.dec(a.pct, 2)} %, the same as in 2025, applied to every GS grade and step. A GS-11 step 1 in the Los Angeles-Long Beach area earns ${K.usd(g(11))} in ${K.P.year}. Rates are rounded to the dollar and limited to ${K.usd(K.CAP)}.` },
    { q: 'Is Bakersfield in the Los Angeles locality pay area?', a: `Yes. Kern County, which includes Bakersfield, is one of the ${counties.length} counties of the Los Angeles-Long Beach area. A federal worksite there is paid at ${K.dec(a.pct, 2)} %, so GS-9 step 1 earns ${K.usd(g(9))}. The neighboring counties of Kings and Tulare are in the Fresno area instead.` },
    { q: 'Is Imperial County paid at San Diego or Los Angeles rates?', a: `Los Angeles. OPM lists Imperial County in the Los Angeles-Long Beach area for ${K.P.year}, even though it borders San Diego County. A GS-12 step 1 there earns ${K.usd(g(12))}, compared with ${K.usd(g(12, 1, 'SD'))} in the San Diego area. The county printed on your SF-50 duty station decides, not the nearest city.` },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-step-increase', 'gs-11', 'gs-pay-cap', 'area:san-diego', 'area:san-francisco'],
});
