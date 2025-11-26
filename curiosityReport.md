# AI Code Integration

## Introduction:

Throughout the course I've noticed that AI is becoming increasingly more integrated into everything we do as DevOps for both our own purposes but also for the purpose of our users. I want to understand how I can integrate AI into the future and current apps I'm working on.

### AI integration patterns:
#### API based:

This is the most common approach it basically involves using the LLM as a third party api.

Your app essentially sends a request to the companines (openAI, Anthropic, etc.) llm through and api. The LLM does it's thing and returns a response.

#### On-device or Edge Modal Integration:
Some smaller modals can run directly on the browser or device allowing for less latancy.

#### Self Hosted Modals:
some options for this includes:

- Ollama
- vLLM
- LM Studio

This approach can be especially useful for data that is highly sensitive.

## AI and DevOps:
AI introduves interesting new challenges for a DevOps team among these are:

#### Rate Limiting and Quota Management:
Companies like OpenAI and Anthropic enforce:
- Requests per minute
- Tokens per minute
- Monthly billing limits

To work around these DevOp engineers must:
- Implement request queue
- Use circuit breakers
- Cache LLM responses

##### What is a Token?
"discrete unit of data that an AI model processes, such as a word, a part of a word, or a character for text models."

#### Prompt Versioning
prompts are similar to code in that a bad prompt lead to outages on production and teams mostly maintain prompts through prompt versioning and A/B testing frameworks.

##### A/B testing freamwork?
"A/B testing frameworks for prompt changes are tools or patterns that let you test different versions of an LLM prompt in production to see which one performs better — just like normal A/B testing in web apps, but specifically for prompts."

#### Secrets and Key Rotation
If using the API modal for llm interaction, you need an API key. In order to prevent issues these keys must be stored in environment variables, rotated regularly, and NEVER be committed to GitHub

#### LLM Metrics:

LLM features require new metrics:
- Latency per request
- Token usage per endpoint
- Error types
- Prompt output diffing for monitoring drift

Grafana has LLM-specific panels. Now this is epic!


#### When should one modal be used over another:
| Use Case | Best Approach |
|----------|---------------|
| High-accuracy responses | OpenAI or Anthropic APIs |
| Privacy-sensitive data | On-device or self-hosted |
| Real-time apps (games, chat) | Edge-deployed models |
| Low cost at scale | Self-hosted (Ollama/vLLM) |
| Startup MVP | API-based integration |
| Offline scenarios | On-device models (WebGPU, mobile) |

#### Current Use Case:

This semster I've actually been working on both a research project that has required me to integrate AI into an app I've helped make as well as an start up I've been working on. For both cases I've gone the API approach. I've mostly used OpenAI only but using dependency injection I can technically use any LLM modal.













