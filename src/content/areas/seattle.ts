import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('seattle')!;
const por = K.area('POR'), spo = K.area(K.areaOf('WA', 'Spokane County')), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const counties = K.countiesOfArea(a.code)[0].names;
const porWA = K.countiesOfArea('POR').find((x) => x.st === 'WA')!.names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const listedWA = K.countiesOf('WA').length;

export default defineArea({
  slug: 'seattle',
  where: ['WA', 'King County'],
  title: 'Seattle Locality Pay 2026: GS Pay Table, Counties and Cap',
  description: `Seattle locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-11 step 1 earns ${K.usd(g(11))}, GS-12 ${K.usd(g(12))}. The ${counties.length} Washington counties, the Portland and Spokane lines and the GS-15 cap.`,
  intro: `Puget Sound, the Olympic Peninsula and the coast share a ${K.dec(a.pct, 2)} % rate. Choose your county to see which side of the line you are on.`,
  resume: `Seattle-Tacoma is a one-state locality pay area: ${counties.length} Washington counties paid ${K.dec(a.pct, 2)} % above the General Schedule base table in ${K.P.year}, a percentage carried over from 2025. Only ${rank - 1} areas pay more, which puts Seattle ${rank}th of ${K.AREAS.length}. On the ${K.P.year} table a GS-5 step 1 earns ${K.usd(g(5))}, a GS-7 ${K.usd(g(7))}, a GS-9 ${K.usd(g(9))}, a GS-11 ${K.usd(g(11))}, a GS-12 ${K.usd(g(12))} and a GS-13 ${K.usd(g(13))}. The list goes well beyond King, Pierce and Snohomish: it takes in Kitsap, Thurston, Island, Skagit, Whatcom and San Juan, the Olympic Peninsula counties of Clallam, Jefferson, Mason and Grays Harbor, and Lewis and Pacific to the south. Southwest Washington is not included; ${porWA.join(', ')} belong to Portland at ${K.dec(por.pct, 2)} %. At GS-15, steps ${firstCap} through 10 are capped at ${K.usd(K.CAP)}. Next to Rest of U.S., a GS-12 step 1 in Seattle earns ${K.usd(g(12) - g(12, 1, 'RUS'))} more each year.`,
  body: (h) => `
<h2>Three areas in one state</h2>
<p>Washington has ${listedWA} counties named in the ${K.P.year} definitions, split among three areas. Seattle-Tacoma takes the ${counties.length} counties of the Puget Sound basin, the islands, the Olympic Peninsula and the outer coast. ${K.area('POR').name} reaches north across the Columbia River into ${porWA.length} Washington counties. ${spo.name} takes Spokane and four counties around it in the northeast, at ${K.dec(spo.pct, 2)} %. Everything else, including Yakima, the Tri-Cities and Wenatchee, is Rest of U.S. at ${K.dec(rus.pct, 2)} %.</p>
${h.mini('gs', { t: 'Pay at a Washington State worksite', p: ['g', 's', 'co'], d: { g: '11', s: '1', st: 'WA', co: 'Thurston County' } })}
<h2>The southern edge: Lewis and Pacific versus Cowlitz</h2>
<p>Lewis and Pacific counties are in the Seattle area, though they lie well south of Tacoma and Olympia. Their neighbors Cowlitz and Wahkiakum are in Portland. A move between Chehalis and Longview at GS-9 step 5 changes the rate from ${K.usd(g(9, 5))} to ${K.usd(g(9, 5, 'POR'))}. The calculator settles any doubt from the county alone.</p>
<h2>Island and peninsula worksites</h2>
<p>Federal offices on the islands of San Juan and Island counties, at Port Angeles in Clallam County or in Bellingham in Whatcom County are on the Seattle table even though some of them are a ferry ride or several hours from Seattle. The list reflects commuting and employment tests in 5 CFR 531.603, not travel time.</p>
<h2>What a step is worth here</h2>
<p>Within-grade increases at ${K.dec(a.pct, 2)} % are sizable. At GS-12, step 1 to step 2 adds ${K.usd(g(12, 2) - g(12))} a year; reaching step 10 brings the rate to ${K.usd(g(12, 10))}. At GS-14 step 10 the rate is ${K.usd(K.table(a.code)[13][9])}, still under the cap. At GS-15 the cap stops ${capped} steps, so a GS-15 step ${firstCap} and a GS-15 step 10 are paid the same ${K.usd(K.CAP)}. ${h.a('gs-step-increase', 'The step increase page')} shows the waiting periods.</p>
<h2>Living in Oregon or eastern Washington</h2>
<p>Your official worksite, as defined in 5 CFR 531.605, decides. If your position is in a Seattle office and you are scheduled to report there at least twice each biweekly pay period, you keep ${K.dec(a.pct, 2)} % even if you live elsewhere. If your agency approves full remote work from a home in Spokane or Yakima, the home becomes the worksite and the pay drops to that county's area. Compared with ${h.a('area:denver', 'Denver')} at ${K.dec(K.area('DEN').pct, 2)} %, the Seattle table is ${K.dec(a.pct - K.area('DEN').pct, 2)} points higher.</p>
`,
  faqs: [
    { q: 'How much is Seattle locality pay in 2026?', a: `The Seattle-Tacoma area pays ${K.dec(a.pct, 2)} % above the GS base rates in ${K.P.year}, the same percentage as in 2025. A GS-12 step 1 earns ${K.usd(g(12))} and a GS-13 step 1 ${K.usd(g(13))}. Every cell is rounded to the dollar and limited to ${K.usd(K.CAP)}.` },
    { q: 'Is Vancouver, Washington, in the Seattle locality pay area?', a: `No. Vancouver is in Clark County, which OPM places in the Portland-Vancouver-Salem area at ${K.dec(por.pct, 2)} %, together with Cowlitz, Skamania and Wahkiakum counties. A GS-11 step 1 earns ${K.usd(g(11, 1, 'POR'))} there, against ${K.usd(g(11))} in the Seattle area. The Columbia River crossing changes the state, not the area.` },
    { q: 'Is Olympia paid at Seattle locality rates?', a: `Yes. Thurston County, which includes Olympia, is one of the ${counties.length} counties of the Seattle-Tacoma area. Federal worksites there use the same ${K.P.year} table as Seattle, so a GS-9 step 1 earns ${K.usd(g(9))}. Lewis County, farther south, is also included in the Seattle area.` },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-step-increase', 'gs-12', 'gs-9', 'gs-pay-cap', 'area:denver'],
});
