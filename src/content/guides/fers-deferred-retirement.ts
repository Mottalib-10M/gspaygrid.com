import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const BY = 1980, H3 = 90000;
const mra = K.mra(BY);
const d = (age: number, yrs: number, start: number) => K.fers({ birthYear: BY, retireAgeMonths: age * 12, serviceMonths: yrs * 12, high3: H3, startAgeMonths: start * 12, sickHours: 1500 });
const a62 = d(40, 15, 62), aM = d(40, 15, mra / 12), a60 = d(40, 15, 60);
const b60 = d(45, 20, 60), bM = d(45, 20, mra / 12);
const c62 = d(35, 8, 62);
const contrib = K.P.fers.employeeRate.frae;
const red = (x: { ageReductionPct: number }) => K.pct(x.ageReductionPct, 0);

export default defineGuide({
  id: 'fers-deferred-retirement', group: 'fers', order: 12, slug: 'fers-deferred-retirement',
  nav: 'FERS deferred retirement', card: 'Leave with 5 years or more, collect at 62, or from the MRA with 10 years at a reduced rate.',
  title: 'FERS Deferred Retirement 2026: Leaving Early, Annuity Later',
  description: 'FERS deferred retirement 2026: leave with 5 years, collect at 62, or at your MRA with 10 years minus 5 % a year under 62. No supplement, no sick leave credit.',
  h1: 'FERS deferred retirement in 2026: what you keep when you leave before retirement age',
  intro: 'You resign or move to the private sector before you can retire. Your FERS service still buys an annuity later. Set the age you leave, your years and the age the annuity starts.',
  resume: `A FERS deferred annuity is the pension you keep when you leave federal service before you are eligible to retire, under 5 U.S.C. 8413. With at least 5 years of creditable service, it starts at 62. With at least 10 years, you can ask for it as early as your minimum retirement age, but it is then reduced by five-twelfths of 1 % for each month under 62, 5 % a year, unless you would have 30 years at the MRA or 20 years at 60 when it begins. A worker born in ${BY} who leaves at 40 with 15 years and a ${K.usd(H3)} high-3 gets ${K.usd(a62.gross)} a year from 62, or ${K.usd(aM.net)} from the MRA of ${K.ym(mra)}, ${red(aM)} less. A deferred annuity uses the 1 % multiplier, carries no FERS supplement, no credit for unused sick leave and no COLA before 62, and in general you cannot return to FEHB health coverage through it. Taking a refund of contributions instead cancels the annuity for that service.`,
  tool: 'fers',
  toolArg: { by: String(BY), ra: 40, sy: 15, h3: H3, start: 62, sv: 'none' },
  faqs: [
    { q: 'How many years do I need for a FERS deferred annuity?', a: `Five years of creditable civilian service. With 5 to 9 years, the annuity can only start at 62. With 10 years or more, you can elect to start it at your MRA or any month after, up to 62, with a reduction of 5 % a year under 62. A worker who leaves with 8 years and a ${K.usd(H3)} high-3 would receive ${K.usd(c62.gross)} a year from 62.` },
    { q: 'Should I take a refund of FERS contributions or a deferred annuity?', a: `A refund pays back the lump-sum credit, built from the retirement deductions withheld from your pay, and section 8424 says it voids all annuity rights based on that service unless you return to a FERS position. At ${K.pct(contrib, 1)} of pay, the deductions are small next to an annuity of ${K.usd(a62.gross)} a year for life. Your spouse must be notified before a refund is paid.` },
    { q: 'Can I keep federal health insurance with a deferred annuity?', a: 'Generally no. OPM states that individuals are generally not eligible for FEHB coverage when receiving a deferred annuity, and that a surviving spouse of a deferred annuitant is not eligible as a survivor annuitant. To carry FEHB into retirement you need an immediate annuity, including MRA+10, and five years of continuous coverage before it starts.' },
    { q: 'Does unused sick leave count toward a deferred FERS annuity?', a: `No. Section 8415(m) adds unused sick leave only to an immediate annuity or to the annuity of survivors of an employee who dies in service. A former employee who leaves at 40 with ${K.num(1500)} hours on the books receives the same ${K.usd(a62.gross)} at 62 as one who leaves with none. If you are close to an immediate retirement, the hours are one more reason to stay.` },
    { q: 'Is the reduction waived on a deferred annuity at 60?', a: `Yes, if you have at least 20 years of service. Section 8415(h)(2) lifts the age reduction when, at the date the annuity begins, you would meet the age and service of an unreduced retirement: 60 with 20 years or the MRA with 30. Someone who left at 45 with 20 years gets ${K.usd(b60.gross)} from 60, against ${K.usd(bM.net)} from the MRA.` },
  ],
  body: (h) => `
<h2>Two rules in section 8413</h2>
<p>${h.src('usc_8413', 'Section 8413 of title 5')} covers employees who are separated, or transferred to a position outside FERS, before they qualify for an immediate retirement. Paragraph (a) gives anyone with 5 years of service an annuity beginning at 62. Paragraph (b) gives an employee with 10 years who leaves before the MRA the option of a written election to start the annuity at the MRA or at any later date before 62. A worker who leaves after reaching the MRA with 10 years is not deferred: that is an ${h.a('fers-mra-10', 'MRA+10 retirement')}, with its own rules.</p>
<p>The annuity is not automatic: you apply to OPM for it. The amount is computed from your federal record alone: your high-3 from your years in service, your creditable service and the 1 % multiplier. The 1.1 % rate is for employees who retire under section 8412 at 62 or later with 20 years, so it does not apply to a deferred annuity.</p>
<h2>The reduction under 62 and when it disappears</h2>
<p>An annuity started under paragraph (b) before 62 is reduced by five-twelfths of 1 % for every full month between its start and your 62nd birthday, as written in ${h.src('usc_8415', 'section 8415(h)')}. The same paragraph lists an exception: no reduction if, on the start date, your age and service would satisfy an unreduced retirement under section 8412(a) or (b). In practice, that is 20 years of service with an annuity starting at 60 or later, or 30 years with an annuity starting at the MRA or later.</p>
${h.table(['Leaves at', 'Service', 'Starts at', 'Reduction', 'Annuity per year'], [
  ['40', '15 years', K.ym(mra), red(aM), K.usd(aM.net)],
  ['40', '15 years', '60', red(a60), K.usd(a60.net)],
  ['40', '15 years', '62', red(a62), K.usd(a62.net)],
  ['45', '20 years', K.ym(mra), red(bM), K.usd(bM.net)],
  ['45', '20 years', '60', red(b60), K.usd(b60.net)],
  ['35', '8 years', '62', red(c62), K.usd(c62.net)],
], `Born in ${BY}, MRA ${K.ym(mra)}, high-3 of ${K.usd(H3)}, no survivor election. Sick leave does not count.`, ['l', 'l', 'l', 'r', 'r'])}
<p>The choice is a trade. In the first case, starting at the MRA gives ${K.usd(aM.net)} a year for five more years than waiting, but the cut is permanent. Waiting to 62 raises the annuity by ${K.usd(a62.net - aM.net)} a year. Five years of the reduced annuity add up to about ${K.usd(aM.net * 5)}, which the higher annuity takes roughly ${K.dec((aM.net * 5) / (a62.net - aM.net), 0)} years to recover, ignoring COLAs and taxes.</p>
${h.mini('fers', { t: 'Your deferred annuity', p: ['ra', 'sy', 'start'], d: { by: String(BY), ra: 40, sy: 15, h3: H3, start: 62, sv: 'none' } })}
<h2>What a deferred annuity does not include</h2>
<p>Four things that come with an immediate retirement are missing. The ${h.a('fers-supplement', 'FERS supplement')} is paid only to immediate retirements and early outs, so a deferred annuitant who starts at the MRA has no bridge to Social Security. ${h.a('sick-leave-retirement-credit', 'Unused sick leave')} is not credited. The ${h.a('fers-cola', 'COLA')} follows the age 62 rule, since section 8413 annuities are among those it covers. Health insurance is the fourth: OPM's ${h.src('opm_fehb_annuitants', 'FEHB guidance for annuitants')} says individuals generally are not eligible for FEHB when receiving a deferred annuity, and a surviving spouse is not eligible as a survivor annuitant even if covered as an employee.</p>
<h2>Refund or deferred annuity</h2>
<p>When you leave, you can also ask for the lump-sum credit, built from the retirement deductions withheld from your pay. ${h.src('usc_8424', 'Section 8424')} allows it once you have been separated for at least 31 consecutive days, are not back in a FERS job and will not become eligible for an annuity within 31 days. The price is stated in the statute: payment voids all annuity rights based on that service until you are reemployed under FERS. Your spouse and any former spouse are notified, and a court order can block the payment.</p>
<p>The comparison is rarely close for anyone with 10 years or more. An employee hired in 2014 or later contributes ${K.pct(contrib, 1)} of basic pay; the annuity those deductions help fund is worth many times that sum. A refund mostly makes sense with fewer than 5 years, when there is no annuity at all, or when you need the money now and accept losing the pension. Your TSP account is a separate matter, not part of this choice.</p>
<h2>If you come back</h2>
<p>Returning to a FERS position puts you back in the system. Your earlier service counts toward retirement again, and if you leave a second time, eligibility and the annuity are computed on the whole career. A worker who left at 40 with 15 years and returns for 15 more can retire at the MRA with 30 years, with an immediate unreduced annuity, the supplement and the sick leave credit. The ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} computes any combination of age and service.</p>
<h2>Planning the start date</h2>
<p>Write down three dates before you resign: your ${h.a('fers-minimum-retirement-age', 'MRA')}, your 60th birthday if you will have 20 years, and your 62nd birthday. The annuity cannot start before the first, is unreduced from the second with 20 years, and is unreduced for everyone from the third. Keep a copy of your last SF-50 and your leave and earnings statements; OPM will rebuild your record from them when you apply years later.</p>
`,
  related: ['fers-retirement-calculator', 'fers-mra-10', 'fers-minimum-retirement-age', 'fers-early-retirement', 'sick-leave-retirement-credit'],
  sources: ['usc_8413', 'usc_8415', 'usc_8424', 'opm_fehb_annuitants', 'opm_fers_eligibility'],
});
