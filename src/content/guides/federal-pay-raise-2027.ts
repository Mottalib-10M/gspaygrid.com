import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const y = P.pay.y2027;
const now = K.pay(12, 3, 'DCB').annual;
const at = (r: number, l = 0) => K.pay2027(12, 3, 'DCB', r, l);
const rus9 = K.pay(9, 1, 'RUS').annual;

export default defineGuide({
  id: 'federal-pay-raise-2027', group: 'pay', order: 3, slug: 'federal-pay-raise-2027',
  nav: 'Federal pay raise 2027', card: `Proposal: ${K.dec(y.planRaise, 1)} % and locality unchanged. Nothing is final yet.`,
  title: 'Federal Pay Raise 2027: Proposal Status and 2026 GS Rates',
  description: `Federal pay raise 2027 as of October 2026: the President proposes ${K.dec(y.planRaise, 1)} % and no locality change, the House bill adds none. Test a scenario on your 2026 GS rate.`,
  h1: 'Federal pay raise 2027: where it stands and what it would pay',
  intro: 'No 2027 GS table exists yet. Test any raise on your 2026 cell; the result is a scenario, never an official rate.',
  resume: `As of ${K.day(P.retrieved_at)}, nothing about the January 2027 federal pay raise is final. The President's alternative pay plan, sent to Congress on ${K.day(y.planLetter)}, proposes an across-the-board increase of ${K.dec(y.planRaise, 1)} % and no change to any locality percentage for 2027, which would leave every General Schedule rate at its 2026 level. Without that plan, the pay law would have required ${K.dec(y.statutoryRaiseWithoutPlan, 1)} % on the base table and locality payments averaging ${K.dec(y.statutoryAvgLocalityWithoutPlan, 1)} %. Congress can still set a different figure in an appropriations law, but the House financial services bill for fiscal 2027 (${y.houseBill}, report ${y.houseReport} of ${K.day(y.houseReportDate)}) contains no pay raise provision. If nothing passes, the plan's figure applies and OPM publishes the tables, expected ${y.tablesExpected}. The calculator above applies any raise you type to your 2026 rate, so you can see what 0 %, 1 % or 2 % would mean.`,
  tool: 'raise2027',
  toolArg: { g: '12', s: '3', a: 'DCB', r: y.scenarioDefault, l: 0 },
  faqs: [
    { q: 'Is a 2027 pay raise for GS employees confirmed?', a: `The proposal on the table is ${K.dec(y.planRaise, 1)} %. The President's alternative pay plan of ${K.day(y.planLetter)} calls for no across-the-board increase and no locality change. Congress could still legislate a raise before January, as it has done in past years, but no bill passed by both chambers contains one as of ${K.day(P.retrieved_at)}. We will replace this answer with the official figure.` },
    { q: 'When will the 2027 GS pay tables be released?', a: `After the rates are set. In a normal year the President signs an executive order on pay in late December and OPM posts the tables the same week or in early January. With a 0 % plan the tables would repeat the 2026 rates, possibly with a new pay cap. We expect them ${y.tablesExpected}.` },
    { q: 'What would the law have given in 2027 without the alternative plan?', a: `The Federal Employees Pay Comparability Act formula gives ${K.dec(y.statutoryRaiseWithoutPlan, 1)} % on the base table, the rise of the Employment Cost Index minus half a point, plus locality payments averaging ${K.dec(y.statutoryAvgLocalityWithoutPlan, 1)} %. Presidents of both parties have replaced that formula with an alternative plan every year, so the statutory figure is a reference, not a forecast.` },
    { q: 'Can the pay cap rise in 2027 even with a 0 % raise?', a: `The cap is the rate of Executive Schedule level IV, ${K.usd(K.CAP)} in 2026. Executive Schedule rates are adjusted under their own rules and are often frozen by appropriations law. If level IV stays at ${K.usd(K.CAP)}, employees held at the cap get nothing in 2027. We keep the cap at its 2026 level in the scenario until the 2027 Executive Schedule is published.` },
  ],
  body: (h) => `
<h2>How a January raise is decided</h2>
<p>Each year the pay law sets a default. The across-the-board part follows the Employment Cost Index for private wages and salaries minus half a percentage point; the locality part is meant to close the gap between federal and non-federal pay measured in each area. Because the default is expensive, the law lets the President send an alternative plan by the end of August, citing a national emergency or serious economic conditions. The alternative becomes the raise unless Congress passes something else. Congress has done that in some years, through a line in an appropriations act, and stayed silent in others.</p>
<p>So three documents decide the figure: the plan letter, the appropriations bills, and the executive order the President signs in December to put the final rates into effect. For 2027, the first exists, the second is still moving, and the third does not exist yet.</p>
<h2>Where 2027 stands</h2>
${h.table(['Step', 'Status on ' + K.day(P.retrieved_at), 'Figure'], [
  ['Statutory default (FEPCA)', 'Replaced by the plan', `${K.dec(y.statutoryRaiseWithoutPlan, 1)} % base, ${K.dec(y.statutoryAvgLocalityWithoutPlan, 1)} % average locality`],
  ['Alternative pay plan', `Sent ${K.day(y.planLetter)}`, `${K.dec(y.planRaise, 1)} %, locality ${y.planLocality}`],
  [`House bill (${y.houseBill})`, `Reported ${K.day(y.houseReportDate)}`, 'No pay raise provision'],
  ['Senate bill and final law', 'Not final', 'Unknown'],
  ['Executive order and OPM tables', 'Not issued', `Expected ${y.tablesExpected}`],
], 'The 2027 raise, step by step. Only an executive order or a law makes a rate official.', ['l', 'l', 'l'])}
<p>A silent appropriations act means the plan applies. A raise inserted by Congress would apply instead. Neither outcome is known, which is why this site publishes no 2027 table and labels every 2027 figure as a scenario.</p>
<h2>What each scenario pays</h2>
<p>The calculator applies the raise you type to the 2026 base rate, rebuilds the locality rate with the 2026 percentage (or with the points you add in the folded options), and keeps the 2026 cap. For a GS-12 step 3 in Washington, paid ${K.usd(now)} in 2026:</p>
${h.table(['Scenario', '2027 annual rate', 'Change'], [0, 0.5, 1, 2, y.statutoryRaiseWithoutPlan].map((r) => [`${K.dec(r, 1)} % across the board`, K.usd(at(r)), `${at(r) - now >= 0 ? '+' : ''}${K.usd(at(r) - now)}`]), 'Scenarios only, on the 2026 Washington table. None of these is an official 2027 rate.', ['l', 'r', 'r'])}
${h.mini('raise2027', { t: 'Test a scenario on another cell', p: ['g', 's', 'r'], d: { g: '9', s: '1', a: 'RUS', r: 1 } })}
<p>At ${K.dec(y.planRaise, 1)} %, a GS-9 step 1 in Rest of U.S. would stay at ${K.usd(rus9)}. Step increases and promotions continue regardless of the annual raise, so most employees still see their pay rise in 2027 through those.</p>
<h2>Locality pay in 2027</h2>
<p>The plan keeps every locality percentage at its 2026 level, which would make 2027 the second year in a row without a locality change. A frozen percentage does not freeze your locality payment in dollars: it moves with the base rate, so at ${K.dec(y.planRaise, 1)} % it would not move at all. The folded option of the calculator lets you add points to every area, to see what a locality increase of, say, half a point would add on top of an across-the-board raise.</p>
<h2>What to watch until January</h2>
<p>Three dates matter. The first is the end of the fiscal 2027 appropriations process, which decides whether a different raise is written into law; a continuing resolution usually carries no pay provision, so the plan stays in place. The second is the executive order on pay, normally signed in the last two weeks of December, which fixes the General Schedule, the Executive Schedule and the cap. The third is OPM's posting of the tables and its pay memo to agencies. Your agency then processes the adjustment for the first pay period beginning on or after January 1, 2027.</p>
<p>If you plan a retirement date, a promotion or a move around January, use the 2026 rates as the floor: under the plan they are also the 2027 rates, and any raise Congress adds would only lift them.</p>
<h2>What a 0 % year means for retirement</h2>
<p>A flat year keeps the high-3 lower than it would have been, which matters most for people retiring in the next three years: every 1 % missing from the last year's salary is about one third of 1 % missing from the high-3. Annuitants are on a different track. Their January 2027 increase is the cost-of-living adjustment, set by the consumer price index: Social Security announced ${K.pct(P.ssa.cola2027, 1)} on ${K.day(P.fers.cola.y2027.announced)}, so the diet COLA rule gives FERS annuitants aged 62 and over ${K.pct(P.fers.cola.y2027.fers, 1)}. The ${h.a('fers-cola', 'COLA page')} has the details and the ${h.a('high-3-salary', 'high-3 page')} shows the effect of a flat year.</p>
<h2>How we will update this page</h2>
<p>The 2027 values live in one place in our data file: the raise, the locality change and the cap. When the executive order is signed we will enter the official figures, rebuild the ${K.AREAS.length} tables from the new base table, check them against the OPM files and date the change here. Until then, the parameter for the official 2027 raise is empty on purpose.</p>
`,
  related: ['federal-pay-raise-2026', 'gs-pay-scale-2026', 'gs-pay-cap', 'fers-cola', 'high-3-salary'],
  sources: ['plan_2027', 'house_fsgg_2027', 'usc_5304', 'eo_14368', 'ssa_cola_2027'],
});
