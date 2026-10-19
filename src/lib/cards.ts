/** One-line description of any page id, for "keep going" cards and llms.txt. */
import { guideById, gradePageById, areaPageById } from './pages';
import { areaBySlug, pay, CAP } from './engine/gs';
import { formatDecimal, formatMoney } from './format';
export function cardOf(id: string): string {
  const g = guideById(id); if (g) return g.card;
  const gr = gradePageById(id); if (gr) return `${formatMoney(pay(gr.grade, 1, 'RUS').annual)} to ${formatMoney(Math.min(CAP, pay(gr.grade, 10, 'SF').annual))} in 2026, depending on step and locality.`;
  const a = areaPageById(id); if (a) { const x = areaBySlug(a.slug)!; return `${formatDecimal(x.pct, 2)} % locality pay; GS-12 step 1 at ${formatMoney(pay(12, 1, x.code).annual)}.`; }
  return '';
}
