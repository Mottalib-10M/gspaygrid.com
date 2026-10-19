import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.fers;
const p0 = (x: number) => `${K.dec(x * 100, 0)} %`;
const mo = (x: number) => `${K.usd(Math.floor(x / 12))}/mo`;
// Case A: born 1972, 18 years, high-3 $95,000 (fewer than 20 years: only 62 removes the cut)
const run = (by: number, years: number, h3: number, start: number, extra = {}) => K.fers({ birthYear: by, retireAgeMonths: K.mra(by), serviceMonths: years * 12, high3: h3, startAgeMonths: start * 12, ...extra });
const a57 = run(1972, 18, 95000, 57), a60 = run(1972, 18, 95000, 60), a62 = run(1972, 18, 95000, 62);
// Case B: born 1970, 22 years, high-3 $100,000 (20 years or more: 60 removes the cut)
const b = [57, 58, 59, 60, 62].map((st) => ({ st, r: run(1970, 22, 100000, st) }));
const b57 = b[0].r, b60 = b[3].r;
const bSick = run(1970, 22, 100000, 57, { sickHours: 2087 });
// Break-even of waiting from 57 to 62 in case A, before COLAs
const lost = a57.net * 5, gainPerYear = a62.net - a57.net, beYears = lost / gainPerYear;
const perMonth = F.mra10ReductionPerYear / 12;

export default defineGuide({
  id: 'fers-mra-10', group: 'fers', order: 6, slug: 'fers-mra-10',
  nav: 'MRA+10 retirement', card: `Leave at your MRA with 10 to 29 years: ${p0(F.mra10ReductionPerYear)} less a year under 62, or postpone to 60 or 62.`,
  title: `FERS MRA+10 Retirement 2026: ${p0(F.mra10ReductionPerYear)} Penalty or Postpone`,
  description: `FERS MRA+10 retirement 2026: leave at your MRA with 10 years, take the annuity cut ${p0(F.mra10ReductionPerYear)} a year under 62, or postpone to 60 or 62. Examples, break-even, FEHB.`,
  h1: 'FERS MRA+10 in 2026: the age penalty, postponing, and what you give up',
  intro: 'MRA+10 lets you leave at your minimum retirement age with as few as 10 years. Pick your year of birth, service and high-3, then move the starting age to see the penalty shrink.',
  resume: `MRA+10 is the FERS retirement for employees who reach their minimum retirement age with at least 10 but fewer than 30 years of service. The annuity is computed like any other, high-3 times years times ${p0(F.regular.base)}, then reduced by ${p0(F.mra10ReductionPerYear)} for each year, five twelfths of 1 % for each month, you are under 62 when it starts. Someone born in 1972 who leaves at 57 with 18 years and a ${K.usd(95000)} high-3 earns ${K.usd(a57.gross)} a year unreduced; starting at once cuts it ${p0(a57.ageReductionPct)} to ${mo(a57.net)}. You may postpone the start: at 62 there is no reduction, and with 20 years or more there is none from 60. With 22 years and a ${K.usd(100000)} high-3, waiting from 57 to 60 lifts the annuity from ${mo(b57.net)} to ${mo(b60.net)}, for life. MRA+10 never pays the FERS supplement. Health benefits can be picked up again when a postponed annuity begins if you were enrolled for the five years before leaving.`,
  tool: 'mra10',
  toolArg: { by: '1972', sy: 18, h3: 95000, start: 57 },
  faqs: [
    { q: 'How much is the MRA+10 penalty?', a: `It is ${p0(F.mra10ReductionPerYear)} of the annuity for each year you are under 62 when payments start, counted by month at five twelfths of 1 %. At an MRA of 57, starting at once costs ${p0(5 * F.mra10ReductionPerYear)}; at 58, ${p0(4 * F.mra10ReductionPerYear)}. The cut is permanent: it does not end at 62 and later COLAs apply to the reduced amount.` },
    { q: 'Is it worth postponing an MRA+10 annuity to 62?', a: `It depends on how long you expect to collect. In the 18-year example, starting at 57 pays ${K.usd(a57.net)} a year; waiting to 62 pays ${K.usd(a62.net)}. The five years given up, ${K.usd(lost)}, are recovered by the extra ${K.usd(gainPerYear)} a year after about ${K.dec(beYears, 0)} years, near age ${62 + Math.round(beYears)}, before COLAs. With 20 years, waiting only to 60 removes the cut.` },
    { q: 'Do I keep FEHB if I postpone my MRA+10 annuity?', a: 'Coverage does not run while the annuity is postponed. OPM says that if you were enrolled in FEHB for the five years immediately before you separate, you can reenroll in a health plan when the postponed annuity begins, with the government share paid as for other retirees. FEGLI follows a similar rule: you can elect to continue it when the annuity starts if you had it for those five years.' },
    { q: 'Can I take MRA+10 with 30 years of service?', a: 'No, and you would not want to. With 30 years at your MRA you qualify for an immediate unreduced annuity with the FERS supplement. MRA+10 is only for 10 to 29 years. The calculator above switches to that case and says so when you type 30 years.' },
    { q: 'Does unused sick leave reduce the MRA+10 penalty?', a: `No. Sick leave raises the annuity before the reduction, since it is added to service for the computation of an MRA+10 annuity, but it does not count toward the 20 years that let you avoid the cut by starting at 60, nor toward the 30 years of an unreduced retirement. A full year of sick leave, ${K.num(F.sickLeaveHoursPerYear)} hours, adds about ${K.usd(bSick.net - b57.net)} a year in the 22-year example.` },
  ],
  body: (h) => `
<h2>Who MRA+10 is for</h2>
<p>MRA+10 is set by ${h.src('usc_8412', '5 U.S.C. 8412')} for employees who reach their ${h.a('fers-minimum-retirement-age', 'minimum retirement age')} with at least 10 years of creditable service but not the 30 that bring an unreduced annuity. You must have reached the MRA on the day you separate, and you cannot use it if you are already 62. It is the usual path for people who joined the government in mid career and for employees with 20 years who do not want to wait until 60.</p>
${h.mini('mra10', { t: 'Move the start age: 57, 60, 62', p: ['sy', 'start'], d: { by: '1970', sy: 22, h3: 100000, start: 57 } })}
<h2>How the reduction works</h2>
<p>OPM computes the annuity in the usual way: high-3, times your service in years and months with unused sick leave added, times ${p0(F.regular.base)}. It then applies the age reduction of ${K.dec(perMonth * 100, 4)} % for each full month you are under 62 on the date the annuity begins, ${p0(F.mra10ReductionPerYear)} a year. A survivor election is applied after that, on the reduced amount. The reduction depends on the age at which the annuity starts, not the age at which you leave. That is what makes postponing possible: you can separate at the MRA and choose a later start date.</p>
${h.table(['Annuity starts at', 'Reduction', 'Per year', 'Per month'], b.map(({ st, r }) => [String(st), p0(r.ageReductionPct), K.usd(r.net), K.usd(Math.floor(r.net / 12))]), `Born in 1970 (MRA ${K.ym(K.mra(1970))}), 22 years, ${K.usd(100000)} high-3, no survivor election. With 20 years, the cut is waived from 60.`, ['l', 'r', 'r', 'r'])}
<h2>Postponing to 60 or 62</h2>
<p>With 20 years of service or more, an annuity that starts at 60 or later has no reduction. With 10 to 19 years, only 62 removes it. In the table above, the employee with 22 years who waits three years gains ${K.usd(b60.net - b57.net)} a year for life. An employee born in 1972 with 18 years does not get that shortcut: starting at 60 still costs ${p0(a60.ageReductionPct)}, ${mo(a60.net)} instead of ${mo(a62.net)} at 62. Postponing does not change the ${p0(F.regular.base)} multiplier: the ${K.dec(F.regular.enhanced * 100, 1)} % rate depends on your age at separation, and an MRA+10 retiree separates before 62.</p>
<h2>A break-even for waiting</h2>
<p>Take the 1972 case with 18 years and a ${K.usd(95000)} high-3. Starting at 57 pays ${K.usd(a57.net)} a year; waiting to 62 pays ${K.usd(a62.net)}. The five years of payments given up add up to ${K.usd(lost)}. The extra ${K.usd(gainPerYear)} a year from 62 takes about ${K.dec(beYears, 0)} years to make that up, near age ${62 + Math.round(beYears)}. COLAs, which regular FERS retirees receive only from 62, raise both paths, and the reduced one by less in dollars, so the true break-even comes a little sooner. Your health, a spouse's survivor benefit and whether you need the money now matter more than this single number.</p>
<h2>No supplement, and what fills the gap</h2>
<p>The ${h.a('fers-supplement', 'FERS supplement')} is paid only with immediate unreduced retirements and early outs. MRA+10 annuities, started at once or postponed, never carry it. A retiree at 57 with 18 years has five years before the earliest Social Security age of 62 with only the reduced annuity, the TSP and any other income. How much of the TSP to draw in those years is a separate decision, and the earlier you start the annuity, the less you need from it.</p>
<h2>Health and life insurance</h2>
<p>${h.src('opm_fers_types', "OPM's page on types of retirement")} says that if you had FEHB coverage for the five years immediately before separating, you can reenroll in a health plan when your postponed annuity begins, and OPM pays the government share. Coverage does not continue in between. FEGLI works the same way: with five years of coverage before separation you can elect to continue it once the annuity starts; otherwise life insurance ends when you leave. A gap in health coverage of several years can cost more than the age reduction you are trying to avoid.</p>
<h2>MRA+10 or a deferred annuity</h2>
<p>An employee who leaves before the MRA with 10 years or more gets a deferred annuity instead. It follows the same reduction and the same postponing rules, but sick leave is not added to service and health and life insurance cannot be picked up again. Leaving on or after the MRA date, rather than a few weeks before, is therefore often worth the wait. The ${h.a('fers-deferred-retirement', 'deferred retirement page')} has the details, and the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} compares both with the survivor election included. Our ${h.a('method', 'method page')} explains how the calculator counts months.</p>
`,
  related: ['fers-minimum-retirement-age', 'fers-retirement-calculator', 'fers-deferred-retirement', 'fers-supplement', 'fers-early-retirement'],
  sources: ['usc_8412', 'usc_8415', 'opm_fers_types', 'opm_fers_computation', 'opm_handbook_50'],
});
