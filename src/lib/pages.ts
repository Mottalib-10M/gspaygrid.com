/** Registry: every file of src/content/{guides,grades,areas} is loaded here. */
import type { GuideDef, GradeDef, AreaDef } from './page-types';
import { areaBySlug } from './engine/gs';

const base = (file: string) => file.split('/').pop()!.replace(/\.ts$/, '');
const g = import.meta.glob<{ default: GuideDef }>(['../content/guides/*.ts', '!../content/guides/_*.ts'], { eager: true });
export const GUIDES: GuideDef[] = Object.entries(g).map(([f, m]) => {
  if (m.default.id !== base(f)) throw new Error(`${f}: id "${m.default.id}" differs from the file name`);
  return m.default;
}).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const guideById = (id: string) => GUIDES.find((p) => p.id === id);

const gr = import.meta.glob<{ default: GradeDef }>(['../content/grades/*.ts', '!../content/grades/_*.ts'], { eager: true });
export const GRADE_PAGES: GradeDef[] = Object.entries(gr).map(([f, m]) => {
  if (`gs-${m.default.grade}` !== base(f)) throw new Error(`${f}: grade ${m.default.grade} differs from the file name`);
  return m.default;
}).sort((a, b) => a.grade - b.grade);
export const gradeId = (n: number) => `gs-${n}`;
export const gradePageById = (id: string) => GRADE_PAGES.find((p) => gradeId(p.grade) === id);

const ar = import.meta.glob<{ default: AreaDef }>(['../content/areas/*.ts', '!../content/areas/_*.ts'], { eager: true });
export const AREA_PAGES: AreaDef[] = Object.entries(ar).map(([f, m]) => {
  if (m.default.slug !== base(f)) throw new Error(`${f}: slug "${m.default.slug}" differs from the file name`);
  if (!areaBySlug(m.default.slug)) throw new Error(`${f}: unknown locality area`);
  return m.default;
}).sort((a, b) => a.slug.localeCompare(b.slug));
export const areaId = (slug: string) => `area:${slug}`;
export const areaPageById = (id: string) => AREA_PAGES.find((p) => areaId(p.slug) === id);
/** First guide that carries a calculator: the target of a mini-simulator's link. */
export const pageOfTool = (kind: string) => GUIDES.find((p) => p.tool === kind)?.id;
