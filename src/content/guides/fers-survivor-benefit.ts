import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.fers.survivor;
const p0 = (x: number) => `${K.dec(x * 100, 0)} %`;
const ann = 3200; // example unreduced monthly annuity
const fullCost = ann * S.fullCost, fullBen = ann * S.fullBenefit;
const partCost = ann * S.partialCost, partBen = ann * S.partialBenefit;
const ratio = S.fullCost / S.fullBenefit; // survivor years needed per year of cost
const ratioP = S.partialCost / S.partialBenefit;
const r20 = 20 * ratio, r25 = 25 * ratio;
// An MRA+10 case: born 1968, 16 years, $90,000 high-3, started at the MRA with the full benefit
const m = K.fers({ birthYear: 1968, retireAgeMonths: K.mra(1968), serviceMonths: 16 * 12, high3: 90000, survivor: 'full' });
const mBase = m.gross - m.reduction;
// An immediate case: born 1970, MRA with 30 years, $110,000 high-3
const i = K.fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 110000, survivor: 'full' });

export default defineGuide({
  id: 'fers-survivor-benefit', group: 'fers', order: 8, slug: 'fers-survivor-benefit',
  nav: 'Survivor benefit', card: `Full: your spouse gets ${p0(S.fullBenefit)} for a ${p0(S.fullCost)} cut. Partial: ${p0(S.partialBenefit)} for ${p0(S.partialCost)}. Spouse consent and break-even.`,
  title: 'FERS Survivor Benefit 2026: Full or Partial, Cost and Value',
  description: `FERS survivor benefit 2026: full ${p0(S.fullBenefit)} costs ${p0(S.fullCost)} of your annuity, partial ${p0(S.partialBenefit)} costs ${p0(S.partialCost)}; spouse consent, break-even years, remarriage and health coverage.`,
  h1: 'FERS survivor benefit in 2026: what each election costs and pays',
  intro: 'At retirement a married FERS employee chooses how much of the annuity continues to the spouse. Enter your unreduced annuity and an election to see the cost and what your survivor would receive.',
  resume: `When you retire under FERS while married, your annuity is reduced to provide a survivor annuity unless your spouse agrees otherwise. The full survivor benefit pays your spouse ${p0(S.fullBenefit)} of your annuity for life after your death and costs ${p0(S.fullCost)} of your annuity. The partial benefit pays ${p0(S.partialBenefit)} and costs ${p0(S.partialCost)}. On a ${K.usd(ann)} monthly annuity, the full election costs ${K.usd(fullCost)} a month and would pay your spouse ${K.usd(fullBen)} a month; the partial one costs ${K.usd(partCost)} and pays ${K.usd(partBen)}. Your spouse must consent to a partial benefit or to none. Both options have the same ratio: each year your survivor collects repays ${K.dec(1 / ratio, 0)} years of cost, so after 25 years of retirement the election has paid for itself once the survivor has drawn ${K.dec(r25, 0)} years. The reduction stops if your spouse dies first or the marriage ends. A survivor who remarries before 55 loses the annuity unless the marriage lasted 30 years.`,
  tool: 'survivor',
  toolArg: { ann, sv: 'full', yrs: 8 },
  faqs: [
    { q: 'How much does the FERS survivor benefit cost?', a: `The full survivor benefit costs ${p0(S.fullCost)} of your annuity, for as long as you are married and receive it. The partial benefit costs ${p0(S.partialCost)}. Both are taken from the annuity after any age reduction. On a ${K.usd(ann)} monthly annuity, that is ${K.usd(fullCost)} or ${K.usd(partCost)} a month. The cost does not depend on your spouse's age or health.` },
    { q: 'Can I waive the FERS survivor annuity without my spouse?', a: 'No. If you are married when you retire, OPM requires your spouse to consent to an election of a partial survivor benefit or of no survivor benefit. Without that consent, OPM applies the full survivor benefit. The consent is part of the retirement application, and the rules for where and how it is signed are set by OPM.' },
    { q: 'What happens to the survivor reduction if my spouse dies first?', a: 'The reduction ends. Under 5 U.S.C. 8419, it stops for each full month after the death of the spouse or after the marriage is dissolved, and OPM restores the annuity to its unreduced amount. The exception is a court order requiring a survivor annuity for a former spouse: in that case a reduction continues for that former spouse.' },
    { q: 'Does my spouse keep FEHB if I choose no survivor benefit?', a: 'In most cases, no. OPM says a surviving spouse can continue health coverage after your death only if a monthly survivor annuity or the basic employee death benefit is payable, you had a Self and Family or Self Plus One enrollment and the spouse was covered under it. Electing no survivor annuity at retirement can therefore end the health coverage of your spouse when you die.' },
    { q: 'Is the partial FERS survivor benefit a better deal than the full one?', a: `On paper they are priced the same: the partial benefit costs ${p0(S.partialCost)} for ${p0(S.partialBenefit)}, the full one ${p0(S.fullCost)} for ${p0(S.fullBenefit)}, so each survivor year repays ${K.dec(1 / ratioP, 0)} years of cost in both cases. The full election protects more income, and the partial one still keeps the survivor annuity that health coverage after your death requires.` },
  ],
  body: (h) => `
<h2>The three choices at retirement</h2>
<p>The election is made once, on your retirement application, and it shapes your income and your spouse's for decades. ${h.src('opm_survivor_benefits', "OPM's survivor benefits page")} sets out the options for FERS. The maximum survivor annuity pays your spouse ${p0(S.fullBenefit)} of your annuity and reduces your own by ${p0(S.fullCost)}. The partial survivor annuity pays ${p0(S.partialBenefit)} and reduces yours by ${p0(S.partialCost)}. With no survivor annuity, nothing is taken from your payments and nothing continues after your death. If you are married at retirement, your spouse must consent to the partial benefit or to none; otherwise the full one applies.</p>
${h.table(['Election', 'Your annuity is cut by', `On ${K.usd(ann)}/mo`, 'Spouse receives', `On ${K.usd(ann)}/mo`], [
  ['Full', p0(S.fullCost), `-${K.usd(fullCost)}`, p0(S.fullBenefit), K.usd(fullBen)],
  ['Partial', p0(S.partialCost), `-${K.usd(partCost)}`, p0(S.partialBenefit), K.usd(partBen)],
  ['None (spouse consent)', '0 %', K.usd(0), '0 %', K.usd(0)],
], 'FERS survivor elections for a current spouse.', ['l', 'r', 'r', 'r', 'r'])}
<h2>How OPM applies the cost</h2>
<p>The reduction is set by ${h.src('usc_8419', '5 U.S.C. 8419')}: ${p0(S.fullCost)} for a full survivor annuity and a smaller share, ${p0(S.partialCost)}, for a partial one. In the computation, OPM applies it after the age reduction of an MRA+10 or early deferred annuity, and the ${h.src('opm_handbook_50', 'handbook worksheets')} use the annuity after that age reduction as the base for the survivor. In practice, a retiree born in 1968 who leaves at the MRA with 16 years and a ${K.usd(90000)} high-3 has an unreduced annuity of ${K.usd(m.gross)}, ${K.usd(mBase)} after the age cut. The full survivor cost is ${K.usd(m.survivorCut)} a year, and the survivor annuity is ${p0(S.fullBenefit)} of ${K.usd(mBase)}, about ${K.usd(mBase * S.fullBenefit / 12)} a month. For an immediate unreduced annuity there is no age cut: with 30 years and a ${K.usd(110000)} high-3, the annuity of ${K.usd(i.gross)} becomes ${K.usd(i.net)}, and the survivor would receive ${K.usd(Math.floor(i.survivorAnnuity / 12))} a month. The handbook adds that the survivor annuity includes the COLAs the retiree received before death.</p>
${h.mini('survivor', { t: 'Cost and value of your election', p: ['ann', 'sv'], d: { ann: 2800, sv: 'partial' } })}
<h2>The break-even in years</h2>
<p>Both options are priced the same way: the yearly cost is ${K.dec(ratio * 100, 0)} % of the yearly survivor benefit. Each year your survivor collects therefore repays ${K.dec(1 / ratio, 0)} years of reduction. If you draw your annuity for 20 years, the election pays for itself once your spouse has drawn ${K.dec(r20, 0)} years; after 25 years of retirement, ${K.dec(r25, 0)} years. COLAs raise both the cost and the benefit in the same proportion and do not change this ratio. The comparison leaves out what matters most to many couples: the survivor annuity is the income that keeps paying when your own stops, and it carries health coverage with it.</p>
<h2>Health coverage after your death</h2>
<p>OPM's rule is direct: a surviving spouse can keep health benefits only if a monthly survivor annuity, or the basic employee death benefit, is payable, if your enrollment was Self and Family or Self Plus One on the date of death, and if the spouse was covered under it. The premiums are then taken from the survivor annuity. A couple who waive the survivor annuity to keep ${K.usd(fullCost)} a month may also be giving up the spouse's health plan. The partial election keeps that link at half the cost of the full one.</p>
<h2>When the reduction stops</h2>
<p>Under section 8419, if your spouse dies before you, or the marriage ends in divorce, the reduction ends for each full month after that event, and your annuity is restored to the unreduced amount. The exception is a court order that awards a survivor annuity to a former spouse: the reduction continues for that benefit. A former spouse can receive a survivor annuity only if a qualifying court order expressly awards it and the marriage lasted at least 9 months in total.</p>
<h2>Remarriage of the survivor</h2>
<p>A spouse's survivor annuity ends at remarriage before age 55, unless the survivor was married to you for at least 30 years. Remarriage at 55 or later does not affect it. If a surviving spouse's annuity stopped because of a remarriage before 55 and that marriage later ends by death, annulment or divorce, it can be restored once any lump sum paid at termination is repaid.</p>
<h2>How to decide</h2>
<p>Three questions settle most cases: would your spouse need the income if you died first, does your spouse have a pension and health coverage of their own, and how large is the gap in your ages. Life insurance can replace part of a survivor annuity, but it does not keep a spouse in FEHB. Run your own figures in the calculator above and in the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')}, which applies the cost after every other reduction. The ${h.a('opm-retirement-calculator', 'OPM computation page')} shows where the survivor reduction falls in the order, and our ${h.a('method', 'method page')} lists the rules used.</p>
`,
  related: ['fers-retirement-calculator', 'opm-retirement-calculator', 'fers-cola', 'high-3-salary', 'fers-mra-10'],
  sources: ['opm_survivor_benefits', 'usc_8419', 'opm_handbook_50', 'opm_fers_computation'],
});
