# Writing a page

One page = one TypeScript file. Routes, menus, footer, sitemap, schemas, llms.txt and internal links
read these files alone.

| Kind | File | Model |
|---|---|---|
| Topic page with its calculator | `src/content/guides/<id>.ts` (`defineGuide`) | `guides/fers-supplement.ts` |
| Grade page | `src/content/grades/gs-<n>.ts` (`defineGrade`) | `grades/gs-12.ts` |
| Locality area page | `src/content/areas/<slug>.ts` (`defineArea`, slug of `src/data/gs-2026.json`) | `areas/washington-dc.ts` |

The list of planned ids is `src/lib/planned.ts`. Fields are documented in `src/lib/page-types.ts`.
Calculators (and the fields of each mini-simulator) are in `src/lib/tool-specs.ts`.

## Figures

- Never type a figure that the data holds: use the kit `K` (`src/lib/kit.ts`): `K.pay(g, s, code)`,
  `K.area('DCB').pct`, `K.CAP`, `K.RAISE`, `K.P.fers…`, `K.P.ssa…`, `K.promote(…)`, `K.fers({…})`,
  `K.supplement(…)`, `K.usd`, `K.usd2`, `K.pct(0.054, 1)`, `K.dec(x, 2)`, `K.day(iso)`.
  Write `${K.dec(a.pct, 2)} %` for a locality percentage.
- Example inputs you choose (a 30-year career, a $1,900 SSA estimate) can be typed.
- 2027: nothing is official. The President's plan (August 26, 2026) proposes 0 % and no locality
  change; the House FSGG bill (H.R. 8495) carries no raise; tables expected `K.P.pay.y2027.tablesExpected`.
  Always "proposal" or "scenario", never a projection presented as fact.
- A fact not in this file and not in `params-2026.json` is not published unless you read it on an
  official page (opm.gov, ecfr.gov, law.cornell.edu for the U.S. Code, federalregister.gov, govinfo.gov,
  irs.gov, tsp.gov, ssa.gov). If you add a source, add it to `params-2026.json > sources` and list
  its key in `sources`. If unsure, leave the sentence out.

## Rules checked by `tests/pages.test.ts`

- `title` 50 to 60 characters, key term first, contains 2026; never starts with a question word,
  "Calculator", "US", "United States" or "American". Unique.
- `description` 150 to 160 characters with 2026. Unique.
- `resume`: ONE paragraph of 120 words or more that answers the query with the figures.
- body: guides at least 650 words of prose (tables apart), grades and areas at least 300. Each body
  has at least one `${h.mini(kind, { t, p, d })}`.
- FAQ: 3 to 5 questions (up to 8 for a long guide), answers 40 to 90 words, every question unique on the
  whole site (home included). Questions are the ones people type.
- No em dash or en dash, no "Moreover", "Additionally", "Furthermore", "delve", "dive into",
  "navigate the", "whether you're", "unlock", "guaranteed", "it's important to note".
- No `undefined`, `NaN` or `null` in the output.
- Links: `${h.a('page-id', 'text')}`, ids from `planned.ts` (`gs-12`, `area:washington-dc`, `method`).
  Sources: `${h.src('key', 'text')}`.

Similarity between two pages must stay under 30 % (`python3 scripts/sim-pages.py` after the test).
Grade and area pages share a template: write what is specific to that grade or that area (who holds it,
which careers pass through it, special rates, cap, counties, nearby areas, local employers by type),
not the same paragraphs with other numbers.

Test one file: `PAGE_FILES=gs-9,area:boston npx vitest run tests/pages.test.ts`.

## Voice

Plain American English, second person, short sentences, facts first. Independent site: never "we at
OPM", never imply that the site is an agency. General information, not personal advice; the official
figures are the SF-50, the leave and earnings statement and OPM Retirement Services. No call to book,
no email capture. Never name or link bridgeto59.com, socialsecurityage.com, truetakehomepay.com.

## Verified facts (read on the official sources, 2026-10-19)

Pay
- 2026: EO 14368 of Dec 18, 2025 (published Dec 23), effective first pay period on or after Jan 1,
  2026 (Jan 11, 2026). Base table +1.0 %, every locality percentage frozen at its 2025 level
  (17.06 % Rest of U.S. to 46.34 % San Francisco). OPM memo CPM 2025-18. 58 areas (57 + Rest of U.S.).
  EO 14368 also let OPM raise certain civilian law enforcement personnel up to 3.8 % in total (1 %
  included), through special tables (keep it general; source `opm_leo_2026`).
- Locality rate = base × (1 + pct/100), rounded to the dollar, capped at Executive Schedule level IV:
  $197,200 in 2026 ($195,200 in 2025). Hourly = annual / 2,087, to the cent; biweekly = hourly × 80.
- Special rate table 001M lifts GS-1 to GS-4 (not GS-4 steps 6 to 10) nationwide where it is higher than
  the locality rate (`K.pay(...).usesSpecial`).
- Overtime (FLSA-exempt): 1.5 × hourly, but capped at 1.5 × GS-10 step 1 of the area when the hourly
  rate exceeds GS-10/1 (then the greater of the hourly rate and that cap).
- Worksite rule: the official worksite on the SF-50. A teleworker scheduled to report at least twice
  each biweekly pay period keeps the office; otherwise the telework site (home) is the worksite
  (5 CFR 531.605).
- 2027: plan letter Aug 26, 2026: 0 % raise, locality unchanged. Without a plan the law (FEPCA) would
  have given 3.1 % base plus an average locality of 20.6 %. House FSGG report H. Rept. 119-623
  (Apr 24, 2026): no raise provision. Final figures only with an executive order or a law.

Career
- Within-grade increases (5 CFR 531.405): 52 weeks for steps 2, 3, 4; 104 weeks for 5, 6, 7;
  156 weeks for 8, 9, 10; acceptable level of competence. 18 years from step 1 to 10.
  Quality step increase: one step, no change to the waiting period that follows.
- Promotion (5 CFR 531.214(d)(3)): GS base rate + two step increments of the grade you leave, apply
  your locality, lowest step of the new grade that equals or beats it. Waiting period restarts.
- Time-in-grade: 52 weeks at the next lower grade (two grades lower for GS-6 to GS-11 two-grade
  positions) before advancement to GS-6 or above, until January 18, 2027. OPM final rule of
  October 19, 2026 (source `fr_tig_2026`) eliminates it from January 19, 2027; qualification
  standards (one year of specialized experience at the next lower level) still apply.

FERS
- Eligibility (5 U.S.C. 8412): 62 with 5 years; 60 with 20; MRA with 30; MRA with 10 (MRA+10, reduced
  5 % a year, 5/12 % a month, under 62, no reduction if postponed to 62, or to 60 with 20 years).
  Deferred (separated with 5+ years): at 62, or at the MRA with 10+ years (reduced like MRA+10, waived
  at 60 with 20). Special provisions (LEO, firefighters, air traffic controllers): 50 with 20 or any
  age with 25; mandatory retirement ages apply.
- MRA: born before 1948: 55; 1948 to 1952: 55 + 2 months per year; 1953 to 1964: 56; 1965 to 1969:
  56 + 2 months per year; 1970 and later: 57 (`K.mra(birthYear)` in months).
- Multiplier: 1 %; 1.1 % if separated at 62 or older with 20 years or more. Special provisions: 1.7 %
  for the first 20 years, 1 % beyond.
- High-3: highest 3 consecutive years of basic pay including locality (no overtime, no bonuses).
- Sick leave: 100 % of unused sick leave adds to the computation (since 2014) of an immediate or MRA+10
  annuity, not to eligibility, not to a deferred annuity. 2,087 hours = 1 year; 174 hours ≈ 1 month.
- Survivor: full = 50 % of unreduced annuity, costs 10 %; partial = 25 %, costs 5 %; spouse consent
  needed to elect less than full.
- Supplement (8421): Social Security estimate at 62 × FERS civilian years (rounded) / 40, until 62.
  Immediate retirements under 8412(a), (b), (d), (e); early outs (8414(b)) once the MRA is reached.
  Not MRA+10, not deferred, not disability. Earnings test (8421a): above $24,480 in 2026, $1 withheld for
  every $2, based on the prior year's earnings; special-provision retirees are exempt until their MRA.
  No COLA. P.L. 119-21 (July 4, 2025) did not change FERS.
- COLA (8462, diet COLA): CPI up to 2 %: full; 2 to 3 %: 2 %; above 3 %: CPI minus 1 point. No COLA
  before 62 for regular retirees (disability and survivor annuities excepted); special-provision
  retirees get it at any age. 2026: SS 2.8 %, FERS 2.0 %. 2027: SS 3.6 % announced Oct 14, 2026, so FERS
  2.6 % (OPM letter not yet published).
- Employee contribution: 0.8 % (hired before 2013), 3.1 % (FERS-RAE, 2013), 4.4 % (FERS-FRAE, 2014 and
  later).
- SSA 2026: wage base $184,500 (2027: $192,300), bend points $1,286 and $7,749 (2027: $1,340 and $8,077).
- TSP 2026: automatic 1 %, match: 100 % of the first 3 %, 50 % of the next 2 % (5 % gets 5 %).
  Elective deferral limit $24,500, catch-up 50+ $8,000, ages 60 to 63 $11,250.
