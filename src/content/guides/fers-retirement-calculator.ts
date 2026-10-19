import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const F = P.fers;
const ex = P.ssa.earningsTest.exempt2026;
const p1 = (x: number) => `${K.dec(x * 100, 1)} %`;
const p0 = (x: number) => `${K.dec(x * 100, 0)} %`;

// A: MRA with 30 years, 1970, high-3 $110,000, 1,200 hours of sick leave, full survivor, SSA $1,900
const a = K.fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 110000, sickHours: 1200, survivor: 'full', ss62: 1900 });
const aWork = K.fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 110000, sickHours: 1200, survivor: 'full', ss62: 1900, earnings: 40000 });
// B: age 62 with 20 years
const b = K.fers({ birthYear: 1964, retireAgeMonths: 62 * 12, serviceMonths: 240, high3: 100000 });
const b61 = K.fers({ birthYear: 1964, retireAgeMonths: 61 * 12, serviceMonths: 240, high3: 100000 });
// C: MRA+10, 1972, 18 years
const c = K.fers({ birthYear: 1972, retireAgeMonths: 57 * 12, serviceMonths: 216, high3: 95000 });
const c60 = K.fers({ birthYear: 1972, retireAgeMonths: 57 * 12, serviceMonths: 216, high3: 95000, startAgeMonths: 60 * 12 });
const c62 = K.fers({ birthYear: 1972, retireAgeMonths: 57 * 12, serviceMonths: 216, high3: 95000, startAgeMonths: 62 * 12 });
// D: deferred, leaves at 45 with 15 years
const d57 = K.fers({ birthYear: 1981, retireAgeMonths: 45 * 12, serviceMonths: 180, high3: 80000, startAgeMonths: 57 * 12 });
const d62 = K.fers({ birthYear: 1981, retireAgeMonths: 45 * 12, serviceMonths: 180, high3: 80000, startAgeMonths: 62 * 12 });
// E: special provisions, 50 with 25 years
const e = K.fers({ birthYear: 1976, retireAgeMonths: 50 * 12, serviceMonths: 300, high3: 120000, plan: 'special', ss62: 2100 });
// F: early out at 52 with 25 years
const f = K.fers({ birthYear: 1974, retireAgeMonths: 52 * 12, serviceMonths: 300, high3: 100000, earlyOut: true, ss62: 1800 });
const mo = (x: number) => `${K.usd(Math.floor(x / 12))}/mo`;

export default defineGuide({
  id: 'fers-retirement-calculator', group: 'fers', order: 1, slug: 'fers-retirement-calculator',
  nav: 'FERS retirement calculator', card: 'Your FERS pension from high-3, years and age: MRA, MRA+10, deferred, early out, survivor cut and supplement.',
  title: 'FERS Retirement Calculator 2026: Pension, MRA, Supplement',
  description: `FERS retirement calculator for 2026: high-3 times years times ${p0(F.regular.base)} or ${p1(F.regular.enhanced)}, MRA+10 and deferred cuts, survivor cost, and the supplement with its earnings test.`,
  h1: 'FERS retirement calculator 2026: your basic annuity, step by step',
  intro: 'Enter your year of birth, the age you plan to leave, your years of service and your high-3. The calculator finds the type of retirement you qualify for and applies every reduction in order.',
  resume: `A FERS basic annuity equals your high-3 average salary times your years of creditable service times ${p0(F.regular.base)}, or ${p1(F.regular.enhanced)} if you separate at ${F.regular.enhancedAge} or older with ${F.regular.enhancedYears} years or more. Someone born in 1970 who leaves at the MRA of ${K.ym(K.mra(1970))} with 30 years, a ${K.usd(110000)} high-3 and 1,200 hours of unused sick leave earns ${K.usd(a.gross)} a year; the full survivor benefit costs ${p0(F.survivor.fullCost)}, leaving ${K.usd(a.net)}, or ${mo(a.net)}. With a ${K.usd(1900)} Social Security estimate, a FERS supplement of ${mo(a.supplement)} is added until 62. You can retire at 62 with 5 years, at 60 with 20, at the MRA with 30, or at the MRA with 10 years under MRA+10, which cuts the annuity ${p0(F.mra10ReductionPerYear)} for each year under 62 unless you postpone it. Law enforcement officers, firefighters and air traffic controllers use ${p1(F.special.first20)} for their first 20 years. Unused sick leave adds to the computation, never to eligibility. The supplement loses $1 for every $2 of wages above ${K.usd(ex)} in ${P.year}.`,
  tool: 'fers',
  toolArg: { by: '1970', ra: 57, sy: 30, h3: 110000, sv: 'full', ss: 1900 },
  faqs: [
    { q: 'How is a FERS pension calculated?', a: `OPM multiplies your high-3 average salary by your creditable service in years and months, then by ${p0(F.regular.base)}. The rate rises to ${p1(F.regular.enhanced)} when you separate at ${F.regular.enhancedAge} or later with at least ${F.regular.enhancedYears} years. From that basic annuity it subtracts any age reduction, then the survivor cost. A ${K.usd(100000)} high-3 with 20 years gives ${K.usd(b61.gross)} at 61 and ${K.usd(b.gross)} at 62.` },
    { q: 'What is the earliest age I can retire under FERS?', a: `For most employees it is the minimum retirement age, between 55 and 57 depending on your birth year: 57 for anyone born in 1970 or later. With 30 years you leave unreduced; with 10 to 29 years you can leave under MRA+10 with a reduction. Special-provision employees can go at 50 with 20 years or at any age with 25, and an early-out offer allows 50 with 20 years.` },
    { q: 'Does unused sick leave count toward FERS retirement?', a: `It counts in the computation of an immediate or MRA+10 annuity, at ${K.num(F.sickLeaveHoursPerYear)} hours for one year of service. It never helps you reach the 20 or 30 years needed to qualify, and it does not count for a deferred annuity. In the example on this page, 1,200 hours add ${K.sick(1200)} months, worth about ${K.usd((110000 * F.regular.base * K.sick(1200)) / 12)} a year for life.` },
    { q: 'Is it better to retire at 62 under FERS?', a: `Leaving at ${F.regular.enhancedAge} with at least ${F.regular.enhancedYears} years lifts the multiplier from ${p0(F.regular.base)} to ${p1(F.regular.enhanced)}, a ${p0(F.regular.enhanced / F.regular.base - 1)} larger annuity for life, and annuity COLAs start right away. Leaving earlier gives you more years of payments and, with 30 years at the MRA or 20 at 60, the supplement. Which path pays more depends on your health, your other income and how long you expect to draw the annuity.` },
    { q: 'Can I leave government at 45 and still get a FERS pension?', a: `Yes, if you have 5 years or more and do not take a refund of your contributions. That is a deferred annuity. With 10 years or more you can start it at your MRA, reduced ${p0(F.mra10ReductionPerYear)} a year under 62, or wait until 62 for the full amount. In our example of 15 years and an ${K.usd(80000)} high-3, that means ${mo(d57.net)} at 57 or ${mo(d62.net)} at 62.` },
    { q: 'Why is my FERS annuity estimate lower than my agency said?', a: `Check four inputs first. A survivor election costs ${p0(F.survivor.fullCost)} or ${p0(F.survivor.partialCost)} and is often left out of quick estimates. OPM drops any fraction of a month from your total service. Military service counts only if the deposit was paid before you retired. Sick leave adds to the computation but not to eligibility. When the figures still differ, compare each input with your SF-50 and your leave and earnings statement.` },
    { q: 'Does this FERS calculator include the supplement earnings test?', a: `Yes. Type the wages you expect to earn after retiring in the folded fields. The supplement is cut $1 for every $2 above ${K.usd(ex)}, the ${P.year} exempt amount. In the main example, ${K.usd(40000)} of wages lowers a ${K.usd(a.supplement)} yearly supplement to ${K.usd(aWork.supplementAfterTest)}. The basic annuity itself is never reduced for earnings.` },
  ],
  body: (h) => `
<h2>What this calculator does</h2>
<p>The tool above reads five inputs that decide almost everything: the year you were born, the age at which you separate, your years of creditable service, your high-3 average salary and your survivor choice. From the first two it finds your minimum retirement age. From age and service it decides which retirement you qualify for under ${h.src('usc_8412', '5 U.S.C. 8412')} and ${h.src('usc_8414', '8414')}: an immediate unreduced annuity, MRA+10, an early-out annuity, or a deferred annuity that starts later. It then computes the basic annuity, applies the age reduction if one applies, takes off the survivor cost and adds the supplement when you are entitled to it. The folded fields handle the less common cases: extra months of age and service, unused sick leave, your Social Security estimate, wages after you retire, the age at which a postponed or deferred annuity begins, and a voluntary early retirement or discontinued service offer.</p>
<h2>Who can retire, and on what terms</h2>
${h.table(['You leave at', 'With', 'Annuity', 'Supplement'], [
  ['62 or older', '5 years', `Unreduced; ${p1(F.regular.enhanced)} with ${F.regular.enhancedYears} years`, 'No'],
  ['60 or 61', '20 years', `Unreduced, ${p0(F.regular.base)}`, 'Yes, until 62'],
  ['Your MRA', '30 years', `Unreduced, ${p0(F.regular.base)}`, 'Yes, until 62'],
  ['Your MRA', '10 to 29 years', `Reduced ${p0(F.mra10ReductionPerYear)} a year under 62, or postponed`, 'No'],
  ['Any age, separated early', '5 years or more', 'Deferred: at 62, or at the MRA with 10 years', 'No'],
  ['50, or any age (early out)', '20 years, or 25', 'Unreduced', 'From your MRA'],
  ['50, or any age (special provisions)', '20 years, or 25', `${p1(F.special.first20)} for 20 years, ${p0(F.regular.base)} after`, 'Yes, until 62'],
], 'FERS retirement types for a nondisability retirement.', ['l', 'l', 'l', 'l'])}
<p>The ${h.a('fers-minimum-retirement-age', 'minimum retirement age')} depends only on your year of birth: 56 for anyone born from 1953 to 1964, then two more months for each year until it reaches 57 for those born in 1970 or later. Reaching it with 30 years is the classic path. If you have fewer years, the ${h.a('fers-mra-10', 'MRA+10 option')} lets you go anyway at a price.</p>
<h2>The formula and its three parts</h2>
<p>The basic annuity is a product of three numbers. The first is your ${h.a('high-3-salary', 'high-3')}: the highest average basic pay you earned in any three consecutive years, locality pay included, overtime and bonuses excluded. The second is your service, in years and whole months, with sick leave added for the computation. The third is the multiplier: ${p0(F.regular.base)} as a rule, ${p1(F.regular.enhanced)} if you are ${F.regular.enhancedAge} or older at separation with ${F.regular.enhancedYears} years or more. A move from 61 to 62 is therefore worth a lot: with a ${K.usd(100000)} high-3 and 20 years, the annuity goes from ${K.usd(b61.gross)} to ${K.usd(b.gross)} a year, before any COLA.</p>
${h.mini('fers', { t: `Test the ${p1(F.regular.enhanced)} multiplier: try 61, then 62`, p: ['ra', 'sy', 'h3'], d: { by: '1964', ra: 62, sy: 20, h3: 100000, sv: 'none' } })}
<h2>Worked example: MRA with 30 years</h2>
<p>Take an employee born in 1970 who leaves at 57 with exactly 30 years, a high-3 of ${K.usd(110000)} and 1,200 hours of unused sick leave. The sick leave converts to ${K.sick(1200)} months, so the computation uses ${Math.floor(a.serviceCounted / 12)} years and ${a.serviceCounted % 12} months. At ${p0(a.multiplier)}, the basic annuity is ${K.usd(a.gross)} a year. Electing the full survivor benefit costs ${p0(F.survivor.fullCost)}, ${K.usd(a.survivorCut)}, which leaves ${K.usd(a.net)} a year, about ${mo(a.net)}. A spouse who outlives the retiree would receive ${mo(a.survivorAnnuity)} plus later COLAs. Because this is an immediate unreduced retirement before 62, the ${h.a('fers-supplement', 'FERS supplement')} is paid too: with a ${K.usd(1900)} Social Security estimate it adds ${mo(a.supplement)} until the month before the 62nd birthday.</p>
<h2>Survivor election</h2>
<p>A married retiree gets the full survivor benefit unless the spouse consents to less. The full benefit pays the survivor ${p0(F.survivor.fullBenefit)} of your annuity before the survivor cost and costs ${p0(F.survivor.fullCost)}; the partial benefit pays ${p0(F.survivor.partialBenefit)} and costs ${p0(F.survivor.partialCost)}. The calculator applies the cost after the age reduction. The ${h.a('fers-survivor-benefit', 'survivor benefit page')} compares the options over the years.</p>
<h2>MRA+10 and postponing</h2>
<p>Someone born in 1972 who leaves at the MRA of 57 with 18 years and a ${K.usd(95000)} high-3 has an unreduced annuity of ${K.usd(c.gross)}. Starting it at once means ${p0(c.ageReductionPct)} less, for life: ${mo(c.net)}. Postponing to 60 reduces the cut to ${p0(c60.ageReductionPct)} and gives ${mo(c60.net)}; postponing to 62 removes it and gives ${mo(c62.net)}. With 20 years or more, postponing only to 60 would already erase the reduction. MRA+10 never carries the supplement. In the calculator, set the starting age in the folded field.</p>
<h2>Deferred annuities</h2>
<p>If you leave before you qualify for an immediate annuity, you keep a right to a deferred one as long as you have 5 years of service and leave your contributions in the fund. With fewer than 10 years it starts at 62. With 10 years or more you may start it at your MRA, reduced like MRA+10. A worker born in 1981 who leaves at 45 with 15 years and an ${K.usd(80000)} high-3 would receive ${mo(d57.net)} from 57, or ${mo(d62.net)} from 62. Sick leave does not count for a deferred annuity, and there is no supplement. Set the age of separation and the start age in the tool to see your case.</p>
<h2>Early outs and special provisions</h2>
<p>When an agency offers voluntary early retirement, or separates you involuntarily under discontinued service rules, you can retire at 50 with 20 years or at any age with 25, with no age reduction. The supplement waits for your MRA: an employee born in 1974 who takes an offer at 52 with 25 years and a ${K.usd(100000)} high-3 receives ${mo(f.net)} at once and ${mo(f.supplement)} of supplement from 57. Law enforcement officers, firefighters and air traffic controllers retire at 50 with 20 years or at any age with 25, and their first 20 years count at ${p1(F.special.first20)}. At 50 with 25 years and a ${K.usd(120000)} high-3, that gives ${K.usd(e.gross)} a year before any survivor election. Choose "LEO, firefighter, ATC" in the plan field.</p>
<h2>The supplement and its earnings test</h2>
<p>The supplement follows the immediate unreduced retirements before 62, early outs from the MRA and the special provisions. It is reduced by half of your wages and self-employment income above ${K.usd(ex)} in ${P.year}, based on the previous year's earnings. If you plan to work after retiring, type the expected wages: the calculator shows what is left. The ${h.a('fers-supplement-earnings-test', 'earnings test page')} explains the timing.</p>
<h2>What the result does not include</h2>
<p>The figure is gross. Federal income tax, health and life insurance premiums are deducted later from the monthly payment. Military service counts only if you paid the deposit. Part-time service, a CSRS component and court orders change the computation in ways no general tool can see. Your agency benefits office and OPM Retirement Services hold the official numbers; the ${h.a('opm-retirement-calculator', 'page on how OPM computes the annuity')} explains what they check. Our ${h.a('method', 'method page')} lists every rule the calculator follows.</p>
`,
  related: ['opm-retirement-calculator', 'fers-supplement', 'fers-mra-10', 'high-3-salary', 'fers-survivor-benefit', 'fers-deferred-retirement'],
  sources: ['usc_8412', 'usc_8414', 'usc_8415', 'usc_8421', 'opm_fers_computation', 'opm_fers_types', 'opm_fers_eligibility'],
});
