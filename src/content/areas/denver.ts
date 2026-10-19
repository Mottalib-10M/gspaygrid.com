import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('denver')!;
const cs = K.area('CS'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const counties = K.countiesOfArea(a.code)[0].names;
const csList = K.countiesOfArea('CS')[0].names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const csCapped = K.table('CS')[14].filter((x) => x >= K.CAP).length;
const gap = a.pct - cs.pct;

export default defineArea({
  slug: 'denver',
  where: ['CO', 'Denver County'],
  title: `Denver Locality Pay 2026: GS Rates for ${counties.length} Colorado Counties`,
  description: `Denver locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-9 step 1 pays ${K.usd(g(9))}, GS-12 ${K.usd(g(12))}. The ${counties.length} counties from Larimer to Douglas, and the gap with Colorado Springs.`,
  intro: `Denver pays ${K.dec(gap, 2)} points more than Colorado Springs to the south. Select your county to see which table applies.`,
  resume: `The Denver-Aurora locality pay area pays ${K.dec(a.pct, 2)} % on top of the General Schedule base table in ${K.P.year}, unchanged from 2025, ranking ${rank}th of the ${K.AREAS.length} areas. It covers ${counties.length} Colorado counties: the metro core of Denver, Adams, Arapahoe, Jefferson, Douglas and Broomfield, Boulder, the northern counties of Larimer and Weld, and the mountain and plains counties of Clear Creek, Gilpin, Park, Elbert and Lincoln. Step 1 pay on the ${K.P.year} Denver table is ${K.usd(g(5))} at GS-5, ${K.usd(g(7))} at GS-7, ${K.usd(g(9))} at GS-9, ${K.usd(g(11))} at GS-11, ${K.usd(g(12))} at GS-12 and ${K.usd(g(13))} at GS-13. GS-15 meets the ${K.usd(K.CAP)} cap at step ${firstCap}, so ${capped} steps are capped. The most important neighbor is Colorado Springs, a separate area of ${csList.length} counties at ${K.dec(cs.pct, 2)} %. The gap of ${K.dec(gap, 2)} points means a GS-12 step 1 earns ${K.usd(g(12) - g(12, 1, 'CS'))} more in Denver than in Colorado Springs, a larger sum than several step increases.`,
  body: (h) => `
<h2>One state, two very different tables</h2>
<p>Colorado has only two named areas. Denver-Aurora takes ${counties.length} counties in the north and center of the Front Range. Colorado Springs takes ${csList.join(', ')}. Every other county, from Grand Junction to Durango and the eastern plains beyond Lincoln County, is Rest of U.S. at ${K.dec(rus.pct, 2)} %.</p>
<p>Douglas County, south of Denver, is the last county on the Denver side. El Paso County, just beyond it, is Colorado Springs. That single county line separates percentages of ${K.dec(a.pct, 2)} % and ${K.dec(cs.pct, 2)} %.</p>
${h.mini('lookup', { t: 'Denver or Colorado Springs: check the county', p: ['st', 'co'], d: { st: 'CO', co: 'El Paso County', g: '12' } })}
<h2>What the gap does to a career</h2>
<p>A transfer or promotion between the two areas changes pay by much more than a step. The comparison, at step 1:</p>
${h.table(['Grade', 'Denver', 'Colorado Springs', 'Difference'], [9, 11, 12, 13, 14].map((gr) => [`GS-${gr}`, K.usd(g(gr)), K.usd(g(gr, 1, 'CS')), `+${K.usd(g(gr) - g(gr, 1, 'CS'))}`]), `${K.P.year} annual rates, step 1. Denver ${K.dec(a.pct, 2)} %, Colorado Springs ${K.dec(cs.pct, 2)} %.`, ['l', 'r', 'r', 'r'])}
<p>A GS-12 moving from Colorado Springs to a Denver office at the same grade and step gets a raise of ${K.usd(g(12) - g(12, 1, 'CS'))} from the locality alone. The reverse move cuts pay by the same amount; a promotion offered with a transfer south can therefore pay less than staying put. Run both cells through the ${h.a('gs-promotion-calculator', 'promotion calculator')} before you accept.</p>
<h2>Northern Colorado counts as Denver</h2>
<p>Fort Collins and Loveland (Larimer County), Greeley (Weld County) and Boulder are all paid at the Denver rate. So are the mountain counties of Clear Creek, Gilpin and Park west of the metro area. People moving to Fort Collins sometimes assume a lower rate; there is none in that county for ${K.P.year}.</p>
<h2>The cap in both areas</h2>
<p>In Denver, GS-15 steps ${firstCap} to 10 show ${K.usd(K.CAP)}. In Colorado Springs, where the percentage is lower, ${csCapped} GS-15 step${csCapped === 1 ? ' is' : 's are'} capped. The gap between the two areas therefore narrows at the very top of GS-15, because both are pressed against the same ceiling.</p>
<h2>Remote work from the mountains</h2>
<p>Many employees attached to Denver offices live in mountain towns outside the area. Under 5 CFR 531.605, those who are scheduled to report to the Denver worksite at least twice each biweekly pay period keep the Denver rate. Those on full remote agreements are paid where the home is: Summit or Eagle County means Rest of U.S., a difference of ${K.usd(g(11) - g(11, 1, 'RUS'))} for a GS-11 step 1.</p>
`,
  faqs: [
    { q: 'What is the Denver locality pay for 2026?', a: `It is ${K.dec(a.pct, 2)} % for the Denver-Aurora area, the same as in 2025. Applied to the ${K.P.year} base table, it gives ${K.usd(g(11))} for a GS-11 step 1 and ${K.usd(g(13))} for a GS-13 step 1. Rates are capped at ${K.usd(K.CAP)}, which stops ${capped} GS-15 steps.` },
    { q: 'Why is Colorado Springs locality pay lower than Denver?', a: `Locality percentages are set from surveys comparing federal pay with non-federal pay for similar jobs, area by area, not from living costs, and the Colorado Springs result is lower. It is a separate area of ${csList.length} counties at ${K.dec(cs.pct, 2)} % in ${K.P.year}, ${K.dec(gap, 2)} points below Denver.` },
    { q: 'Is Fort Collins in the Denver locality pay area?', a: `Yes. Larimer County, which includes Fort Collins and Loveland, is one of the ${counties.length} Colorado counties in the Denver-Aurora area, as is Weld County with Greeley. A federal worksite there is paid ${K.usd(g(9))} at GS-9 step 1 in ${K.P.year}, exactly as in downtown Denver.` },
  ],
  related: ['locality-pay', 'gs-promotion-calculator', 'gs-pay-scale-2026', 'gs-12', 'gs-pay-cap', 'area:colorado-springs', 'area:seattle'],
});
