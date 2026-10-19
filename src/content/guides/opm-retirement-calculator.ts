import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.fers;
const p0 = (x: number) => `${K.dec(x * 100, 0)} %`;
const p1 = (x: number) => `${K.dec(x * 100, 1)} %`;
const down = (annual: number) => K.usd(Math.floor(annual / 12));

// Case 1: born 1966, leaves at 60 with 22 years 4 months, high-3 $98,000, 900 hours of sick leave, partial survivor
const svc1 = 22 * 12 + 4;
const c1 = K.fers({ birthYear: 1966, retireAgeMonths: 60 * 12, serviceMonths: svc1, high3: 98000, sickHours: 900, survivor: 'partial', ss62: 1700 });
const sick1 = K.sick(900);
// Case 2: born 1968, MRA+10 at the MRA with 16 years, high-3 $90,000, full survivor
const c2 = K.fers({ birthYear: 1968, retireAgeMonths: K.mra(1968), serviceMonths: 16 * 12, high3: 90000, survivor: 'full' });
const reduced2 = c2.gross - c2.reduction;
const surv2 = reduced2 * F.survivor.fullBenefit;

export default defineGuide({
  id: 'opm-retirement-calculator', group: 'fers', order: 2, slug: 'opm-retirement-calculator',
  nav: 'How OPM computes it', card: 'The order OPM follows: service, high-3, factor, age cut, survivor cut, monthly rounding, then interim pay.',
  title: 'OPM Retirement Calculator 2026: How OPM Computes FERS',
  description: 'OPM retirement calculator 2026, independent: how OPM Retirement Services computes a FERS annuity, the order of reductions, interim pay and the final figure.',
  h1: 'OPM retirement calculator 2026: the computation OPM runs on your FERS file',
  intro: 'This site is not OPM. The calculator below reproduces, as an independent estimate, the steps OPM Retirement Services follows when it turns your records into a monthly FERS annuity.',
  resume: `OPM Retirement Services computes a FERS annuity in a fixed order. It totals your creditable service and drops any fraction of a month, adds unused sick leave for the computation, multiplies your high-3 by ${p0(F.regular.base)} per year (${p1(F.regular.enhanced)} at ${F.regular.enhancedAge} with ${F.regular.enhancedYears} years), applies the age reduction of an MRA+10 or early deferred annuity, then the survivor reduction, and divides by 12, rounding down to the dollar. An employee born in 1966 who leaves at 60 with 22 years and 4 months, a ${K.usd(98000)} high-3 and 900 hours of sick leave is credited with ${Math.floor(c1.serviceCounted / 12)} years and ${c1.serviceCounted % 12} months: ${K.usd(c1.gross)} a year. The partial survivor benefit costs ${p0(F.survivor.partialCost)}, leaving ${down(c1.net)} a month. While OPM finishes the file, which takes about 3 to 5 months in all, it pays interim payments of typically 60 % to 80 % of the estimated net annuity, then an adjustment payment once the final computation is done. This page and its calculator are an independent estimate, not an OPM tool.`,
  tool: 'fers',
  toolArg: { by: '1966', ra: 60, sy: 22, sm: 4, h3: 98000, sv: 'partial', sick: 900, ss: 1700 },
  faqs: [
    { q: 'Does OPM have its own FERS annuity calculator?', a: 'OPM publishes a computation page, a handbook chapter with worksheets and a few planning tools on its retirement site, but the binding figure is the one Retirement Services computes from your certified records after you separate. Any calculator, including the one on this page, is an estimate. This site is independent and has no access to your OPM file.' },
    { q: 'How much is the OPM interim annuity payment?', a: 'OPM says interim payments are typically 60 % to 80 % of your estimated net annuity. No health, life, dental, vision or long-term care premiums are taken from them, and only federal income tax is withheld. When the final computation is done, OPM pays an adjustment for the difference and deducts the insurance premiums owed since you retired.' },
    { q: 'How long does OPM take to finalize a FERS retirement?', a: 'OPM puts the whole process at about 3 to 5 months: 30 to 45 days for your agency and payroll office to send the records, 10 to 15 days for OPM to log the case and assign a claim number, then 10 to 90 days to compute the annuity. Missing documents or unpaid deposits add delays. Regular payments arrive on the first business day of each month for the month before.' },
    { q: 'Why does OPM round my annuity down?', a: `OPM computes the annual annuity to the cent, then divides it by 12 and rounds the monthly amount down to the next lower dollar, according to the worksheets of its computation handbook. It also drops any days left over after your total service in years and months. Both rules cost a few dollars at most, but they explain why an exact estimate can differ from OPM by ${K.usd(1)} or more.` },
    { q: 'Is my agency retirement estimate the same as the OPM computation?', a: 'No. Your benefits office prepares an estimate from your personnel and payroll records, and OPM suggests meeting it at least 60 days before your separation date. OPM then computes the annuity itself from the records certified by your payroll office. Deposits not paid, service that is not creditable or a different survivor election can make the final figure differ from the agency estimate.' },
    { q: 'What is a CSA number from OPM?', a: 'It is your retirement claim number. OPM assigns it when it receives your records from the payroll office, and OPM uses it in every contact after that. Before the number exists, questions about your application go to your agency benefits office, not to OPM. After it exists, you can reach Retirement Services and its online account with it.' },
  ],
  body: (h) => `
<h2>An independent estimate, not an OPM tool</h2>
<p>People search for an OPM retirement calculator because OPM is the office that pays the annuity. This site is run by an independent publisher; it has no link with the Office of Personnel Management and no access to your records. What it can do is follow the published computation rules, those of ${h.src('opm_fers_computation', "OPM's FERS computation page")} and of ${h.src('opm_handbook_50', 'chapter 50 of the CSRS and FERS Handbook')}, in the same order OPM applies them, so that the gap between your estimate and the first OPM letter is as small as possible. The general calculator, with every retirement type explained, is on the ${h.a('fers-retirement-calculator', 'FERS retirement calculator page')}.</p>
<h2>Step 1: total creditable service</h2>
<p>OPM adds all periods of creditable service in years, months and days, then eliminates any fractional part of a month. Under FERS, the service that gives the right to retire is the same service used in the computation and in the high-3 period. Military service is added only if the deposit was paid in full before retirement. Unused sick leave is converted with a chart in which ${K.num(F.sickLeaveHoursPerYear)} hours equal one year, and the result is added to service for the computation of an immediate annuity, not for eligibility. In the case on this page, 900 hours add ${sick1} months to 22 years and 4 months, for ${Math.floor(c1.serviceCounted / 12)} years and ${c1.serviceCounted % 12} months in all.</p>
<h2>Step 2: the high-3 average</h2>
<p>The ${h.a('high-3-salary', 'high-3')} is the highest average basic pay over any three consecutive years of service. OPM's worksheets weight each rate of pay by the time it was in force, and the handbook rounds the average to the nearest dollar. Overtime and bonuses are left out. Your payroll office certifies the pay history; OPM does not rebuild it from your SF-50s, which is one reason why a missing pay record holds up the file.</p>
<h2>Step 3: the accrual factor</h2>
<p>OPM reads a factor from a chart: the service in years and months times ${p0(F.regular.base)}, or times ${p1(F.regular.enhanced)} for those who separate at ${F.regular.enhancedAge} or later with ${F.regular.enhancedYears} years. For special-provision employees the first 20 years count at ${p1(F.special.first20)}. Multiplying the high-3 by the factor gives the unreduced basic annuity: ${K.usd(98000)} times ${Math.floor(c1.serviceCounted / 12)} years and ${c1.serviceCounted % 12} months at ${p0(c1.multiplier)} gives ${K.usd(c1.gross)} a year.</p>
${h.mini('fers', { t: 'Change the service months and the sick leave', p: ['sy', 'sm', 'sick'], d: { by: '1966', ra: 60, sy: 22, sm: 4, h3: 98000, sv: 'partial', sick: 900, ss: 1700 } })}
<h2>Step 4: reductions, in a set order</h2>
<p>The handbook lists the reductions and the order in which they apply. The age reduction comes first, for an MRA+10 or early deferred annuity: five twelfths of 1 % for each full month under 62 on the commencing date, waived if the annuity starts at 60 or later with 20 years. The survivor reduction comes second, computed on the annuity already reduced for age. An alternative annuity reduction, rare, comes last. The order matters because the survivor cost is a percentage of what is left after the age cut.</p>
<p>Take an employee born in 1968 who leaves at the MRA of ${K.ym(K.mra(1968))} with 16 years and a ${K.usd(90000)} high-3, and starts the annuity at once with the full survivor benefit. The unreduced annuity is ${K.usd(c2.gross)}. The age reduction is ${p1(c2.ageReductionPct)}, so the annuity falls to ${K.usd(reduced2)}. The survivor cost is ${p0(F.survivor.fullCost)} of that reduced amount, ${K.usd(c2.survivorCut)}, and the retiree keeps ${K.usd(c2.net)} a year, ${down(c2.net)} a month. Following the handbook worksheets, the survivor annuity is ${p0(F.survivor.fullBenefit)} of the base the retiree chose, here the reduced annuity: about ${down(surv2)} a month. The ${h.a('fers-mra-10', 'MRA+10 page')} shows how postponing changes these numbers.</p>
<h2>Step 5: the monthly amount</h2>
<p>Last, OPM divides the annual figure by 12 and rounds down to the next lower dollar. In the first case, ${K.usd(c1.gross)} less the partial survivor cost of ${K.usd(c1.survivorCut)} is ${K.usd2(c1.net)} a year, so ${down(c1.net)} a month. The partial survivor annuity is ${p0(F.survivor.partialBenefit)} of the annuity: ${down(c1.gross * F.survivor.partialBenefit)} a month. Health and life insurance premiums and tax withholding come off that gross monthly amount later. The FERS supplement, if you qualify, is computed separately and paid alongside; the ${h.a('fers-supplement', 'supplement page')} covers it.</p>
${h.table(['Step', 'What OPM uses', 'Case 1'], [
  ['Service', 'Years and months, days dropped, sick leave added', `${Math.floor(c1.serviceCounted / 12)} years, ${c1.serviceCounted % 12} months`],
  ['High-3', 'Basic pay with locality, 3 consecutive years', K.usd(98000)],
  ['Factor', `${p0(F.regular.base)} a year (${p1(F.regular.enhanced)} at ${F.regular.enhancedAge} with ${F.regular.enhancedYears} years)`, p0(c1.multiplier)],
  ['Basic annuity', 'High-3 x service x factor', K.usd(c1.gross)],
  ['Age reduction', 'MRA+10 and early deferred only', 'None (60 with 20 years)'],
  ['Survivor reduction', `${p0(F.survivor.fullCost)} full, ${p0(F.survivor.partialCost)} partial, after the age cut`, `-${K.usd(c1.survivorCut)}`],
  ['Monthly', 'Annual / 12, rounded down', down(c1.net)],
], 'The order of the computation, from the handbook worksheets.', ['l', 'l', 'r'])}
<h2>What Retirement Services needs from you</h2>
<p>${h.src('opm_quick_guide', "OPM's Retirement Quick Guide")} asks you to pay any open service credit or deposit before you leave, to include the documents your application requires, such as marriage, military or court records, and to review your health, life and survivor elections, since they change the annuity. It also suggests downloading your personnel records, because access ends at retirement. Processing cannot start before your separation date.</p>
<h2>From your agency to the final computation</h2>
<p>Your agency prepares the retirement package and sends it to its payroll office, which pays your last salary and the lump sum for unused annual leave, certifies your records and sends them to OPM, in about 30 to 45 days. OPM then logs the case within 10 to 15 days and assigns your retirement claim number, also called the CSA number. If you are eligible, interim payments begin, typically 60 % to 80 % of your estimated net annuity, with only federal tax withheld and no insurance premiums. The full computation takes another 10 to 90 days. When it is done, OPM pays an adjustment for the difference between the interim and final amounts, deducts the premiums owed since retirement and sends a retirement booklet. Regular payments arrive on the first business day of each month and cover the month before. A budget built on the interim amount for the first months, and on this estimate after that, avoids surprises.</p>
<h2>Why your estimate and OPM's figure can still differ</h2>
<p>The rules are public, but the inputs are in your file. A period of service without retirement deductions, a refund you took years ago, a deposit left unpaid, a part-time schedule or a court order dividing the annuity all change the result in ways no outside calculator can see. Our ${h.a('method', 'method page')} lists what the estimate assumes. When the official letter arrives, compare it line by line with the table above.</p>
`,
  related: ['fers-retirement-calculator', 'high-3-salary', 'fers-survivor-benefit', 'fers-mra-10', 'sick-leave-retirement-credit'],
  sources: ['opm_fers_computation', 'opm_handbook_50', 'opm_quick_guide', 'usc_8415', 'usc_8419'],
});
