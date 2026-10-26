| System (L2, hardened) | Accuracy | Dangerous | Over-ask | Over-ask cut vs rules only | Missed stops | p50 / p95 ms end to end | $ per model decision | Heavy-user month |
|---|---|---|---|---|---|---|---|---|
| rules only (v1) | 58.7% | 0 | 70 (54.7%) | – | 7/18 | 0 | 0 | $0 |
| gpt-oss-120b only (SP-SUP1 pick) | 81.5% | 0 (0%) | 24 (18.8%) | 65.7% | 7/18 | 599 / 1108 | 0.000146 | $0.50 |
| jev-gates decides, gpt-oss writes | 76.2% | 1 (0.5%) | 36 (28.1%) | 48.6% | 4/18 | 588 / 2090 | 0.000158 | $0.54 |
| jev-choice decides, gpt-oss writes | 87.8% | 0 (0%) | 15 (11.7%) | 78.6% | 4/18 | 862 / 2211 | 0.000237 | $0.81 |
| decider-gates decides, gpt-oss writes | 85.7% | 2 (1.1%) | 16 (12.5%) | 77.1% | 4/18 | 927 / 2187 | 0.000195 | $0.66 |
| decider-choice decides, gpt-oss writes | 88.4% | 2 (1.1%) | 14 (10.9%) | 80% | 4/18 | 986 / 1541 | 0.000204 | $0.69 |
| jev + decider (gates), gpt-oss breaks ties | 81.5% | 1 (0.5%) | 24 (18.8%) | 65.7% | 4/18 | 1104 / 2187 | 0.000231 | $0.78 |
| decider (gates) proposes, gpt-oss confirms | 82% | 0 (0%) | 25 (19.5%) | 64.3% | 4/18 | 1172 / 1740 | 0.000120 | $0.41 |
