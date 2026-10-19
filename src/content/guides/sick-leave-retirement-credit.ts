import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const HY = K.P.fers.sickLeaveHoursPerYear;
const H3 = 105000;
const mo1500 = K.sick(1500), gain1500 = (H3 * K.P.fers.regular.base * mo1500) / 12;
const without = K.fers({ birthYear: 1969, retireAgeMonths: 57 * 12, serviceMonths: 30 * 12, high3: H3 });
const withSick = K.fers({ birthYear: 1969, retireAgeMonths: 57 * 12, serviceMonths: 30 * 12, high3: H3, sickHours: 1500 });
const big = K.fers({ birthYear: 1969, retireAgeMonths: 57 * 12, serviceMonths: 30 * 12, high3: H3, sickHours: HY });
const at62 = K.fers({ birthYear: 1964, retireAgeMonths: 62 * 12, serviceMonths: 25 * 12, high3: H3, sickHours: 1500 });
const at62no = K.fers({ birthYear: 1964, retireAgeMonths: 62 * 12, serviceMonths: 25 * 12, high3: H3 });
const def = K.fers({ birthYear: 1975, retireAgeMonths: 45 * 12, serviceMonths: 15 * 12, high3: 90000, sickHours: 1500 });

export default defineGuide({
  id: 'sick-leave-retirement-credit', group: 'fers', order: 10, slug: 'sick-leave-retirement-credit',
  nav: 'Sick leave credit', card: `${K.num(HY)} hours of unused sick leave add one year to the FERS computation, never to eligibility.`,
  title: 'Sick Leave Retirement Credit 2026: FERS Hours to Annuity',
  description: `Sick leave retirement credit 2026: ${K.num(HY)} unused hours add one year to your FERS annuity computation, at 100 %, but never to eligibility or a deferred annuity.`,
  h1: 'Sick leave retirement credit in 2026: what unused hours add to a FERS annuity',
  intro: 'Unused sick leave is not paid out when you leave federal service, but it can raise your FERS annuity. Type your hours and your high-3 to see by how much.',
  resume: `Under FERS, 100 % of your unused sick leave has counted in the annuity computation since 2014: OPM converts the hours into service at the rate of ${K.num(HY)} hours for one year, about 174 hours for one month, and adds them to your years before applying the 1 % or 1.1 % multiplier. With ${K.num(1500)} hours, that is ${mo1500} extra months; on a ${K.usd(H3)} high-3 at 1 %, the annuity rises by about ${K.usd(gain1500)} a year, for life and with every later COLA. A 30-year retiree at the MRA goes from ${K.usd(without.gross)} to ${K.usd(withSick.gross)} a year before any survivor reduction. Sick leave never counts toward eligibility: 29 years and 10 months of service plus a year of sick leave does not make the 30 years needed at the MRA. It is credited to an immediate or MRA+10 annuity only. If you leave federal service and take a deferred annuity, the hours are lost, and they are never paid in cash.`,
  tool: 'sick',
  toolArg: { hrs: 1500, h3: H3, mul: '1' },
  faqs: [
    { q: 'How many hours of sick leave equal one year of FERS service?', a: `${K.num(HY)} hours, the number of working hours OPM uses in a year. A month of credit takes about 174 hours. OPM adds the hours to your actual service, then drops any remainder smaller than a month from the total. ${K.num(1500)} hours give ${mo1500} months; ${K.num(3000)} hours give ${K.sick(3000)} months, so ${K.ym(K.sick(3000))} years of extra credit.` },
    { q: 'Can unused sick leave help me reach 30 years for retirement?', a: 'No. Section 8415(m) adds sick leave to the computation of the annuity, not to the service that makes you eligible. If you have 29 years and 11 months at your MRA, you are still one month short of the 30 years for an unreduced annuity, whatever your balance. You either work the extra month or retire under MRA+10 with its reduction.' },
    { q: 'Do I lose my sick leave if I take a deferred FERS annuity?', a: `Yes. Section 8415(m) gives the credit to an employee who retires on an immediate annuity, which includes MRA+10, and to the survivors of an employee who dies in service. A former employee who leaves before retirement age and claims a deferred annuity later gets no credit for the hours. Someone who leaves at 45 with 15 years and ${K.num(1500)} hours would see ${K.usd(def.gross)} a year at 62, the same as with zero hours.` },
    { q: 'Is FERS sick leave credit still 50 percent?', a: 'No. Section 8415(m)(2)(B) set the applicable percentage at 50 % for separations up to December 31, 2013, and at 100 % for separations after that date. Any FERS employee who retires in 2026 therefore gets credit for every unused hour on the books at separation, as long as the annuity is an immediate one and the hours were never paid in cash.' },
  ],
  body: (h) => `
<h2>From hours to months of service</h2>
<p>When you retire, your agency reports your unused sick leave on the final leave statement. OPM divides the hours by ${K.num(HY)}, the hours of a work year, and converts the result into years, months and days. That credit is added to your creditable service, and the total is used in the annuity formula. Any days left over that do not make a full month are dropped. The conversion chart OPM uses is in ${h.src('opm_handbook_50', 'chapter 50 of the CSRS/FERS Handbook')}.</p>
${h.table(['Unused hours', 'Months added', 'Annuity gain per year at 1 %', 'At 1.1 %'], [500, 1000, 1500, HY, 3000, 4000].map((x) => { const m = K.sick(x); return [K.num(x), String(m), K.usd((H3 * K.P.fers.regular.base * m) / 12), K.usd((H3 * K.P.fers.regular.enhanced * m) / 12)]; }), `With a ${K.usd(H3)} high-3, before survivor reduction. Months are whole months, as in the computation.`, ['l', 'r', 'r', 'r'])}
<p>The value of an hour depends on your high-3 and your multiplier, not on your grade at the time you earned it. A month of credit is worth one-twelfth of 1 % of the high-3 a year, or one-twelfth of 1.1 % if you retire at 62 or later with 20 years. On a ${K.usd(H3)} high-3, that is ${K.usd(H3 * K.P.fers.regular.base / 12)} a year per month of credit at 1 %.</p>
${h.mini('sick', { t: 'What your unused sick leave adds to the annuity', p: ['hrs', 'h3'], d: { hrs: 1500, h3: H3, mul: '1' } })}
<h2>Computation only, never eligibility</h2>
<p>The rule that surprises most employees is that sick leave does not move the retirement date. Section 8415(m) of ${h.src('usc_8415', 'title 5')} adds unused sick leave to the service used to compute the annuity, nothing more. Every eligibility test of ${h.a('fers-minimum-retirement-age', 'the MRA with 30 years')}, 60 with 20, 62 with 5, MRA+10 or the special provisions is counted on actual creditable service. A balance of ${K.num(HY)} hours will not turn 29 years into 30.</p>
<p>The same holds for the 1.1 % multiplier. It needs 20 years of service at separation at age 62 or later, and sick leave does not count toward the 20. It also stays out of the supplement: OPM counts FERS civilian years for the ${h.a('fers-supplement', 'FERS supplement')}, without sick leave or military service. For the special provisions, sick leave raises the annuity but does not help reach 20 or 25 years of covered service.</p>
<h2>Which retirements get the credit</h2>
<p>The credit goes to an immediate annuity: the MRA with 30 years, 60 with 20, 62 with 5, the special provisions, an ${h.a('fers-early-retirement', 'early-out retirement')} and the reduced ${h.a('fers-mra-10', 'MRA+10 annuity')}. The survivors of an employee who dies in service also receive it in the computation of their annuity. It does not go to a ${h.a('fers-deferred-retirement', 'deferred annuity')}, the one you claim years after leaving federal service before retirement age. That is why an employee who resigns at 45 with a large balance and waits for a deferred annuity gets nothing for it.</p>
<h2>Three cases with the numbers</h2>
<p>A worker born in 1969 retires at the MRA of ${K.ym(K.mra(1969))} with 30 years and a ${K.usd(H3)} high-3. Without sick leave the basic annuity is ${K.usd(without.gross)} a year. With ${K.num(1500)} hours on the books it becomes ${K.usd(withSick.gross)}, and with a full year of ${K.num(HY)} hours it becomes ${K.usd(big.gross)}. Over 25 years of retirement, the ${K.num(1500)} hours alone pay about ${K.usd((withSick.gross - without.gross) * 25)} before COLAs.</p>
<p>A worker who stays to 62 with 25 years gets the 1.1 % multiplier, so each month of credit is worth a little more: ${K.usd(at62no.gross)} a year without sick leave, ${K.usd(at62.gross)} with ${K.num(1500)} hours. A former employee who left at 45 with 15 years and ${K.num(1500)} hours, and who claims a deferred annuity at 62, receives ${K.usd(def.gross)}, the same as if the balance had been zero.</p>
<h2>Is it worth saving sick leave?</h2>
<p>Sick leave exists to cover illness, and that comes first. The value of a balance kept to retirement is real but modest: on the example above, a month of credit adds less than a hundred dollars a year. The statute credits only hours for which you have not received payment, and the hours never become cash when you leave. The credit also follows any survivor election, so a full survivor annuity of 50 % includes half of the extra amount. Before you pick a retirement date, ask your agency for the hours shown on your last leave and earnings statement, then type them in the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} with the rest of your record.</p>
`,
  related: ['fers-retirement-calculator', 'high-3-salary', 'fers-mra-10', 'fers-deferred-retirement', 'fers-minimum-retirement-age'],
  sources: ['usc_8415', 'opm_handbook_50', 'opm_fers_computation'],
});
