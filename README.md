# ARGUS

**Aggregate Ranking for General University Standing**

ARGUS is a personalized ranking of U.S. universities built around undergraduate career outcomes, prestige, student experience, and the learning environment. It is a general institutional ranking, not a CS/STEM, selectivity, or research ranking.

The preferences are subjective; the school inputs are not manually assigned from impressions. Category choices and weights express those preferences, while scores come from published school-level data and deterministic transformations.

## Project status

The ranking workbooks, data collection, and validation experiments currently exist outside this repository. This repository is the public project home; it does not yet include those files or a runnable application. The methodology below describes the current ranking, not a claim that its implementation is already published here.

## Methodology

| Category | Overall weight | Components and weights within the category |
| --- | ---: | --- |
| Career Outcomes & Career Power | 35% | College Scorecard earnings 31.25%; PayScale bachelor's-only mid-career pay 25%; WSJ Salary Impact 25%; WSJ Preparation for Career 18.75% |
| Prestige & Recognition | 20% | Historical U.S. News National Universities ranks 100% |
| Student Experience & Environment | 35% | Princeton Review Quality of Life rating 56.25%; WSJ Recommendation Score 43.75% |
| Learning Environment | 10% | WSJ Learning Opportunities 60%; WSJ Learning Facilities 40% |

```text
ARGUS score = 0.35 × Career
            + 0.20 × Prestige
            + 0.35 × Experience
            + 0.10 × Learning
```

### Career outcomes

Earnings measures are institution-level and consistent across schools within each source. PayScale uses bachelor's-only mid-career pay, not all-alumni pay, early-career pay, or return on investment.

Both earnings measures use a fixed logarithmic transformation:

```text
earnings score = clamp(50 + 40 × log2(earnings / benchmark), 0, 100)
```

Earnings and benchmarks are converted to a common dollar year. The frozen benchmarks are $82,056 in 2025 dollars for Scorecard and $87,000 in 2024 dollars for PayScale. These benchmarks are not derived from the candidate list. Adding a school does not change another school's earnings score.

Missing-component redistribution is allowed only within Career, with these minimum requirements:

- If both WSJ career scores are available, at least one of Scorecard or PayScale must also be available.
- Otherwise, both Scorecard and PayScale must be available.

Available components retain their original relative weights, rescaled to total 100% within Career. Adjusted outcomes and data coverage are identified separately.

### Prestige

Three U.S. News National Universities editions are combined: current edition 60%, previous edition 25%, and two editions ago 15%. Each rank is converted before averaging.

The current, steeper prestige curve uses these anchors:

| U.S. News rank | Prestige score |
| ---: | ---: |
| 1 | 100 |
| 5 | 96 |
| 10 | 92 |
| 20 | 84 |
| 30 | 76 |
| 40 | 70 |
| 50 | 64 |
| 75 | 52 |
| 100 | 40 |

Scores are linearly interpolated between anchors. Beyond rank 100, the score falls by 0.48 points per rank and is floored at zero. This is an ARGUS preference curve, not a published U.S. News score.

### Experience and learning

Princeton Review uses its numerical **Quality of Life rating**, not a position on a ranked list. The remaining inputs use the specified published WSJ scores.

No missing-input redistribution is allowed in Prestige, Experience, or Learning. A tested Niche-to-Princeton Review fallback was rejected and is not active.

Institutional access, QS, THE, and PSEO do not contribute to the current ranking.

## Eligibility and interpretation

The live ranking covers U.S. News **National Universities**. A school must have the required scope confirmation, all three prestige inputs, both experience inputs, both learning inputs, and sufficient career inputs under the rule above.

Unavailable required data produces **NR (not ranked)**, not an estimated score, a zero, or an average. NR is a data or eligibility status, not a judgment of school quality. Coverage and missing reasons are reported separately.

Schools are sorted by their unrounded scores. Schools within 0.50 points may share a competition rank, but every school in the tie group must be within 0.50 points of its highest-scoring member. Ties cannot chain together. Score bands are more meaningful than tiny position differences.

Individual scores use fixed transformations rather than candidate-relative scaling. Positions still depend on which schools are included.

Acceptance rates, incoming SAT/GPA, research spending, endowment, rigor, sports, weather, and similar attributes are not separate ARGUS scoring inputs. Underlying publisher metrics may reflect their own criteria. Institutional earnings are not causal estimates of a university's contribution or promises of an individual student's salary.

## Validation experiments

Regional-to-National prestige conversion and public-data approximations of the U.S. News methodology are separate experiments. They have not been adopted into the live ranking. Strong correlation alone is insufficient: individual prediction errors and out-of-sample performance also matter.

Regional institutions are not assigned fictional National ranks. Any future conversion must validate before changing scope or scoring.

## License and attribution

Repository material is licensed under the [MIT License](LICENSE). Third-party rankings, ratings, and datasets retain their respective rights and terms. ARGUS is independent and is not affiliated with or endorsed by the data publishers.
