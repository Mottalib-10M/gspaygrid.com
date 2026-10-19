import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.P.tsp;
const auto = T.automatic * 100;
const sal = 85000;
const rows = [0, 1, 2, 3, 4, 5, 6, 10].map((p) => ({ p, m: K.match(sal, p), miss: K.missed(sal, p) }));
const at = (p: number) => rows.find((r) => r.p === p)!;
const gs = K.pay(12, 5, 'DCB').annual;
const gsFull = K.match(gs, 5), gs2 = K.match(gs, 2);
const l45 = K.limit(45), l55 = K.limit(55), l61 = K.limit(61), l64 = K.limit(64);
const fullAgency = at(5).m.agency / sal * 100;

export default defineGuide({
  id: 'tsp-matching', group: 'more', order: 1, slug: 'tsp-matching',
  nav: 'TSP matching', card: `${K.dec(auto, 0)} % automatic plus up to 4 % of matching when you put in 5 %. Limit ${K.usd(T.deferral)} in ${K.P.year}.`,
  title: 'TSP Matching 2026: Agency 1 %, Full Match at 5 % and Limits',
  description: `TSP matching 2026 for FERS: ${K.dec(auto, 0)} % automatic, dollar for dollar on the first 3 %, half on the next 2 %. Put in 5 % to get 5 %. Limit ${K.usd(T.deferral)}, catch-up ${K.usd(T.catchUp50)}.`,
  h1: 'TSP matching in 2026: how much your agency adds and how to get all of it',
  intro: 'Enter your basic pay and the percentage you contribute: the calculator shows the agency money that goes into your Thrift Savings Plan account and what you leave behind below 5 %.',
  resume: `Under FERS, your agency puts money into your Thrift Savings Plan account in two layers. First, an automatic contribution of ${K.dec(auto, 0)} % of basic pay every pay period, even if you contribute nothing. Second, a match on your own contributions: dollar for dollar on the first 3 % of pay you put in, then 50 cents per dollar on the next 2 %. Contributing 5 % therefore brings 4 % of matching, for ${K.dec(fullAgency, 0)} % of agency money in total. On a basic pay of ${K.usd(sal)}, that is ${K.usd(at(5).m.agency)} a year from the agency against ${K.usd(at(5).m.employee)} from you. At 3 % you would receive ${K.usd(at(3).m.agency)} and leave ${K.usd(at(3).miss)} of match on the table each year; at 1 %, ${K.usd(at(1).miss)}. Anything above 5 % is not matched. In ${K.P.year} the IRS limit on your own contributions is ${K.usd(T.deferral)}, plus a catch-up of ${K.usd(T.catchUp50)} from age 50 or ${K.usd(T.catchUp60to63)} at ages 60 to 63. Agency money does not count toward that limit.`,
  tool: 'tsp',
  toolArg: { sal, c: 5, age: 45 },
  faqs: [
    { q: 'How much of my pay do I need to put in the TSP to get the full match?', a: `Five percent of basic pay each pay period. At that rate the agency matches 4 %, which with the automatic ${K.dec(auto, 0)} % makes ${K.dec(fullAgency, 0)} % of your pay in agency money. On ${K.usd(sal)} that is ${K.usd(at(5).m.agency)} a year. A sixth percent and beyond still grows your account but brings no extra match.` },
    { q: 'Does the agency 1 % TSP contribution belong to me right away?', a: 'Not for most employees. Under 5 U.S.C. 8432(g) the automatic contributions and their earnings are forfeited if you leave federal service before 3 years of civilian service, or 2 years for certain political and Executive Schedule appointments. Matching contributions and your own money are yours from the start. The forfeiture does not apply if you die while still employed.' },
    { q: 'What do I lose by putting 3 % instead of 5 % into the TSP?', a: `On ${K.usd(sal)} of basic pay, ${K.usd(at(3).miss)} of matching a year. At 3 % the agency adds ${K.usd(at(3).m.agency)}; at 5 % it adds ${K.usd(at(5).m.agency)}. The extra 2 % costs you ${K.usd(at(5).m.employee - at(3).m.employee)} before tax and brings half as much again from the agency, every year, plus whatever that money earns until you retire.` },
    { q: 'What is the TSP catch-up limit for ages 60 to 63 in 2026?', a: `${K.usd(T.catchUp60to63)}, instead of the ${K.usd(T.catchUp50)} that applies from age 50. Added to the ${K.usd(T.deferral)} elective deferral limit, a participant aged 60, 61, 62 or 63 can put in up to ${K.usd(l61.total)} in ${K.P.year}. At 64 the regular catch-up applies again, for a total of ${K.usd(l64.total)}.` },
    { q: 'Do I lose matching if I reach the TSP limit before December?', a: `You can. The match is computed on what you contribute in each pay period. If a high percentage takes you to ${K.usd(T.deferral)} by October, payroll stops your contributions and there is nothing to match in the last pay periods. Spreading your contributions so that at least 5 % goes in every pay period keeps the full match all year.` },
  ],
  body: (h) => `
<h2>The two layers of agency money</h2>
<p>${h.src('usc_8432', '5 U.S.C. 8432')} sets both. The automatic contribution is ${K.dec(auto, 0)} % of basic pay for each pay period, paid for every FERS employee whether or not you contribute. The matching contribution follows your own contribution: 100 % of what you put in up to 3 % of basic pay, then 50 % of what you put in between 3 % and 5 %. Contributions above 5 % of pay are not matched. Basic pay here is the same pay used for your FERS annuity: your rate including locality pay, without overtime or awards.</p>
<p>Each layer is computed pay period by pay period, so it is the percentage of each paycheck that counts, not your yearly total. The table shows the result on a basic pay of ${K.usd(sal)}.</p>
${h.table(['You contribute', 'Your money', 'Automatic', 'Match', 'Agency total', 'Match missed'], rows.map(({ p, m, miss }) => [`${p} %`, K.usd(m.employee), K.usd(m.auto), K.usd(m.match), K.usd(m.agency), miss > 0 ? K.usd(miss) : 'none']), `Yearly amounts on ${K.usd(sal)} of basic pay, ${K.P.year}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The jump is steep at the bottom. Going from 0 % to 1 % brings ${K.usd(at(1).m.match)} of match for ${K.usd(at(1).m.employee)} of your money; going from 3 % to 5 % brings ${K.usd(at(5).m.match - at(3).m.match)} more for ${K.usd(at(5).m.employee - at(3).m.employee)}. Every dollar up to 5 % earns at least 50 cents of agency money before any investment return, which no fund can promise.</p>
<h2>An example on a GS salary</h2>
<p>A GS-12 step 5 in Washington-Baltimore earns ${K.usd(gs)} in ${K.P.year}. At 5 % the employee puts in ${K.usd(gsFull.employee)} a year and the agency adds ${K.usd(gsFull.agency)}, about ${K.usd(gsFull.agency / 26)} per biweekly paycheck. At 2 % the agency adds only ${K.usd(gs2.agency)}, so the employee gives up ${K.usd(K.missed(gs, 2))} a year. A step increase or a promotion raises the match automatically, because the percentages apply to the new basic pay.</p>
${h.mini('tsp', { t: 'How much match are you missing?', p: ['sal', 'c'], d: { sal: gs, c: 2, age: 40 } })}
<h2>What the gap adds up to over a career</h2>
<p>A missed match is small on one paycheck and large over a working life. Leaving ${K.usd(K.missed(gs, 2))} a year unclaimed for 20 years is ${K.usd(K.missed(gs, 2) * 20)} of agency money never deposited, before counting a single dollar of investment growth on it, and the figure rises with every raise because the match is a percentage of pay. An employee who contributes nothing still receives the automatic ${K.dec(auto, 0)} %, ${K.usd(K.match(gs, 0).auto)} a year at this salary, but nothing more. The cost of the full match, on the other hand, is lower than it looks on the leave and earnings statement: traditional contributions come out before federal income tax, so 5 % of pay reduces take-home pay by less than 5 %.</p>
<h2>The ${K.P.year} contribution limits</h2>
<p>The IRS caps what you contribute yourself at ${K.usd(T.deferral)} for ${K.P.year} (${h.src('irs_limits_2026', 'IRS, IR-2025-111')}). From the year you turn 50 you may add a catch-up of ${K.usd(T.catchUp50)}. For ages 60, 61, 62 and 63 the catch-up is higher, ${K.usd(T.catchUp60to63)}. Agency contributions sit outside these limits.</p>
${h.table(['Age in 2026', 'Elective deferral', 'Catch-up', 'Your maximum'], [['Under 50', l45], ['50 to 59', l55], ['60 to 63', l61], ['64 and over', l64]].map(([k, l]) => { const x = l as typeof l45; return [k as string, K.usd(x.base), x.catchUp ? K.usd(x.catchUp) : 'none', K.usd(x.total)]; }), `Employee contribution limits for ${K.P.year}, IRS.`, ['l', 'r', 'r', 'r'])}
<p>Hitting the limit too early has a cost. If you contribute a large share of each paycheck, you can reach ${K.usd(T.deferral)} before the last pay periods of the year; your contributions then stop, and the match stops with them because there is nothing left to match. Dividing the limit by the number of paychecks you still have, and keeping at least 5 % of pay in every one, avoids that.</p>
<h2>Vesting and leaving federal service</h2>
<p>Your own contributions and the matching money are yours immediately. The automatic ${K.dec(auto, 0)} % is not, for most employees, until you complete 3 years of civilian service; leave before that and it is forfeited with its earnings. A few political and Executive Schedule appointments vest after 2 years. An employee who dies in service keeps it for the beneficiaries.</p>
<h2>Where the TSP fits in FERS</h2>
<p>FERS has three parts: the basic annuity, Social Security and the TSP. The annuity replaces about 1 % of your high-3 per year of service, so 30 years gives about 30 %. The TSP is what fills the rest, and the full match is the cheapest part of it. The employee contribution to the annuity itself is a separate deduction, set by your hiring date: see ${h.a('fers-contribution-rates', 'FERS contribution rates')}. To see what the annuity alone will pay, use the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')}, and the ${h.a('high-3-salary', 'high-3 page')} explains the salary it is based on. If you plan to leave before 62, the ${h.a('fers-supplement', 'FERS supplement')} covers part of the gap until Social Security, and TSP savings usually cover the rest.</p>
`,
  related: ['fers-contribution-rates', 'fers-retirement-calculator', 'high-3-salary', 'fers-supplement', 'fers-early-retirement'],
  sources: ['usc_8432', 'irs_limits_2026'],
});
