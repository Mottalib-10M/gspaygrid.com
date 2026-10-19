import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 15;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), sf1 = K.pay(g, 1, 'SF');
const capped = (code: string) => K.table(code)[14].filter((x) => x >= K.CAP).length;
const hit = K.AREAS.map((a) => ({ a, n: capped(a.code) })).filter((x) => x.n > 0).sort((x, y) => y.n - x.n || x.a.short.localeCompare(y.a.short));
const free = K.AREAS.length - hit.length;
const nyN = capped('NY'), dcN = capped('DCB'), sfN = capped('SF');
const sfRaw = Math.round(K.pay(g, 10, 'SF').base * (1 + K.area('SF').pct / 100));
const squeeze = K.promote(14, 9, 15, 'SF');
const fair = K.promote(14, 6, 15, 'DCB');
const pen = K.fers({ birthYear: 1966, retireAgeMonths: 62 * 12, serviceMonths: 28 * 12, high3: K.CAP });

export default defineGrade({
  grade: g,
  title: 'GS-15 Pay Scale 2026: Salary, Pay Cap and Compression',
  description: `GS-15 pay 2026: ${K.usd(rus1.annual)} to ${K.usd(rus10.annual)} in Rest of U.S. Top steps held at the ${K.usd(K.CAP)} cap in ${hit.length} areas, the count of capped cells per area and pay compression.`,
  intro: 'The top grade of the General Schedule, where locality pay runs into the Executive Schedule ceiling. Choose your county to see whether your step is capped.',
  resume: `GS-15 is the highest General Schedule grade, held by senior managers, division directors and top technical experts. In ${K.P.year} the base rate runs from ${K.usd(rus1.base)} at step 1 to ${K.usd(rus10.base)} at step 10, and locality pay brings step 1 to ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(dc1.annual)} in the Washington area and ${K.usd(sf1.annual)} in ${K.area('SF').short}. Step 10 in Rest of U.S. pays ${K.usd(rus10.annual)}. No GS rate can exceed the rate of Executive Schedule level IV, ${K.usd(K.CAP)} in ${K.P.year}, and at GS-15 that cap is real: it holds down at least one step in ${hit.length} of the ${K.AREAS.length} locality areas. In ${K.area('SF').short}, ${sfN} of the 10 steps are paid exactly ${K.usd(K.CAP)}; in New York, ${nyN}; in Washington, ${dcN}. Only ${free} areas, Rest of U.S. among them, pay every GS-15 step in full. The result is pay compression: in those capped cells, step increases, promotions into the grade and the annual raise stop adding money.`,
  body: (h) => `
<h2>Capped cells, area by area</h2>
<p>The cap is set by law as the rate of level IV of the Executive Schedule. It does not touch the base table; it trims the locality rate. Here are the areas where GS-15 runs into it in ${K.P.year}, ranked by the number of steps paid at ${K.usd(K.CAP)}.</p>
${h.table(['Locality area', 'Locality %', 'Steps at the cap', 'First capped step'], hit.slice(0, 12).map((x) => [x.a.short, `${K.dec(x.a.pct, 2)} %`, String(x.n), `Step ${11 - x.n}`]), `GS-15, ${K.P.year}: the 12 areas with the most capped steps, out of ${hit.length}.`, ['l', 'r', 'r', 'r'])}
<p>In ${K.area('SF').short} the uncapped step 10 rate would be ${K.usd(sfRaw)}, or ${K.usd(sfRaw - K.CAP)} above what you are paid. Every area with a locality percentage close to that level stops several steps short of step 10. The ${h.a('gs-pay-cap', 'pay cap page')} lists every capped cell at every grade.</p>
${h.mini('cap', { t: 'Check your GS-15 step against the cap', p: ['s', 'a'], d: { g: '15', s: '10', a: 'NY' } })}
<h2>What compression does to a career</h2>
<p>Once you are at the cap, three things you would normally count on are worth nothing in pay. A within-grade increase moves you to a higher step at the same ${K.usd(K.CAP)}. An across-the-board raise lifts the base table, but the locality rate stays at the cap unless the Executive Schedule rate itself rises. And a promotion can be empty: a GS-14 step 9 in ${K.area('SF').short} is already paid ${K.usd(squeeze.from.annual)}, and promotion to GS-15 step ${squeeze.to.step} pays ${K.usd(squeeze.to.annual)}, a raise of ${K.usd(squeeze.raise)}. In Washington, where fewer steps are capped, the same move from GS-14 step 6 still pays ${K.usd(fair.raise)} more, landing at GS-15 step ${fair.to.step}.</p>
<p>Compression also flattens differences between people: a new GS-15 and a 20-year GS-15 can show the same salary on their leave and earnings statements.</p>
<h2>Retiring from GS-15</h2>
<p>A capped salary also caps the high-3, since FERS uses basic pay with locality. An employee born in 1966 who retires at 62 with 28 years and three years at ${K.usd(K.CAP)} receives 1.1 % per year of service: about ${K.usd(pen.gross)} a year, ${K.usd(Math.floor(pen.gross / 12))} a month, before any survivor election. The ${h.a('high-3-salary', 'high-3 guide')} shows how a capped final year compares with earlier ones.</p>
<h2>Above GS-15</h2>
<p>The General Schedule ends here. The next level for a manager is the Senior Executive Service, and for some scientists and experts the senior-level and scientific or professional systems. Those are separate pay systems with their own rules and are not covered on this site. The time-in-grade rule for a GS-14 moving to GS-15, 52 weeks, applies until January 18, 2027; ${h.src('fr_tig_2026', 'OPM\'s final rule')} removes it from January 19, 2027.</p>
`,
  faqs: [
    { q: 'What is the maximum GS-15 salary in 2026?', a: `${K.usd(K.CAP)}, the rate of Executive Schedule level IV. Locality pay cannot take any GS rate above it. In Rest of U.S. GS-15 step 10 pays ${K.usd(rus10.annual)}, below the cap, but in ${hit.length} locality areas at least one GS-15 step is held at ${K.usd(K.CAP)}, and in ${K.area('SF').short} ${sfN} of the 10 steps are.` },
    { q: 'What is pay compression for GS-15 employees?', a: 'It is what happens when the pay cap holds several steps at the same rate. A GS-15 at a capped step gains nothing from a step increase, from the yearly raise of the base table, or sometimes from a promotion into GS-15, until the Executive Schedule level IV rate itself goes up. Senior and junior employees then earn the same salary.' },
    { q: 'Which locality areas cap GS-15 step 10?', a: `In ${K.P.year}, ${hit.length} of the ${K.AREAS.length} areas hold GS-15 step 10 at ${K.usd(K.CAP)}, from ${K.area('SF').short} with ${sfN} capped steps and New York with ${nyN} to areas where only step 10 is affected. The ${free} areas with the lowest locality percentages, Rest of U.S. among them, pay all ten steps in full. Your area follows your official worksite.` },
    { q: 'What comes after GS-15 in federal service?', a: 'For managers, the Senior Executive Service, which has its own pay system. For scientists and other experts, senior-level and scientific or professional positions. Moving into either is a competitive selection, not a promotion within the General Schedule, and the GS steps and locality tables no longer apply once you are appointed.' },
  ],
  related: ['gs-14', 'gs-pay-cap', 'high-3-salary', 'locality-pay', 'area:san-francisco', 'area:new-york'],
});
