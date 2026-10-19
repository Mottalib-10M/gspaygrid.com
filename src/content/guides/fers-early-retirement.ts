import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const BY = 1972, H3 = 100000, SS = 1900;
const mra = K.mra(BY);
const eo = (age: number, yrs: number) => K.fers({ birthYear: BY, retireAgeMonths: age * 12, serviceMonths: yrs * 12, high3: H3, ss62: SS, earlyOut: true });
const a52 = eo(52, 25), a50 = eo(50, 20), a47 = eo(47, 25);
const stay = K.fers({ birthYear: BY, retireAgeMonths: mra, serviceMonths: 30 * 12, high3: H3, ss62: SS });
const noOffer = K.fers({ birthYear: BY, retireAgeMonths: 52 * 12, serviceMonths: 25 * 12, high3: H3, ss62: SS });
const supYears = (62 * 12 - Math.max(a52.supplementStarts, mra)) / 12;

export default defineGuide({
  id: 'fers-early-retirement', group: 'fers', order: 11, slug: 'fers-early-retirement',
  nav: 'FERS early retirement', card: 'VERA or discontinued service: 50 with 20 years or any age with 25, no age reduction, supplement from the MRA.',
  title: 'FERS Early Retirement 2026: VERA and Discontinued Service',
  description: 'FERS early retirement 2026: a VERA offer or discontinued service retirement at 50 with 20 years or any age with 25, no age cut, supplement only from the MRA.',
  h1: 'FERS early retirement in 2026: VERA, discontinued service and what the annuity pays',
  intro: 'An early-out lets you leave with an immediate annuity years before your MRA. Turn on the early-out option in the calculator, then set your age and service.',
  resume: `FERS early retirement covers two cases written in 5 U.S.C. 8414(b): voluntary early retirement (VERA), offered when OPM approves a request from an agency that is restructuring or cutting staff, and discontinued service retirement (DSR), when you are separated involuntarily and not for cause. In both you need age 50 with 20 years of service, or 25 years at any age. The annuity starts right away, uses the 1 % multiplier and carries no age reduction: the 5 % a year cut of MRA+10 does not apply to section 8414. Someone born in ${BY} who accepts an offer at 52 with 25 years and a ${K.usd(H3)} high-3 receives ${K.usd(a52.gross)} a year before any survivor election. The FERS supplement, ${K.usd(a52.supplement / 12)} a month with a ${K.usd(SS)} Social Security estimate, starts only at the MRA of ${K.ym(mra)}, and the annuity gets no COLA before 62. Without the offer, the same worker could only leave with a deferred annuity.`,
  tool: 'fers',
  toolArg: { eo: 'yes', by: String(BY), ra: 52, sy: 25, h3: H3, ss: SS, sv: 'none' },
  faqs: [
    { q: 'Is a FERS early out annuity reduced for age?', a: `No. The reduction of five-twelfths of 1 % per month under 62 in 5 U.S.C. 8415(h) applies only to MRA+10 retirements under section 8412(g) and to deferred annuities under 8413(b). A VERA or discontinued service annuity under section 8414(b) is computed at the plain 1 % rate. Leaving at 52 with 25 years and a ${K.usd(H3)} high-3 gives ${K.usd(a52.gross)} a year.` },
    { q: 'When does the FERS supplement start after a VERA?', a: `At your minimum retirement age, not on the day you leave. Section 8421 pays the supplement to early-out retirees only once they reach the MRA, and it ends at 62 like every supplement. A worker born in ${BY} who leaves at 52 waits until ${K.ym(mra)} and then receives about ${K.usd(a52.supplement / 12)} a month for ${K.dec(supYears, 0)} years, subject to the earnings test.` },
    { q: 'Can I refuse a job offer and still get discontinued service retirement?', a: 'Only if the offer is not reasonable under the statute. Section 8414(b)(2) denies the annuity to an employee who declines a reasonable offer of another position in the same agency, for which the employee is qualified, no lower than two grades or pay levels below the current one, and within the commuting area. An offer outside those limits can be refused without losing DSR.' },
    { q: 'Who is not eligible for a VERA offer?', a: 'Under section 8414(b)(1)(B), you must have been employed continuously by the agency for at least 31 days before it asks OPM for the authority, hold an appointment that is not time limited, not have received notice of removal for misconduct or unacceptable performance, and fall within the units, series, grades or locations the offer covers. Employees already eligible under the special provisions use those rules instead.' },
    { q: 'Should I take a VERA at 50 with 20 years?', a: `It depends on what the lower annuity costs you over time. At 50 with 20 years and a ${K.usd(H3)} high-3, the annuity is ${K.usd(a50.gross)} a year with no COLA before 62, and the supplement waits for the MRA. Staying to ${K.ym(mra)} with 30 years would give ${K.usd(stay.gross)}. The calculator compares both once you type your own record.` },
  ],
  body: (h) => `
<h2>Two doors into the same annuity</h2>
<p>Section ${h.src('usc_8414', '8414(b) of title 5')} groups two situations under one rule. The first is the discontinued service retirement: your agency separates you involuntarily, for a reason other than misconduct or delinquency, typically in a reduction in force. The second is the voluntary early retirement authority, or VERA: an agency undergoing substantial delayering, reorganization, reductions in force, transfer of function or other restructuring asks OPM for the authority, and employees inside the scope of the offer may choose to leave.</p>
<p>In both cases the age and service test is the same: 50 years of age with 20 years of creditable service, or 25 years of service at any age. Employees under the ${h.a('fers-special-provisions', 'special provisions')} for law enforcement officers, firefighters and air traffic controllers do not use section 8414(b); they already have their own early retirement ages.</p>
<h2>Conditions of a VERA offer</h2>
<p>The statute lists them. You must have been employed by the agency continuously for at least 31 days before the date of its request to OPM. Your appointment must not be time limited. You must not have been notified that you are to be separated for misconduct or unacceptable performance. Your position must fall within the scope the agency set for the offer, which can be drawn by organizational unit, occupational series or grade, geographic location, period, skills or any combination of these. The agency sets a window; outside it, the authority does not exist.</p>
<h2>Conditions of a discontinued service retirement</h2>
<p>The separation must be involuntary and not for cause. Section 8414(b)(2) adds a limit: you lose the annuity if you decline a reasonable offer of another position in your agency, for which you are qualified, not lower than two grades or pay levels below your own and within your commuting area. A job offered three grades lower, or in another city, does not count as reasonable under that test.</p>
<h2>How the annuity is computed</h2>
<p>An early-out annuity uses the regular formula of ${h.src('usc_8415', 'section 8415')}: high-3 times years of service times 1 %. Unused sick leave is added to the years, because this is an immediate annuity. The age reduction of section 8415(h), five-twelfths of 1 % for each month under 62, is written for MRA+10 retirements under section 8412(g) and deferred annuities under section 8413(b). It does not mention section 8414, so an early-out annuity at 47 or 52 is paid in full.</p>
${h.table(['Situation (born ' + BY + ')', 'Annuity per year', 'Supplement from the MRA', 'Rule'], [
  ['VERA at 47 with 25 years', K.usd(a47.gross), `${K.usd(a47.supplement / 12)}/mo`, '25 years, any age'],
  ['VERA at 50 with 20 years', K.usd(a50.gross), `${K.usd(a50.supplement / 12)}/mo`, '50 with 20'],
  ['VERA at 52 with 25 years', K.usd(a52.gross), `${K.usd(a52.supplement / 12)}/mo`, '25 years, any age'],
  [`Staying to the MRA (${K.ym(mra)}) with 30 years`, K.usd(stay.gross), `${K.usd(stay.supplement / 12)}/mo`, 'MRA with 30'],
], `High-3 of ${K.usd(H3)}, no sick leave, no survivor election, ${K.usd(SS)} Social Security estimate at 62.`, ['l', 'r', 'r', 'l'])}
${h.mini('fers', { t: 'Your early-out annuity', p: ['ra', 'sy', 'h3'], d: { eo: 'yes', by: String(BY), ra: 52, sy: 25, h3: H3, ss: SS, sv: 'none' } })}
<p>The calculator card shows the supplement amount you will receive; remember that payments of it begin at your MRA, not at separation. The basic annuity starts the month after you leave.</p>
<h2>The supplement and the COLA wait</h2>
<p>Two parts of the package arrive later. The ${h.a('fers-supplement', 'FERS supplement')} is paid to early-out retirees only from the MRA to 62. For the worker in the table who leaves at 52, that means five years with the annuity alone, then about ${K.dec(supYears, 0)} years with the supplement on top. The ${h.a('fers-cola', 'FERS COLA')} follows the age 62 rule of section 8462, which names section 8414 among the annuities that get no increase before 62. From 52 to 62, the ${K.usd(a52.gross)} stays flat in dollars.</p>
<h2>What the offer is worth</h2>
<p>Without the offer, the employee in the example has two paths. Resigning at 52 with 25 years is not a retirement at all: it gives a ${h.a('fers-deferred-retirement', 'deferred annuity')} that can start at the MRA with a reduction or at 60 without one, with no supplement and no sick leave credit. The calculator shows it as a ${noOffer.label.toLowerCase()}. Staying to the MRA with 30 years gives ${K.usd(stay.gross)} a year and the supplement at once. The early out sits between the two: income from the first month, a lower annuity for life, and retiree health coverage if you meet the FEHB rule below.</p>
<h2>Health insurance and the five-year rule</h2>
<p>An early-out retirement is an immediate annuity, so you can keep FEHB coverage into retirement if you meet the usual condition: continuous enrollment, as an enrollee or a covered family member, for the five years of service before the annuity starts, or since your first opportunity to enroll if that is shorter. The rule is set out on OPM's ${h.src('opm_fehb_annuitants', 'FEHB page for annuitants')}. An employee who joined FEHB only two years before the offer should check it before accepting.</p>
<h2>Before you accept</h2>
<p>Ask Human Resources for a written annuity estimate based on your SF-50, your service computation date and your sick leave balance, and check the window dates of the offer. Compare the early-out figure with the one for staying to your ${h.a('fers-minimum-retirement-age', 'MRA')} in the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')}. A survivor election reduces the annuity by 10 % for a full benefit or 5 % for a partial one, the same as in any other retirement.</p>
`,
  related: ['fers-retirement-calculator', 'fers-supplement', 'fers-deferred-retirement', 'fers-minimum-retirement-age', 'fers-cola'],
  sources: ['usc_8414', 'usc_8415', 'usc_8421', 'usc_8462', 'opm_fehb_annuitants', 'opm_fers_types'],
});
