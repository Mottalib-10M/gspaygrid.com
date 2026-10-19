import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.fers;
const p0 = (x: number) => `${K.dec(x * 100, 0)} %`;
const rows = F.mra as Array<[number, number, number]>;
// Birth-year ranges of the MRA table, read from params (born up to [year] inclusive)
const ranges = rows.map(([upTo], i) => {
  const from = i === 0 ? null : rows[i - 1][0] + 1;
  const label = from === null ? `${upTo} or earlier` : upTo === 9999 ? `${from} or later` : from === upTo ? String(upTo) : `${from} to ${upTo}`;
  return [label, K.ym(K.mra(upTo === 9999 ? from! : upTo))];
});
const mra66 = K.mra(1966), mra70 = K.mra(1970), mra64 = K.mra(1964);
const imm = K.fers({ birthYear: 1966, retireAgeMonths: mra66, serviceMonths: 360, high3: 105000, ss62: 2000 });
const ten = K.fers({ birthYear: 1966, retireAgeMonths: mra66, serviceMonths: 25 * 12, high3: 105000 });
const tenPct = Math.max(0, 62 * 12 - mra66) * (F.mra10ReductionPerYear / 12);

export default defineGuide({
  id: 'fers-minimum-retirement-age', group: 'fers', order: 5, slug: 'fers-minimum-retirement-age',
  nav: 'Minimum retirement age (MRA)', card: 'Your MRA by year of birth: 55 to 57, with what 30 years or 10 years give you at that age.',
  title: 'FERS Minimum Retirement Age 2026: MRA Table by Birth Year',
  description: 'FERS minimum retirement age 2026: the MRA table by year of birth, from 55 to 57, what 30 years or 10 years give you at the MRA, and how to find your exact date.',
  h1: 'FERS minimum retirement age (MRA) 2026: the table by year of birth',
  intro: 'Your MRA is set by your year of birth alone. Pick your year and your expected service to see the age and what it lets you do.',
  resume: `The FERS minimum retirement age, or MRA, is fixed by 5 U.S.C. 8412(h) according to your year of birth. It is 55 for anyone born before 1948, rises by two months a year to reach 56 for those born from 1953 to 1964, then rises again by two months a year: ${K.ym(K.mra(1965))} for 1965, ${K.ym(mra66)} for 1966, up to ${K.ym(K.mra(1969))} for 1969, and ${K.ym(mra70)} for everyone born in 1970 or later. At the MRA with 30 years of service you can retire on an immediate unreduced annuity and receive the FERS supplement until 62. With 10 to 29 years you can leave under MRA+10, but the annuity is cut ${p0(F.mra10ReductionPerYear)} for each year under 62 unless you postpone it. For someone born in 1966 who leaves at the MRA with 25 years, that cut is ${K.dec(tenPct * 100, 1)} %. The MRA also matters if you left early: a deferred annuity with 10 years can start there. It is not your Social Security full retirement age.`,
  tool: 'mra',
  toolArg: { by: '1968', sy: 25 },
  faqs: [
    { q: 'What is my MRA if I was born in 1966?', a: `It is ${K.ym(mra66)}, which you reach four months after your 56th birthday, in 2022 or early 2023 depending on your birth month. Everyone born from 1965 to 1969 adds two months a year to 56: ${K.ym(K.mra(1965))} for 1965, ${K.ym(K.mra(1967))} for 1967, ${K.ym(K.mra(1968))} for 1968 and ${K.ym(K.mra(1969))} for 1969. Born in 1970 or later, it is ${K.ym(mra70)}.` },
    { q: 'Can I retire at 55 under FERS?', a: `Only in special cases. The MRA of 55 applied to people born before 1948. Today you can leave at 55 only under the special provisions for law enforcement officers, firefighters and air traffic controllers, under a voluntary early retirement or discontinued service offer with 20 years at 50 or 25 at any age, or with a deferred annuity once you reach your own MRA, which is ${K.ym(mra64)} or more.` },
    { q: 'Is the FERS MRA the same as Social Security full retirement age?', a: `No. The MRA is a FERS rule that lets you draw your federal annuity between 55 and 57. Social Security has its own full retirement age, 67 for people born in 1960 or later, and its earliest claiming age is 62. The FERS supplement exists to fill that gap: it pays an estimate of your federal share of Social Security from the MRA until 62.` },
    { q: 'Do I have to be at my MRA on the day I leave?', a: 'For MRA+10, yes: OPM says you must have reached your MRA on the day you separate from federal service. If you leave even a day before, you no longer qualify for an immediate MRA+10 annuity and your benefit becomes a deferred annuity. Check your exact birth date and the date your MRA falls before you pick a separation date with your benefits office.' },
  ],
  body: (h) => `
<h2>The MRA table</h2>
<p>The table is written into ${h.src('usc_8412', '5 U.S.C. 8412(h)')}. Since everyone born in 1970 or later has an MRA of ${K.ym(mra70)}, the table no longer changes for the people now starting their careers.</p>
${h.table(['Year of birth', 'Minimum retirement age'], ranges, 'FERS minimum retirement age by year of birth, 5 U.S.C. 8412(h).', ['l', 'r'])}
<p>To find your exact date, add the MRA to your date of birth. Someone born on March 10, 1967 reaches an MRA of ${K.ym(K.mra(1967))} on September 10, 2023. Someone born in 1972 reaches ${K.ym(K.mra(1972))} on the 57th birthday, in 2029. The calculator above gives the year and month for any year from 1955.</p>
${h.mini('mra', { t: 'Your MRA and what it gives you', p: ['by', 'sy'], d: { by: '1970', sy: 30 } })}
<h2>What the MRA opens with 30 years</h2>
<p>With 30 years of creditable service, the MRA is the first age at which you can leave on an immediate, unreduced annuity. The annuity is ${p0(F.regular.base)} of your ${h.a('high-3-salary', 'high-3')} per year of service, and it comes with the ${h.a('fers-supplement', 'FERS supplement')} until 62. Unused sick leave raises the computation but cannot fill a gap in the 30 years: an employee with 29 years and 11 months and a large sick leave balance still falls short. Someone born in 1966 who leaves at the MRA of ${K.ym(mra66)} with 30 years and a ${K.usd(105000)} high-3 receives ${K.usd(imm.gross)} a year, plus about ${K.usd(imm.supplement / 12)} a month of supplement with a ${K.usd(2000)} Social Security estimate, for close to six years.</p>
<h2>What the MRA opens with 10 to 29 years</h2>
<p>With at least 10 years but fewer than 30, the MRA opens the ${h.a('fers-mra-10', 'MRA+10 retirement')}. You can leave and start the annuity at once, reduced by ${p0(F.mra10ReductionPerYear)} a year, five twelfths of 1 % a month, for each month you are under 62. Or you can leave and postpone the start to reduce or erase the cut: no reduction at 62, and none at 60 if you have 20 years. The same person born in 1966 with 25 years instead of 30 would get an unreduced annuity of ${K.usd(ten.gross)}, cut ${K.dec(tenPct * 100, 1)} % if started at the MRA, down to ${K.usd(ten.net)}. No supplement is paid under MRA+10.</p>
<h2>The MRA for those who already left</h2>
<p>If you left federal service before the MRA with at least 10 years and did not take a refund of your contributions, you can claim a deferred annuity starting at the MRA, with the same ${p0(F.mra10ReductionPerYear)} a year reduction under 62, waived from 60 if you have 20 years. With 5 to 9 years, the deferred annuity waits until 62. The ${h.a('fers-deferred-retirement', 'deferred retirement page')} works through the choice of starting age.</p>
<h2>Where the MRA matters even if you retire earlier</h2>
<p>Two groups can retire before their MRA. Law enforcement officers, firefighters and air traffic controllers qualify at 50 with 20 years or at any age with 25. Employees offered voluntary early retirement or separated under discontinued service rules qualify at 50 with 20 years or at any age with 25. The MRA still shapes their benefits. Early-out retirees receive the supplement only once they reach the MRA. Special-provision retirees receive it from the start, and their earnings before the MRA are not counted in the supplement ${h.a('fers-supplement-earnings-test', 'earnings test')}.</p>
<h2>The MRA and your Social Security age are not the same</h2>
<p>Many employees confuse the two. The MRA only says when FERS can start paying you. Social Security can be claimed from 62 at a reduced rate, and in full at its own full retirement age, 67 for those born in 1960 or later. A retiree who leaves at the MRA with 30 years bridges the years between the two with the supplement. A retiree under MRA+10 has no bridge and lives on the annuity, the TSP or other income until Social Security begins.</p>
<h2>Picking a separation date around the MRA</h2>
<p>OPM requires that you have reached your MRA on the day you separate for an MRA+10 retirement. For a 30-year retirement, the same age test applies: both the age and the service must be met at separation. Check the exact date with your benefits office before you sign anything. The ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} lets you enter extra months of age and service in the folded fields to test a precise date. Our ${h.a('method', 'method page')} explains how months are counted.</p>
`,
  related: ['fers-mra-10', 'fers-retirement-calculator', 'fers-supplement', 'fers-deferred-retirement', 'fers-special-provisions'],
  sources: ['usc_8412', 'opm_fers_eligibility', 'opm_fers_types'],
});
