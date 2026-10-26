| Model | Level | Accuracy (system) | Action acc. | Model acc. on unsettled | Dangerous | Over-ask | Over-ask cut vs rules | Missed stops | JSON valid | p50 / p95 ms | $/call |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rules only | – | 59.8% | 59.8% | – | 0 (0%) | 68 (54%) | – | 7/18 | – | 0 | 0 |
| baseten/elephant-1:free [choice] | L1 | 74.6% | 77.2% | 55.9% | 22 (11.6%) | 4 (3.2%) | 94.1% | 4/18 | 100% | 390 / 449 | 0.000000 |
| baseten/elephant-1:free [choice] | L2 | 83.6% | 84.7% | 72.5% | 13 (6.9%) | 10 (7.9%) | 85.3% | 1/18 | 100% | 386 / 402 | 0.000000 |
| baseten/elephant-1:free [gates] | L1 | 57.7% | 72.5% | 24.5% | 26 (13.8%) | 10 (7.9%) | 85.3% | 4/18 | 100% | 397 / 476 | 0.000000 |
| baseten/elephant-1:free [gates] | L2 | 77.2% | 79.4% | 60.8% | 11 (5.8%) | 10 (7.9%) | 85.3% | 1/18 | 100% | 395 / 418 | 0.000000 |
| perplexity/pplx-decider-v1.2 [choice] | L1 | 67.7% | 71.4% | 43.1% | 23 (12.2%) | 19 (15.1%) | 72.1% | 2/18 | 100% | 607 / 868 | 0.000024 |
| perplexity/pplx-decider-v1.2 [choice] | L2 | 88.9% | 91% | 82.4% | 13 (6.9%) | 3 (2.4%) | 95.6% | 0/18 | 100% | 613 / 858 | 0.000025 |
| perplexity/pplx-decider-v1.2 [gates] | L1 | 62.4% | 76.7% | 33.3% | 29 (15.3%) | 2 (1.6%) | 97.1% | 3/18 | 100% | 630 / 847 | 0.000025 |
| perplexity/pplx-decider-v1.2 [gates] | L2 | 87.3% | 89.4% | 79.4% | 10 (5.3%) | 6 (4.8%) | 91.2% | 0/18 | 100% | 610 / 824 | 0.000025 |
| typesafe/jev-1.14 [choice] | L1 | 71.4% | 75.7% | 50% | 16 (8.5%) | 22 (17.5%) | 67.6% | 4/18 | 100% | 539 / 630 | 0.000067 |
| typesafe/jev-1.14 [choice] | L2 | 88.9% | 90.5% | 82.4% | 11 (5.8%) | 4 (3.2%) | 94.1% | 1/18 | 100% | 531 / 634 | 0.000068 |
| typesafe/jev-1.14 [gates] | L1 | 72.5% | 76.2% | 52% | 27 (14.3%) | 7 (5.6%) | 89.7% | 7/18 | 100% | 542 / 647 | 0.000064 |
| typesafe/jev-1.14 [gates] | L2 | 76.2% | 77.2% | 58.8% | 10 (5.3%) | 30 (23.8%) | 55.9% | 1/18 | 100% | 532 / 647 | 0.000065 |

## Hardened (post-hoc rules v2 + block guard)

| Model | Level | Accuracy | Dangerous | Over-ask | Over-ask cut vs rules v1 | Missed stops |
|---|---|---|---|---|---|---|
| rules v2 only | – | 59.8% | 0 (0%) | 68 (54%) | 0% | 7/18 |
| baseten/elephant-1:free [choice] | L1 | 75.1% | 14 (7.4%) | 10 (7.9%) | 85.3% | 7/18 |
| baseten/elephant-1:free [choice] | L2 | 82.5% | 4 (2.1%) | 18 (14.3%) | 73.5% | 4/18 |
| baseten/elephant-1:free [gates] | L1 | 61.4% | 18 (9.5%) | 10 (7.9%) | 85.3% | 7/18 |
| baseten/elephant-1:free [gates] | L2 | 79.9% | 2 (1.1%) | 13 (10.3%) | 80.9% | 4/18 |
| perplexity/pplx-decider-v1.2 [choice] | L1 | 67.7% | 13 (6.9%) | 27 (21.4%) | 60.3% | 6/18 |
| perplexity/pplx-decider-v1.2 [choice] | L2 | 87.3% | 4 (2.1%) | 14 (11.1%) | 79.4% | 4/18 |
| perplexity/pplx-decider-v1.2 [gates] | L1 | 61.9% | 18 (9.5%) | 9 (7.1%) | 86.8% | 7/18 |
| perplexity/pplx-decider-v1.2 [gates] | L2 | 86.8% | 2 (1.1%) | 14 (11.1%) | 79.4% | 4/18 |
| typesafe/jev-1.14 [choice] | L1 | 69.8% | 1 (0.5%) | 33 (26.2%) | 51.5% | 7/18 |
| typesafe/jev-1.14 [choice] | L2 | 86.8% | 2 (1.1%) | 15 (11.9%) | 77.9% | 4/18 |
| typesafe/jev-1.14 [gates] | L1 | 72.5% | 18 (9.5%) | 15 (11.9%) | 77.9% | 7/18 |
| typesafe/jev-1.14 [gates] | L2 | 77.2% | 1 (0.5%) | 34 (27%) | 50% | 4/18 |
