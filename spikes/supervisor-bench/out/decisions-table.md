| Model | Level | Accuracy (system) | Action acc. | Model acc. on unsettled | Dangerous | Over-ask | Over-ask cut vs rules | Missed stops | JSON valid | p50 / p95 ms | $/call |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rules only | – | 58.7% | 58.7% | – | 0 (0%) | 70 (54.7%) | – | 7/18 | – | 0 | 0 |
| baseten/elephant-1:free [choice] | L1 | 75.7% | 78.3% | 57.8% | 20 (10.6%) | 4 (3.1%) | 94.3% | 4/18 | 100% | 390 / 449 | 0.000000 |
| baseten/elephant-1:free [choice] | L2 | 84.7% | 85.7% | 74.5% | 11 (5.8%) | 10 (7.8%) | 85.7% | 1/18 | 100% | 386 / 402 | 0.000000 |
| baseten/elephant-1:free [gates] | L1 | 57.7% | 73.5% | 24.5% | 24 (12.7%) | 10 (7.8%) | 85.7% | 4/18 | 100% | 397 / 476 | 0.000000 |
| baseten/elephant-1:free [gates] | L2 | 76.2% | 78.3% | 58.8% | 11 (5.8%) | 12 (9.4%) | 82.9% | 1/18 | 100% | 395 / 418 | 0.000000 |
| perplexity/pplx-decider-v1.2 [choice] | L1 | 68.8% | 72.5% | 45.1% | 21 (11.1%) | 19 (14.8%) | 72.9% | 2/18 | 100% | 607 / 868 | 0.000024 |
| perplexity/pplx-decider-v1.2 [choice] | L2 | 89.9% | 92.1% | 84.3% | 11 (5.8%) | 3 (2.3%) | 95.7% | 0/18 | 100% | 613 / 858 | 0.000025 |
| perplexity/pplx-decider-v1.2 [gates] | L1 | 62.4% | 77.8% | 33.3% | 27 (14.3%) | 2 (1.6%) | 97.1% | 3/18 | 100% | 630 / 847 | 0.000025 |
| perplexity/pplx-decider-v1.2 [gates] | L2 | 86.2% | 88.4% | 77.5% | 10 (5.3%) | 8 (6.3%) | 88.6% | 0/18 | 100% | 610 / 824 | 0.000025 |
| typesafe/jev-1.14 [choice] | L1 | 70.4% | 74.6% | 48% | 16 (8.5%) | 24 (18.8%) | 65.7% | 4/18 | 100% | 539 / 630 | 0.000067 |
| typesafe/jev-1.14 [choice] | L2 | 89.9% | 91.5% | 84.3% | 9 (4.8%) | 4 (3.1%) | 94.3% | 1/18 | 100% | 531 / 634 | 0.000068 |
| typesafe/jev-1.14 [gates] | L1 | 73% | 77.2% | 52.9% | 25 (13.2%) | 7 (5.5%) | 90% | 7/18 | 100% | 542 / 647 | 0.000064 |
| typesafe/jev-1.14 [gates] | L2 | 75.1% | 76.2% | 56.9% | 10 (5.3%) | 32 (25%) | 54.3% | 1/18 | 100% | 532 / 647 | 0.000065 |

## Hardened (post-hoc rules v2 + block guard)

| Model | Level | Accuracy | Dangerous | Over-ask | Over-ask cut vs rules v1 | Missed stops |
|---|---|---|---|---|---|---|
| rules v2 only | – | 58.7% | 0 (0%) | 70 (54.7%) | 0% | 7/18 |
| baseten/elephant-1:free [choice] | L1 | 76.2% | 12 (6.3%) | 10 (7.8%) | 85.7% | 7/18 |
| baseten/elephant-1:free [choice] | L2 | 83.6% | 2 (1.1%) | 18 (14.1%) | 74.3% | 4/18 |
| baseten/elephant-1:free [gates] | L1 | 61.4% | 16 (8.5%) | 10 (7.8%) | 85.7% | 7/18 |
| baseten/elephant-1:free [gates] | L2 | 78.8% | 2 (1.1%) | 15 (11.7%) | 78.6% | 4/18 |
| perplexity/pplx-decider-v1.2 [choice] | L1 | 68.8% | 11 (5.8%) | 27 (21.1%) | 61.4% | 6/18 |
| perplexity/pplx-decider-v1.2 [choice] | L2 | 88.4% | 2 (1.1%) | 14 (10.9%) | 80% | 4/18 |
| perplexity/pplx-decider-v1.2 [gates] | L1 | 61.9% | 16 (8.5%) | 9 (7%) | 87.1% | 7/18 |
| perplexity/pplx-decider-v1.2 [gates] | L2 | 85.7% | 2 (1.1%) | 16 (12.5%) | 77.1% | 4/18 |
| typesafe/jev-1.14 [choice] | L1 | 68.8% | 1 (0.5%) | 35 (27.3%) | 50% | 7/18 |
| typesafe/jev-1.14 [choice] | L2 | 87.8% | 0 (0%) | 15 (11.7%) | 78.6% | 4/18 |
| typesafe/jev-1.14 [gates] | L1 | 73% | 16 (8.5%) | 15 (11.7%) | 78.6% | 7/18 |
| typesafe/jev-1.14 [gates] | L2 | 76.2% | 1 (0.5%) | 36 (28.1%) | 48.6% | 4/18 |
