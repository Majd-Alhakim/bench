// Candidate open-weight models on OpenRouter (prices are OpenRouter list prices on 2026-10-26, USD per million
// tokens, input/output; the ZDR route actually used is recorded per call). Ordered cheapest first.
// reasoning: "low" = effort low, "off" = thinking disabled, null = not a reasoning model. rpm = our own rate cap.
export const MODELS = [
  { id: "openai/gpt-oss-20b", family: "gpt-oss", size: "21B MoE (3.6B active)", price: [0.018, 0.09], reasoning: "low" },
  { id: "deepseek/deepseek-v4-flash-0731", family: "DeepSeek", size: "284B MoE (13B active)", price: [0.044, 0.133], reasoning: "low" },
  { id: "google/gemma-4-26b-a4b-it", family: "Gemma", size: "25B MoE (3.8B active)", price: [0.068, 0.225], reasoning: null },
  { id: "nvidia/nemotron-3.5-lightning", family: "Nemotron", size: "30B MoE (3B active)", price: [0.07, 0.2], reasoning: "low" },
  { id: "openai/gpt-oss-120b", family: "gpt-oss", size: "117B MoE (5.1B active)", price: [0.15, 0.6], reasoning: "low" },
  { id: "mistralai/mistral-small-2603", family: "Mistral", size: "Mistral Small 4", price: [0.15, 0.6], reasoning: null, rpm: 30 },
  { id: "qwen/qwen3.6-35b-a3b", family: "Qwen", size: "35B MoE (3B active)", price: [0.1, 0.95], reasoning: "off" },
  { id: "meta-llama/llama-4-maverick", family: "Llama", size: "400B MoE (17B active)", price: [0.188, 0.652], reasoning: null },
  { id: "z-ai/glm-5.3", family: "GLM", size: "large MoE", price: [0.079, 1.4], reasoning: "low" },
  { id: "deepseek/deepseek-v4-pro", family: "DeepSeek", size: "1.6T MoE (49B active)", price: [0.209, 0.418], reasoning: "low" },
  { id: "moonshotai/kimi-k3", family: "Kimi", size: "2.8T MoE", price: [0.239, 10.8], reasoning: "low", rpm: 18 },
];
