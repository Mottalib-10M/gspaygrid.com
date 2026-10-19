/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md):
 *  - a topic page with its calculator: `src/content/guides/<id>.ts` (GuideDef);
 *  - a grade page: `src/content/grades/gs-<n>.ts` (GradeDef);
 *  - a locality page: `src/content/areas/<area-slug>.ts` (AreaDef, the slug is that of data/gs-2026.json).
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }
export interface MiniOpts { /** title */ t?: string; /** ids of the fields shown */ p?: string[]; /** default values */ d?: Record<string, number | string>; /** link text */ c?: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("fers-supplement", "gs-13", "area:washington-dc", "method"). Unknown id = failed test. */
  a: (id: string, text: string) => string;
  /** Table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL already read. */
  ext: (url: string, text: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator built on a calculator of tool-specs.ts: `${h.mini('wgi', { t, p: ['step'], d: { grade: 9 } })}`. */
  mini: (kind: string, opts?: MiniOpts) => string;
}

export type Group = 'pay' | 'career' | 'fers' | 'more';

export interface GuideDef {
  id: string; group: Group; order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string; card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string; intro: string;
  /** ONE paragraph of 120 words or more: the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** Calculator at the top: a key of tool-specs.ts. */
  tool: string;
  /** Default values of that calculator for this page. */
  toolArg?: Record<string, number | string>;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const defineGuide = (p: GuideDef): GuideDef => p;

/** A grade page (GS-1 to GS-15): the file name is gs-<n>.ts. */
export interface GradeDef {
  grade: number;
  title: string; description: string; intro: string; resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  related: string[];
}
export const defineGrade = (g: GradeDef): GradeDef => g;

/** A locality pay area page: the file name is the area slug of gs-2026.json ("washington-dc"). */
export interface AreaDef {
  slug: string;
  /** Worksite preset in the calculator: [state, county as listed by OPM]. Default: the first county of the area. */
  where?: [string, string];
  title: string; description: string; intro: string; resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  related: string[];
}
export const defineArea = (a: AreaDef): AreaDef => a;
