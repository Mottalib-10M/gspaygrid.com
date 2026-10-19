/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  'gs-pay-scale-2026', 'federal-pay-raise-2026', 'federal-pay-raise-2027', 'locality-pay', 'gs-hourly-pay', 'gs-pay-cap', 'gs-special-rates',
  'gs-step-increase', 'gs-promotion-calculator',
  'fers-retirement-calculator', 'opm-retirement-calculator', 'fers-supplement', 'fers-supplement-earnings-test', 'fers-minimum-retirement-age', 'fers-mra-10',
  'high-3-salary', 'fers-survivor-benefit', 'fers-cola', 'sick-leave-retirement-credit', 'fers-early-retirement', 'fers-deferred-retirement',
  'fers-special-provisions', 'fers-retire-at-62',
  'tsp-matching', 'fers-contribution-rates',
];
export const PLANNED_GRADES = Array.from({ length: 15 }, (_, i) => i + 1);
export const PLANNED_AREAS = ['washington-dc', 'new-york', 'san-francisco', 'los-angeles', 'boston', 'chicago', 'seattle', 'denver', 'houston', 'dallas-fort-worth', 'atlanta', 'san-diego', 'philadelphia', 'rest-of-us', 'alaska', 'hawaii', 'huntsville', 'colorado-springs', 'san-antonio', 'virginia-beach', 'phoenix', 'miami'];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, ...PLANNED_GRADES.map((g) => `gs-${g}`), ...PLANNED_AREAS.map((s) => `area:${s}`)]);
