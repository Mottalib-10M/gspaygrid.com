import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const BY = 1976, H3 = 110000, SS = 1900;
const F = K.P.fers;
const sp = (age: number, yrs: number) => K.fers({ birthYear: BY, retireAgeMonths: age * 12, serviceMonths: yrs * 12, high3: H3, ss62: SS, plan: 'special' });
const a50 = sp(50, 20), a47 = sp(47, 25), a57 = sp(57, 30), a52 = sp(52, 25);
const reg57 = K.fers({ birthYear: BY, retireAgeMonths: 57 * 12, serviceMonths: 30 * 12, high3: H3, ss62: SS });
const path = K.colaPath(a50.gross, 50 * 12, 12, F.cola.y2026.ss, 'special');
const at62 = path.find((r) => r.age === 62) ?? path[path.length - 1];
// 5 U.S.C. 8422(a)(3): the applicable percentage for these positions is half a point above the regular one.
const extra = 0.005;
const rates: Array<[string, number]> = [['Hired before 2013 (FERS)', F.employeeRate.fers], ['Hired in 2013 (FERS-RAE)', F.employeeRate.rae], ['Hired 2014 or later (FERS-FRAE)', F.employeeRate.frae]];

export default defineGuide({
  id: 'fers-special-provisions', group: 'fers', order: 13, slug: 'fers-special-provisions',
  nav: 'FERS special provisions', card: 'LEO, firefighters, air traffic controllers: 50 with 20 or 25 at any age, 1.7 % for the first 20 years.',
  title: 'FERS Special Provisions 2026: LEO, Firefighter, ATC Annuity',
  description: `FERS special provisions 2026: LEOs, firefighters and air traffic controllers retire at 50 with 20 years or at any age with 25, at ${K.pct(F.special.first20, 1)} for the first 20 years.`,
  h1: 'FERS special provisions in 2026: law enforcement, firefighters and air traffic controllers',
  intro: 'Covered positions retire earlier, with a richer formula and a supplement from the first month. Set the plan to LEO, firefighter, ATC in the calculator and enter your record.',
  resume: `The FERS special provisions let law enforcement officers, firefighters, air traffic controllers, Capitol and Supreme Court Police, nuclear materials couriers and customs and border protection officers retire at 50 with 20 years of covered service, or at any age with 25. The annuity is ${K.pct(F.special.first20, 1)} of the high-3 for each of the first 20 years and 1 % for each year after: with a ${K.usd(H3)} high-3, 20 years at 50 pays ${K.usd(a50.gross)} a year, and 30 years at 57 pays ${K.usd(a57.gross)}, against ${K.usd(reg57.gross)} for a regular employee with the same record. The FERS supplement is paid from the first month, ${K.usd(a50.supplement / 12)} a month in the 20-year case with a ${K.usd(SS)} Social Security estimate, and the earnings test does not apply until the MRA. COLAs are paid at any age. In exchange, covered employees pay half a point more of their salary, ${K.pct(F.employeeRate.frae + extra, 1)} for those hired since 2014, and most must leave at 57, or 56 for controllers.`,
  tool: 'fers',
  toolArg: { pl: 'special', by: String(BY), ra: 50, sy: 20, h3: H3, ss: SS, sv: 'none' },
  faqs: [
    { q: 'How is a FERS law enforcement annuity calculated?', a: `Section 8415(e) gives ${K.pct(F.special.first20, 1)} of the high-3 for each year of total service up to 20, plus 1 % for each year beyond 20. With 25 years and a ${K.usd(H3)} high-3, that is 34 % plus 5 %, or ${K.usd(a47.gross)} a year before any survivor election. The high-3 is basic pay with locality, without overtime or bonuses.` },
    { q: 'What is the mandatory retirement age for federal law enforcement officers?', a: 'Under 5 U.S.C. 8425(b), a law enforcement officer, firefighter, nuclear materials courier or customs and border protection officer eligible for immediate retirement is separated at the end of the month of the 57th birthday, or on completing 20 years if then over 57. The agency head may keep the employee to 60 when the public interest requires it. Air traffic controllers are separated at 56, with exemptions possible to 61.' },
    { q: 'Do special provision retirees get the FERS supplement right away?', a: `Yes. The supplement under section 8421 covers retirements under section 8412(d) and (e), and it starts with the annuity, at 50 or earlier with 25 years, and runs to 62. A ${K.usd(SS)} Social Security estimate with 20 years gives ${K.usd(a50.supplement / 12)} a month. The earnings test is waived until the MRA, then applies like for every other retiree.` },
    { q: 'Do FERS law enforcement retirees get a COLA before 62?', a: `Yes. Section 8462(c)(3) withholds the COLA from annuitants under 62, but it expressly excludes retirements under section 8412(d)(1) and (e). A ${K.usd(a50.gross)} annuity started at 50 with ${K.pct(F.cola.y2026.ss, 1)} inflation each year would be about ${K.usd(at62.fers)} at 62 under the diet COLA. A regular retiree's annuity would not have moved.` },
    { q: 'How much do LEOs and firefighters contribute to FERS?', a: `Half a percentage point more than other employees. Section 8422 sets the applicable percentage at 7.5 % instead of 7 % for those hired before 2013, 9.8 % instead of 9.3 % for FERS-RAE and 11.1 % instead of 10.6 % for FERS-FRAE, minus the Social Security tax. The deduction is ${K.pct(F.employeeRate.fers + extra, 1)}, ${K.pct(F.employeeRate.rae + extra, 1)} or ${K.pct(F.employeeRate.frae + extra, 1)} of basic pay.` },
  ],
  body: (h) => `
<h2>Who is covered</h2>
<p>${h.src('usc_8412', 'Section 8412(d)(1)')} names law enforcement officers, members of the Capitol Police and the Supreme Court Police, firefighters, nuclear materials couriers and customs and border protection officers, or any combination of that service. Section 8412(e) covers air traffic controllers. Coverage depends on the position you hold, not on the agency you work for; your human resources office confirms whether your service is covered.</p>
<p>An employee who becomes ill or is injured on duty in a covered position and moves, without a break of more than three days, to a supervisory or administrative position related to the former one can keep that later service treated as covered service, unless the employee elects otherwise. The rule is in section 8412(d)(2) and keeps the special retirement within reach after a career-ending injury.</p>
<h2>Age and service</h2>
<p>The test is 20 years of covered service at age 50 or later, or 25 years of covered service at any age. A firefighter hired at 22 can retire at 47 with 25 years. A law enforcement officer hired at 32 reaches 50 with 18 years and must wait until 52 for the 20. These retirements are immediate and unreduced; there is no MRA test and no age reduction.</p>
<h2>The 1.7 % formula</h2>
<p>${h.src('usc_8415', 'Section 8415(e)')} sets the annuity at ${K.pct(F.special.first20, 1)} of the high-3 for each year of total service up to 20, then 1 % for each year beyond. Twenty years give 34 % of the high-3; thirty give 44 %. A regular FERS employee with thirty years receives 30 %, or 33 % at 62 with the 1.1 % rate.</p>
${h.table(['Retirement', 'Service', 'Share of high-3', 'Annuity per year', 'Supplement'], [
  ['At 47', '25 years', K.pct(a47.multiplier * 25, 0), K.usd(a47.gross), `${K.usd(a47.supplement / 12)}/mo`],
  ['At 50', '20 years', K.pct(a50.multiplier * 20, 0), K.usd(a50.gross), `${K.usd(a50.supplement / 12)}/mo`],
  ['At 52', '25 years', K.pct(a52.multiplier * 25, 0), K.usd(a52.gross), `${K.usd(a52.supplement / 12)}/mo`],
  ['At 57', '30 years', K.pct(a57.multiplier * 30, 0), K.usd(a57.gross), `${K.usd(a57.supplement / 12)}/mo`],
  ['Regular FERS at 57', '30 years', K.pct(reg57.multiplier * 30, 0), K.usd(reg57.gross), `${K.usd(reg57.supplement / 12)}/mo`],
], `High-3 of ${K.usd(H3)}, born in ${BY}, ${K.usd(SS)} Social Security estimate at 62, no sick leave, no survivor election.`, ['l', 'l', 'r', 'r', 'r'])}
${h.mini('fers', { t: 'Your special provisions annuity', p: ['ra', 'sy', 'h3', 'pl'], d: { sick: 0, pl: 'special', by: String(BY), ra: 50, sy: 20, h3: H3, ss: SS, sv: 'none' } })}
<p>Use the calculator only for a record that meets the age and service test. If you leave before 50 with fewer than 25 years, the annuity you keep is a regular deferred one, computed at 1 % under section 8415(a), because the ${K.pct(F.special.first20, 1)} rate of section 8415(e) is written for retirements under section 8412(d)(1) or (e) and the mandatory separations of section 8425.</p>
<h2>The supplement and the earnings test</h2>
<p>The ${h.a('fers-supplement', 'FERS supplement')} starts with the annuity, at whatever age you retire, and stops at 62. That can mean twelve years of supplement for someone who leaves at 50, against five for a regular retiree who leaves at 57. The ${h.a('fers-supplement-earnings-test', 'earnings test')} does not apply to you before your MRA: a retired officer who takes a private security job at 50 keeps the whole supplement until the MRA. After that, wages above the exempt amount reduce it by $1 for every $2, exactly as for everyone else.</p>
<h2>COLA from the first year</h2>
<p>Section 8462(c)(3) withholds the COLA from annuitants under 62, and then excludes annuitants under section 8412(d)(1) and (e). Special provision retirees therefore receive the ${h.a('fers-cola', 'diet COLA')} every December, prorated in the first year. On the 20-year example, ${K.usd(a50.gross)} at 50 becomes about ${K.usd(at62.fers)} at 62 with ${K.pct(F.cola.y2026.ss, 1)} inflation a year. A regular retiree's annuity stays flat until 62.</p>
<h2>Higher contributions</h2>
<p>The richer formula is partly paid for by the employee. ${h.src('usc_8422', 'Section 8422(a)(3)')} sets a higher applicable percentage for these positions, from which the Social Security tax rate is subtracted to give the deduction.</p>
${h.table(['First hired under FERS', 'Regular deduction', 'Special provisions deduction'], rates.map(([l, r]) => [l, K.pct(r, 1), K.pct(r + extra, 1)]), 'Share of basic pay withheld for FERS. The gap is half a point in every category.', ['l', 'r', 'r'])}
<h2>Mandatory separation</h2>
<p>${h.src('usc_8425', 'Section 8425')} sets the end of the career. A law enforcement officer, firefighter, nuclear materials courier or customs and border protection officer eligible for immediate retirement is separated on the last day of the month of the 57th birthday, or of the month 20 years of service are completed if that comes later. The agency head can grant an exemption up to 60 when the public interest requires it. An air traffic controller is separated at 56, or at 20 years if then older, with exemptions possible to 61 for exceptional skills. Capitol Police members are separated at 57, with exemptions set by the Capitol Police Board up to 62. The employee receives written notice at least 60 days in advance.</p>
<h2>Planning around the dates</h2>
<p>The two dates that matter are the one when you complete 20 years at 50 or 25 years at any age, and your mandatory separation date. Between them, each extra year adds 1 % of the high-3 once you pass 20 years, plus whatever raises lift the high-3. Your ${h.a('high-3-salary', 'high-3')} is often highest in the last years, so staying a little longer can pay twice. The ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} handles both plans side by side.</p>
`,
  related: ['fers-retirement-calculator', 'fers-supplement', 'fers-supplement-earnings-test', 'fers-cola', 'fers-contribution-rates'],
  sources: ['usc_8412', 'usc_8415', 'usc_8421', 'usc_8421a', 'usc_8422', 'usc_8425', 'usc_8462', 'opm_fers_types'],
});
