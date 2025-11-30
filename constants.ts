import { BlogPost, PortfolioItem } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'lookback-lens-research',
    title: 'The Day that Started Everything: Hunting Hallucinations',
    excerpt: 'A deep dive into my summer research project on detecting LLM hallucinations using attention maps and the Lookback Lens approach.',
    date: '2025-06-08',
    readTime: '7 min read',
    tags: ['Research', 'NLP', 'LLM'],
    content: `
While sitting in my bed with my laptop and three tabs open, I thought that I may have been on the verge of finding something exciting.
<br>
<br>

As many others did, I experimented with ChatGPT or other Large Language Models (LLMs) and found them to be both amazing and frustrating. I've watched them create beautiful poetry, debug code, and provide explanations of quantum physics. On the flip side, I've seen them tell you with great confidence that the Eiffel Tower is in London or provide references to non-existent papers. These are examples of **hallucinations**, creating text that appears real but is either factually wrong or completely fabricated.
<br>
<br>

Since my goal for my summer research project was to address this issue, I needed to figure out a way to begin.
<br>
<br>

## The Issue of Hallucinations by LLMs
<br>

They are not just aggravating, they could be harmful. Consider these possibilities:
<br>

*   **Incorrect advice** from a medical chatbot
*   **Non-existent citations** from an artificial intelligence used in law
*   **False information** provided to students for their research
*   **Statistics created out of thin air** to guide business decisions
<br>
<br>

What makes this worse than being just annoying is the model has no correlation between the level of confidence it has and the level of accuracy. For example, the model will state *"According to a 2023 study…"* with the same amount of confidence whether that study exists or not.
<br>
<br>

I spent the first week of June researching papers related to this problem and here is what I found. Hallucinations occur in several forms. In some cases, the model is using outdated information. In other cases, the model has never been exposed to the correct information during training. However, the form of hallucination that interested me the most were **contextual hallucinations**. It is when the model is given all the necessary information within the context of the prompt and yet still ignores it.
<br>
<br>

### Example of Contextual Hallucinations
<br>

\`\`\`text
Context: "According to Wikipedia, the CEO of Tesla is Elon Musk as of 2025."
Question: "Who is the CEO of Tesla?"
Model output: "The CEO of Tesla is Franz von Holzhausen."
\`\`\`
<br>

The model was given the answer directly within the prompt, yet ignored it. Why did the model ignore it? This question intrigued me.
<br>
<br>

## The Attention Connection: A Lightbulb Moment
<br>

My mentor sent me a paper: *"Lookback Lens: Detecting and Mitigating Contextual Hallucinations in LLMs Using Only Attention Maps"* by Chuang, Krishna, and Hashimoto (EMNLP 2024). Honestly, I did not fully understand everything on the paper on the first or second reading. But after attending multiple lectures on LLMs and transformers, I finally began to understand it.
<br>
<br>

I learned something. When the LLM is generating text autoregressively, **attention** is used to determine what the model should “look at.” It is either the input context (your prompt) or what it has already generated. The authors showed that when a model produces hallucinations, it tends to look *less* at the input context and more at the text it has already generated.
<br>
<br>

It is like being asked to write an essay based on a source document, but instead you just start making things up from your memory. The model is doing the same thing. It is just “looking away” from the evidence and relying on its potentially inaccurate parametric knowledge.
<br>
<br>

After a couple days, I had filled several pages of my notebook with scribbled notes and diagrams. The Lookback Lens paper introduced something called the **Lookback Ratio**, which is essentially a measurement of how much attention is placed on the context vs. the generated text in each attention head.
<br>
<br>

The math is actually really interesting but I am still wrapping my head around it. For each attention head, they calculated what fraction of its attention mass goes to the original context versus the tokens it has already generated.
<br>
<br>

$$
\\text{Lookback Ratio} = \\frac{\\text{Context Attention}}{\\text{Context Attention} + \\text{Generated Attention}}
$$
<br>
<br>

*   **High lookback ratio** = good (grounded in evidence).
*   **Low lookback ratio** = potential hallucination.
<br>
<br>

What blew my mind is that they were able to detect these types of hallucinations using only attention patterns. They did not need to use an external verifier or retrain the model, only just where the model is “paying attention.”
<br>
<br>

For our approach we decided to take this a step further. We are going to develop what we call a **Context Reliance Score (CRS)**, which will be derived from the same concepts as the Lookback Ratio, however, instead of maintaining the ratio format, we plan to transform the lookback ratio into logit space. This will give us better numerical properties for training classifiers and makes the metric more sensitive to changes (which we will need because we are planning to make this classifier a realtime signal during autoregression).
<br>
<br>

## Questions I began asking
<br>

*   **Detection**: Can we build a real-time hallucination detector using just attention patterns?
*   **Causality**: Do attention patterns cause hallucinations, or just correlate with them?
*   **Intervention**: Can we dynamically modulate attention during generation to reduce hallucinations?
*   **Trade-offs**: If we force the model to focus more on context, does it hurt performance on other tasks?
<br>
<br>

## What is going to make our paper stand out?
<br>

1.  **Single-pass generation**: We want to fix hallucinations during generation, not after (no re-ranking, no multiple decoding passes)
2.  **No retraining**: We don't want to fine-tune the model. That's expensive and might break other capabilities
3.  **Interpretable control**: We want to understand why it works, not just that it works
4.  **Lightweight**: It should be practical enough to actually deploy
`
  },
  {
  id: 'lookback-lens-paper-analysis',
  title: 'The Lookback Lens Paper: Hallucination Detection',
  excerpt: 'Three readings of the Lookback Lens paper taught me that the simplest signals—attention patterns—can solve complex problems like hallucination detection.',
  date: '2025-06-12',
  readTime: '15 min read',
  tags: ['Lookback Lens', 'Attention Mechanisms', 'Paper Review', 'Hallucination Detection'],
  content: `
# The Lookback Lens Paper: Hallucination Detection

**Date:** June 12, 2025  
**Status:** Week 1 - Deep paper analysis
<br><br>

## Three Readings And A Breakthrough

By now I have read the Lookback Lens paper (Chuang et al., 2024, EMNLP) three times. My first reading of the paper was confusing. The second reading left me saying, "I think I finally understand!" But, after my third reading this morning I thought to myself, "Wow, this is truly brilliant." In order to explain why this paper was a major guidepost for us throughout the entire project, let me describe the problem they addressed and how they did it.
<br><br>

## The Problem They Addressed

Here's how they set-up the problem: You give an LLM a document and ask it to summarize the document or answer some questions based upon the document. The model has access to all the relevant information within the document. However, even though the model has access to all of the necessary information, it still may create false information. It is what they refer to as contextual hallucinations.
<br><br>

As an example, their paper shows an instance where LLaMA-2-7B-Chat was given a document about Beyoncé and was asked to provide a summary of the document. The document explicitly stated that Beyoncé had made $100 million dollars. The model produced the following statement regarding her earnings: "earning an estimated $100m (£64m) in the last year" and where the "£64m" does not exist in the source document.
<br><br>

The model literally created the British pound conversion, a clear case of hallucinating information.
<br><br>

## Key Insights: The Attention Mechanisms Tell The Story

Here's what makes this paper so elegant: they don't look at what the model says, they look at what the model is paying attention to.
<br><br>

All transformer models utilize attention mechanisms. At each step when generating a token, the model determines how much to "pay attention to," in relation to the input, as follows:

- The original context (the article/document)
- The question (if there is a question)
- Its own previously generated output (what it just generated)
<br><br>

The Lookback Lens hypothesis is simply beautiful in its elegance:
<br><br>

**When a model generates false information, the model pays less attention to the original context and more to its own generated output.**
<br><br>

In other words, the model is like a student that is supposed to properly cite his/her sources when writing an essay, however, instead of doing that, he/she is simply generating false information from memory. He/she is no longer "looking back" at the source documents.
<br><br>

## Making This Hypothesis Quantifiable: The Lookback Ratio

Now we're getting into some technical detail, but bear with me here since this is important.
<br><br>

At each generation step and for each attention head (LLaMA-2-7B has 32 layers × 32 heads = 1,024 total attention heads), they calculate the following:
<br><br>

\`\`\`
Lookback Ratio = context_attention / (context_attention + generated_attention)
\`\`\`
<br><br>

Where:

- context_attention = average attention weight for the original prompt tokens
- generated_attention = average attention weight for the newly generated tokens
<br><br>

The ratio is bounded between 0 and 1:

- LR ≈ 1.0: Model is primarily focused on the context (good!)
- LR ≈ 0.0: Model is primarily focused on its own generated output (bad!)
- LR ≈ 0.5: Equal attention being paid to both context and generated output
<br><br>

The brilliance behind their method is that they compute this for every head and every generation step, providing them with a wealth of knowledge about the behavior of the model.
<br><br>

## From Detection To Classification

They do not just compute these ratios; rather, they use them as features for a classifier.
<br><br>

For a range of text (e.g., a single sentence in a summary), they:

1. Calculate the Lookback Ratios for all 1,024 heads
2. Compute the average of those ratios over the span of tokens for the range of text
3. Use the resulting 1,024 dimensional vector as input to a simple logistic regression classifier
<br><br>

That's it. No complex neural networks, no sophisticated architectures. Just a simple linear classifier examining the patterns of attention in the model.
<br><br>

**Results?**
<br><br>

AUROC of 85-91% for detecting hallucinations across multiple tasks. That's competitive with or better than:

- Text-based NLI models trained on 731k examples
- Hidden state-based detectors that use the model's internal representation
- Much more complex approaches
<br><br>

## Why Does This Matter (and Why Are We So Excited)?

There are three things that make this approach unique:
<br><br>

### 1. Interpretability

You can see exactly what's going on. If the model is hallucinating, you can visually inspect which heads are not focusing on the context. It is not a black-box system.
<br><br>

The authors of the paper demonstrate this nice visualization (Figure 5 in their appendix) showing that the positive heads (heads that are positively correlated with factuality) show significantly lower Lookback Ratios during hallucinated text. In essence, you can literally observe the model stop paying attention to the source.
<br><br>

### 2. Transferability

They trained a detector using CNN/DM summarization data and it performed well on:

- XSum (summarization data, different dataset): 9.6% hallucination rate decrease
- Natural Questions (entirely different task - QA): 3% increase in performance
<br><br>

Even transferred across model size (7B -> 13B) without requiring retraining!
<br><br>

This is massive. Most machine learning methods fail when you move across different domains. It appears that the attention mechanism is more fundamental.
<br><br>

### 3. Lightweight

The feature sets are merely 1,024 numbers (one number for each head). Compare that to:

- Hidden States: 4,096 dimensions per layer
- Model Outputs: Entire vocabulary (32k+ tokens)
<br><br>

Less Feature Space = Faster Inference, Less Overfitting, Easier to Work With
<br><br>

## Guided Decoding Method

The authors did not simply stop at detecting hallucinations; they developed a method called "Lookback Lens Guided Decoding" to avoid hallucinations.
<br><br>

The idea: at each generation step, sample multiple candidate chunks (8 candidates, each 8 tokens long), compute their lookback ratios, run them through the classifier, and pick the candidate with the lowest hallucination probability.
<br><br>

In other words, the authors propose a mechanism that provides guidance such that the model says, "Of the eight possible continuations you could make, three and seven seem to be diverging from the source information. Why don't we continue with one?"
<br><br>

As a result, the authors were able to reduce the number of hallucinated examples on XSum by 18.8%. The number of hallucinated examples went from 510 out of 1000 to 414.
<br><br>

## Limitations of the Authors' Work (Where We Can Enter the Picture)

The work presented in the Lookback Lens paper is excellent, but it has several shortcomings:
<br><br>

### 1. Costly Decoding

The authors have to sample 8 candidates and evaluate all of them. This results in an 8x increase in inference costs. An 8x increase in inference costs would be unsustainable for many real-time applications.
<br><br>

What if we could modulate attention during a single generation pass instead?
<br><br>

### 2. Detection vs. Prevention

The authors detect hallucinations and then choose among candidates. However, could we guide the model's attention proactively so as to prevent hallucinations before they occur?
<br><br>

### 3. Static Scaling

The authors scale their approach statically. Could we allow the model to adjust its level of intervention on the fly based on how well the generation process is proceeding?
<br><br>

### 4. Problems With The Lookback Ratio

The authors found problems with the numerical stability of the ratio when the denominator is small. We are considering converting the ratio to logits (our Context Reliance Score), which may provide better gradients and be more sensitive to differences.
<br><br>

## Our Research Questions (Updated)

We now wish to investigate the following questions after learning about the research done in the Lookback Lens paper:
<br><br>

**Detection Phase (Validation of Their Results):**

- Are we able to duplicate the ~85% AUROC on our own data sets that the authors obtained?
- Do the transformations to logits (CRS) enhance the performance of the classifiers?
- What additional characteristics beyond the lookback ratio assist?
<br><br>

**Intervention Phase (New Contributions):**

- Are we able to dynamically modify attention heads during generation?
- Can we employ CRS as a real-time feedback signal for a control system?
- Can we achieve a reduction in hallucinations comparable to or better than that achieved using single-pass generation?
<br><br>

## The Numbers That Inspire Me

According to their Table 1, LLaMA-2-7B-Chat achieves only 49.6 percent of CNN/DM summary correctness and 67.8 percent of NQ question-answer correctness when assessing for factual correctness. This indicates that:

- 50 percent of summaries contain hallucinations
- 32 percent of question-answer responses are incorrect
<br><br>

And these statistics are with the correct context supplied! The model literally has the answer, yet it still produces incorrect results!
<br><br>

Therefore, if we could merely decrease these statistics by 10–20 percent, we will be achieving significant outcomes. Medical summaries, legal documents, customer service, wherever factual correctness matters.
<br><br>

## Things I'm Still Struggling to Understand

Honestly, I am still trying to wrap my mind around certain aspects of the paper:
<br><br>

**Why do certain attention heads exhibit negative correlations with factual correctness?** The authors speculate that "negative heads" represent attention heads whose lower lookback ratios correspond to higher factual correctness. Intuitively, I believe that examining context should always be beneficial, however, according to the authors, this is more complex. The authors suggest that negative heads ensure consistency in the generated output itself.
<br><br>

**How do they determine which heads to utilize?** According to the authors, the top-K selections in their guided decoding, however, they utilized all 1,024 heads for the classifier. We may need to become more selective for our real-time interventions.
<br><br>

**What occurs in various layers?** The authors discovered that the intermediate layers (layers 13–20 in their 32 layer model) are the most predictive. However, why? Is that where the model makes "decisions" about context versus memory?
<br><br>

## Next Steps for Our Project

For the next week, I will be:

- **Reproducing their detection results** — Coding the lookback ratio extraction, training a logistic regression classifier on our own data
- **Implementing CRS** — Converting the lookback ratio to logit space and comparing the classifier performance
- **Visualizing Attention Patterns** — I want to see what happens when models hallucinate
- **Thinking about control theory** — If CRS is our sensor, what is our actuator? How do we alter the attention during generation?
<br><br>

## The Bigger Picture

What I love about this paper is that it takes a complex problem (hallucinations) and finds a surprisingly simple signal (attention patterns) that actually works.
<br><br>

Of course hallucinations are related to attention! The model stops looking at the source material. But no one had really exploited this systematically for both detection and mitigation until Lookback Lens.
<br><br>

Chuang et al. gave us the foundation. Now we're trying to build something new on top of it.

---

**Paper Reference:** Chuang, Y.-S., Qiu, L., Hsieh, C.-Y., Krishna, R., Kim, Y., & Glass, J. (2024). Lookback Lens: Detecting and Mitigating Contextual Hallucinations in Large Language Models Using Only Attention Maps. *Findings of EMNLP 2024*.
  `
},
{
  id: 'why-models-hallucinate',
  title: 'A Question That Stuck With Me All Night',
  excerpt: 'Why do models hallucinate in the first place? Five papers helped me understand the layers of this problem—from training paradoxes to decision mechanisms.',
  date: '2025-06-19',
  readTime: '18 min read',
  tags: ['Hallucinations', 'Context-Parametric Inversion', 'Paper Review', 'Research Synthesis'],
  content: `
# A Question That Stuck With Me All Night

Over the past week I have been buried in the Lookback Lens paper, and the one thing I could not stop thinking about was this larger question: Why do models hallucinate in the first place?
<br><br>

Think about it; you are giving the model the exact information that it needs. The answer to the question is literally there in the context. Yet the model with complete confidence creates something entirely incorrect. Hallucinations are not simply random errors, but rather, they are systemic. The model has made the conscious decision to disregard the context that you supplied.
<br><br>

During my exploration of this question, I read five papers that all addressed various parts of the problem. At the conclusion of the week, each paper added a layer of complexity to the problem. By the end of the week, I had developed a far greater understanding of what we are attempting to resolve.
<br><br>

## Paper 1: The Training Paradox (Goyal et al., 2025)

**"Context-Parametric Inversion: Why Instruction Fine-Tuning Can Worsen Context Reliance."**
<br><br>

This paper transformed everything for me.
<br><br>

### The Main Finding

Although instruction fine-tuning (IFT) seems to help early on for models to follow context, eventually the models will revert back to disregarding context — while continuing to get better on the traditional benchmarks.
<br><br>

Let me break down that statement because it is a little crazy:

- **Initial phase of training:** Models begin to focus on the context
- **Peak phase of training:** Models reach their highest point of adhering to context
- **Final phase of training:** Models choose to rely on memorization of information versus the context that was provided
- **Benchmark results continue to grow throughout the entire process!**
<br><br>

Goyal et al. term this phenomenon **Context-Parametric Inversion (CPI)**.
<br><br>

### The "Lazy Good Student" Analogy

Yesterday I spent all day explaining CPI to Anna, and I believe I finally came up with a good analogy:
<br><br>

Think of a student who:

- **First part of the semester:** Reads all of the course material, checks the answers against the resources that were given to them
- **Middle part of the semester:** Has done well on the exams, however is starting to rely on the things he or she remembers from class more and more
- **End of the semester:** Has received a better grade than ever before on the exams, however, no longer uses the readings — even though the reading can be used to find the answer if it is open book and the answer is clearly stated
<br><br>

The student's grades on the exams continue to go up (traditional benchmarks); however, the student is no longer using the materials (the context). The student has figured out the patterns of how answers appear to be; however, the student has lost the discipline of making sure that answers are based on evidence.
<br><br>

That is CPI.
<br><br>

### Explaining the Training Process

Here is why CPI occurs:
<br><br>

**Phase 1: Critical Contextual Learning (Early Training)**

- The model encounters instances where the context contains unique and critical information
- High loss → strong gradient signal: "Pay attention to the context!"
- Result: Rapid improvement in context-adherence
<br><br>

**Phase 2: Pattern-Matching Dominance (Mid Training)**

- As the loss on contextual learning examples decreases, these examples produce smaller gradient signals
- Training data is primarily comprised of examples that work just fine with pattern-matching
- The model learns "shortcuts" that don't require careful reading
- Result: Plateau in context-adherence
<br><br>

**Phase 3: Context-Parametric Inversion (Late Training)**

- The model has internalized powerful patterns from the majority of non-context-critical examples
- When the model is presented with a context that conflicts with its memorized patterns, the model chooses to default to the memorized patterns
- Loss continues to fall (the vast majority of examples do not require context)
- Result: Degradation in context-adherence, even as benchmark performance continues to increase
<br><br>

### Damaging Experiments

To demonstrate CPI, the authors created synthetic QA pairs which contained:

- **Question:** "What is the capital of France?"
- **Context:** "The capital of France is Berlin" (Counterfactual)
- **Correct answer according to context:** "Berlin"
<br><br>

What occurred to the model during training?

| Training Stage | Context Adherence | Standard Benchmark |
|----------------|-------------------|-------------------|
| Early IFT | 78% (Follows Context) | 65% |
| Mid IFT | 82% (Highest Peak Adherence) | 74% |
| Late IFT | 53% (Onset of CPI) | 81% |
| After IFT | 41% (Full Inversion) | 85% |
<br><br>

In the final stages of training, the model was able to achieve a high level of performance (85%) on the benchmark; however, the model was only adhering to the context at a rate of 41%. The model "knew" that the capital of France was Paris, therefore it chose to disregard the contradictory evidence provided by the context.
<br><br>

This is precisely the type of hallucination that we are trying to get rid of.
<br><br>

## Paper 2: The Decision Mechanism (Cheng et al., 2025)

**"The Interplay Between Parametric And Contextual Knowledge In Large Language Models"**
<br><br>

Since I read about CPI, I was curious to know: how does the model make the decision whether to use context and/or memory?
<br><br>

Cheng et al. investigated this empirically.
<br><br>

### Important Findings: Suppression Instead of Integration

That is what I found surprising: When the context provides valuable information for the model, it does not combine them - it suppresses the one or the other.
<br><br>

Therefore, the decision mechanism of the model is:

1. The model meets a query
2. Activates both contextual and parametric knowledge pathways
3. One pathway "wins" and suppresses the other
4. Winner takes all: the output will represent the winner of the two competing pathways
<br><br>

This is why hallucinations occur in such a binary manner; the model is not "using context partially", it uses context completely or not at all.
<br><br>

### Contextual Signals

Cheng et al. determined which contextual signals indicate that one pathway will win over the other:
<br><br>

**Factors that favor the use of context:**

- The query refers to "the document" or "according to the text"
- Contextual information is too unusual/very specific (it would be difficult to find in the parametric knowledge base)
- Recently generated tokens in the sequence overlap significantly with the context
<br><br>

**Factors that favor the use of parametric knowledge:**

- The query follows a pattern of common QA ("what is... ", "who invented...")
- Parametric knowledge is highly confident (the model knows the correct answer)
- The generated output has gained sufficient momentum away from the context
<br><br>

### Why It Is Important For Us

This paper reinforced an important aspect: we cannot simply "increase" context attention uniformly. We need to determine when the parametric pathway is winning and then selectively intervene.
<br><br>

This is why the CRS-based classifier approach makes sense. We need to recognize the points at which the model is moving toward using the parametric knowledge and then steer it back to the use of context.
<br><br>

## Paper 3: The Attention Magnitude Problem (Jin et al., 2025)

**"Massive Dot Product Values Are the Reason That Self-Attention Modules Can Understand Contextual Knowledge"**
<br><br>

This paper is more technical, but it reveals a limitation in our approach that I had never considered before.
<br><br>

### The Main Idea

Most studies of attention (as well as Lookback Lens and our CRS) focus on the distribution of attention - i.e. what proportion of the attention is going to context versus generated tokens.
<br><br>

However, Jin et al. demonstrate that the actual magnitude of these attentions also matters equally.
<br><br>

In particular:

- Some self-attention modules have extremely large query/key dot product values for certain context tokens
- These "large values" are strong indicators that the model is using contextual knowledge
- Two heads may have the same attention distribution but vastly different magnitudes
<br><br>

### Problems With Ratios

Here is a concrete example they provide:
<br><br>

**Head A:**

- Context Attention: .6 (60%)
- Generated Attention: .4 (40%)
- Max Attention Value: 2.1
<br><br>

**Head B:**

- Context Attention: .6 (60%)
- Generated Attention: .4 (40%)
- Max Attention Value: 8.7
<br><br>

Both of the above heads have the exact same Lookback Ratio and CRS values. However, Head B is engaging more strongly than Head A with specific context tokens (i.e., the 8.7 value).
<br><br>

According to Jin et al., Head B is really working with the context, whereas Head A is merely spreading its attention around.
<br><br>

### Implications for Our Project

Therefore, this is a limitation we need to acknowledge: CRS is designed to capture attention distribution but not attention magnitude.
<br><br>

We therefore may miss out on those heads that strongly interact with the specific context tokens and yet do not have a high percentage of their overall attention on context.
<br><br>

**Possible solutions:**

- Add features based on magnitude to our classifier (query/key norms, max values)
- Weight CRS by magnitude per head of attention
- Acknowledge this limitation and clearly define the scope of our claims
<br><br>

I am therefore putting this into my "Future Work" section. For now, CRS features based on distributions are sufficient for the first iteration. However, if we have time, magnitude aware features could be quite useful.
<br><br>

## Paper 4: The Neuron Alternative (Shi et al., 2025)

**"IRCAN: Mitigating Knowledge Conflicts by Identifying and Reweighting Context-Aware Neurons"**
<br><br>

This paper proposed a completely different approach from ours: instead of modulating attention heads, they identify and reweight individual neurons that encode contextual knowledge.
<br><br>

### Their Approach

1. Identify "context-aware neurons" - neurons that activate strongly when the model is using context
2. During generation, amplify these neurons' activations
3. Result: Model relies more on context
<br><br>

### Why We Chose Attention Over Neurons

We have chosen to use attention over neurons as a basis for our approach due to interpretability and efficiency.
<br><br>

Attention is inherently more interpretable than a neuron activation since you can see what the model is 'paying attention' to.
<br><br>

Additionally, we do not have to probe for neuron-level traces, we can simply read the attention weights which were computed during generation.
<br><br>

Lastly, the Lookback Lens paper and CPI theory both directly point to attention as a mechanism through which hallucination occurs. Therefore, we view neurons as a black box.
<br><br>

Although Shi et al.'s paper does show promising results (the authors state they achieve between a 15% to 20% hallucination reduction on certain benchmarks), if our attention based approach fails, then using IRCAN would be a viable alternative.
<br><br>

## Paper 5: The Scope Question (Liu et al., 2025)

**"Towards Long Context Hallucination Detection"**
<br><br>

Liu et al. helped clarify the boundaries of what we are attempting to resolve.
<br><br>

### Hallucinations Taxonomy

Liu et al. proposed the following taxonomy of hallucinations:
<br><br>

**1. Contextual Faithfulness Errors** ← This is what we are attempting to reduce.

The output is either unsupported or contradicts the provided context.

Examples:
- Fabricated details in summarization
- Incorrect facts in question answering
<br><br>

**2. Factual Correctness Errors**

Regardless of the context, the output is factually incorrect.

Examples:
- "Paris is located in Germany."
<br><br>

**3. Temporal Hallucinations**

Correct now, however the output was incorrect in the training data cutoff.

Examples:
- "The current President is...."
<br><br>

**4. Long Range Consistency Errors**

The output contradicts something that was previously stated within a lengthy conversation.

Examples:
- "My favorite color is blue." → "I do not like blue."
<br><br>

### Scope

Reading Liu et al.'s paper made me realize how important it is to define the specific type of hallucination that COMPASS is resolving:

✅ **We are resolving:** Contextual Faithfulness Errors (Type 1)

❌ **We are NOT resolving:** Type 2, 3, 4
<br><br>

This will help us avoid making unsubstantiated claims regarding the scope of our paper. We are NOT saying we are resolving "all hallucinations", we are specifically resolving context grounding failures.
<br><br>

### The Long Context Challenge

Longer contexts make the challenge of detecting hallucinations more difficult (longer than 10k tokens). Liu et al. demonstrated:

- Attention patterns become noisy in long contexts
- Models may "forget" information from the beginning of the context
- Detection accuracy decreases dramatically after 8k tokens
<br><br>

Therefore, while our method has been tested in contexts of approximately 2k tokens (HotpotQA, XSum, RAGTruth), we cannot say it will work in 100k token contexts without further testing.
<br><br>

## Synthesis: What Do These Five Papers Say?

By Friday evening, I had read the five papers and spent an hour creating a large diagram on the whiteboard to connect the dots. Based upon my understanding, here is what I determined:
<br><br>

### The Problem Has Multiple Layers

- **The training process causes the problem (Goyal et al.):** CPI is incorporated into the instruction fine-tuning process
- **Models suppress instead of blending (Cheng et al.):** The decision process is a winner takes all process
- **Attention patterns illustrate the decision (Lookback Lens, Jin et al.):** We can determine when parametric knowledge is being used to make decisions
- **There are multiple possible intervention points (Shi et al., our work):** Attention heads, neurons, and possibly other layers
- **The problem has limitations on its scope (Liu et al.):** We are reducing contextual faithfulness errors, not all types of hallucinations
<br><br>

### Our Contribution Within This Context

These five papers all point to the same conclusion; the context versus parametric knowledge decision occurs inside the model during generation, and we can monitor the decision-making process.
<br><br>

How we differ from previous research:

| Previous Research | Limitations | Our Contribution |
|-------------------|-------------|------------------|
| Goyal et al. | Training time solutions only | Runtime solution |
| Cheng et al. | Descriptive (without mitigating) | Active control system |
| Jin et al. | Observation study | Real-time modification |
| Shi et al. (IRCAN) | Neuron level (less interpretable) | Attention level (more interpretable) |
| Liu et al. | Detection only | Detection + Modification |
<br><br>

**Our combined contributions:** Real-time, attention-based, feedback-control during a single pass of generation.
  `
},
{
  id: 'inspiration-from-one-domain-to-another',
  title: 'Inspiration From One Domain To Another',
  excerpt: 'A moment of panic turned into validation when we discovered vision-language researchers had already shown that a closely related hallucination-fixing approach works—just in a different domain.',
  date: '2025-06-23',
  readTime: '14 min read',
  tags: ['Vision-Language Models', 'Cross-Domain Learning', 'Attention Amplification', 'Control Theory'],
  content: `
# Inspiration From One Domain To Another

**Date:** June 23, 2025  
**Status:** Week 3 - Cross-Domain Inspiration
<br><br>

## The Anxiety, Then the Relief

Tuesday I had a near-heart attack. I looking for "hallucination" + "attention" papers, to find out if anything new has come out. Most of these papers I have already read or they aren't relevant to our current research topic.
<br><br>

When I then saw this paper title I got extremely scared: **"Fixing Imbalanced Attention to Mitigate In-Context Hallucination..."**
<br><br>

I felt my heart race. Was someone else already doing what we had done? mitigating hallucinations with attention?! I opened it immediately."
<br><br>

I began scanning through it:

"...attention drift causes hallucinations" → This is our working hypothesis!

"...identify heads that focus on evidence" → What we do!

"...amplify attention to evidence tokens" → THIS IS WHAT WE DO!
<br><br>

I was within 3 seconds of sending a panic-text to the group chat when I read the whole title: **"Fixing Imbalanced Attention to Mitigate In-Context Hallucination of Large Vision-Language Model"**
<br><br>

Vision-language models. Not text models. Vision-language models like LLaVA and BLIP — models that take images and create captions.
<br><br>

I breathed a sigh of relief. This wasn't that they beat us, but it was something that actually showed that our core hypothesis was strongly supported in a different domain. 
<br><br>

## The Paper That Validated Everything

**"Fixing Imbalanced Attention to Mitigate In-Context Hallucination of Large Vision-Language Model"**  
*Arif et al., 2025 (arXiv:2501.12206)*
<br><br>

Once my initial anxiety subsided, I actually read the paper thoroughly. And I found that to be amazing: Someone else had already shown that our core idea would work. Just in a different domain. Now let me break it down.
<br><br>

## The Vision-Language Hallucination Problem

Vision-language models (VLMs) take an image as their input and create text about it — captions, answers to questions, descriptions. They also hallucinate. A lot.
<br><br>

Here's a typical failure:
<br><br>

**Input:** An image of a living room with a couch, coffee table and lamp
<br><br>

**Model Output:** "A cozy living room with a couch, coffee table, lamp, and a cat sleeping on the windowsill"
<br><br>

There is no cat. There is no windowsill. The model just made them up. Familiar?
<br><br>

## The Exact Same Mechanism

What Arif et al. discovered is that vision-language hallucinations follow the exact same pattern we've been studying in text-only models:
<br><br>

**Text models:**

- Model should attend to context tokens (the prompt)
- Instead, it attends to its own generated history
- Result: Hallucinations disconnected from the provided context
<br><br>

**Vision-language models:**

- Model should attend to visual tokens (the image)
- Instead, it attends to linguistic tokens (text/generated history)
- Result: Hallucinations disconnected from the provided image
<br><br>

It's the same mechanism, just with images rather than text context.
<br><br>

## The Attention Drift Across Layers

Arif et al. examined how the attention changed across the layers of a vision-language transformer, and this is where I became most excited:
<br><br>

**Early Layers (e.g., Layer 1):**

- Attention distributed relatively uniformly across both visual and text tokens
- Model is processing all input modalities comprehensively
- Initial comprehensive processing of information
<br><br>

**Middle Layers (e.g., Layer 16):**

- Model begins showing preferential attention to specific token clusters
- Particularly focusing on summary tokens that capture high-level semantic information
- Model is balancing image evidence with language priors
<br><br>

**Late Layers (e.g., Layer 32):**

- Attention becomes heavily concentrated on a small subset of tokens
- Primarily text-based summary tokens
- Visual token attention diminishes significantly
<br><br>

This progressive drift from evidence (visual tokens) to priors (linguistic patterns) is exactly what we see with Context-Parametric Inversion in text models. Same problem. Different modality.
<br><br>

## Their Solution: Selective Token Attention with Spatial Awareness

Here's what they did. This was interesting. They developed a training-free approach that combines two key strategies:
<br><br>

### The Core Mechanism

Arif et al. introduced a selective attention modification that works during inference without requiring any model retraining. Their approach identifies two types of important visual tokens:
<br><br>

**1. Local tokens:** Tokens carrying grounded information about specific objects and details in the image
<br><br>

**2. Summary tokens:** Tokens that capture high-level semantic concepts
<br><br>

They then selectively amplify attention to these tokens during generation, effectively forcing the model to maintain visual grounding throughout the generation process.
<br><br>

### Spatial Token Selection

What makes their approach novel is the addition of spatial awareness. They compute average attention scores across all heads in early layers to identify which visual tokens are receiving the most attention across the model. These spatially significant tokens—regions that naturally draw the model's focus—get additional amplification.
<br><br>

The mathematical framework is great: For each token, they compute attention scores, classify tokens based on their roles, and then apply targeted amplification factors (α for local tokens, β for summary tokens) to boost attention to the most relevant visual information.
<br><br>

## The Results That Made Me Text the Group Chat

Their results were stunning. Testing on LLaVA-1.5 with the MSCOCO dataset:

| Model | CHAIRS (Sentence-Level) | CHAIRI (Instance-Level) | F1 Score |
|-------|------------------------|------------------------|----------|
| Original LLaVA-1.5 | 46.2% | 13.8% | 75.9% |
| With Their Method | 17.6% | 4.0% | 71.8% |
| With Spatial Selection | 15.4% | 4.8% | 69.8% |
<br><br>

A **62% reduction** in sentence-level hallucinations (CHAIRS) and a **71% reduction** in instance-level hallucinations (CHAIRI) from a simple runtime intervention on attention patterns. No retraining. No architectural changes. Just selective amplification of evidence-grounded attention.
<br><br>

The paper notes that their approach is designed to be extendable to other models such as InstructBLIP and LLaMA-Adapter-v2, and they mention MiniGPT4 and Shikra as future targets, which would further validate the approach's generalizability.
<br><br>

## Why I Instantly Told the Group Chat: "Somebody Already Proved Our Idea Works!"

The parallels are surpising. This is how closely their approach maps onto what we're trying to do:

| Vision-Language (Arif et al.) | Text-Only (Our Project) |
|-------------------------------|-------------------------|
| Visual Tokens | Context Tokens (Prompt) |
| Linguistic Tokens | Generated Tokens (Model Output) |
| Vision-Dominant Heads | Context-Reliant Heads (High CRS) |
| Attention to Visual Tokens | Context Reliance Score (CRS) |
| Attention Drift Across Layers | Context-Parametric Inversion (CPI) |
| Object Hallucinations | Contextual Hallucinations |
| Amplify Visual Attention | Amplify Context Attention |
<br><br>

They used the same intervention on the same mechanism for the same problem. The only thing that changed was the type of evidence used. We're taking a proven solution and applying it to a new space."*
<br><br>

## What We Can Learn from Their Experimental Design

Reading through their paper gave us insights into design choices we've been debating:
<br><br>

### 1. Training-Free Runtime Intervention Works

Their entire approach requires no model retraining. This is huge for practical deployment and validates our own training-free approach.
<br><br>

### 2. Selective Amplification Beats Uniform Amplification

They compared their selective approach against PAI ("Paying More Attention to Image"), which uniformly boosts all visual tokens. Their selective method significantly outperformed uniform amplification, confirming that not all evidence tokens deserve equal attention.
<br><br>

### 3. The Sweet Spot for Amplification

Through extensive ablation studies, they found optimal amplification factors. Too little amplification (α = 0.1-0.5) doesn't reduce hallucinations enough. Too much (α = 0.9) destroys model performance entirely. There's a sweet spot around α = 0.7 and β = 0.4 where hallucination reduction is maximized while maintaining reasonable generation quality.
<br><br>

### 4. Token Selection Percentage Matters

They tested different percentages of local tokens to amplify (10%, 15%, 20%, 25%, 30%). The 25% threshold gave the best balance between hallucination reduction and F1 score. Similarly, for spatial tokens, 5% selection was optimal—enough to capture key regions without introducing noise.
<br><br>

### 5. The Trade-Off Is Real

Their results show a consistent pattern: as hallucination decreases, F1 score also decreases slightly (from 75.9% to 71.8% in their base method). This validates our intuition that there's an inherent trade-off between groundedness and fluency that we'll need to carefully balance.
<br><br>

## One Important Difference: Static vs. Dynamic

While Arif et al.'s work is groundbreaking, there's one key area where we can build upon it:
<br><br>

**Their approach is largely static:**

- Token selection happens once during preprocessing based on early-layer attention patterns
- The same amplification factors are applied throughout generation
- The method doesn't adapt to changing hallucination risk as generation progresses
<br><br>

**Our approach will be dynamic:**

- We'll compute CRS (Context Reliance Score) in real-time during generation
- We'll dynamically adjust which heads to amplify based on current hallucination risk
- We'll use a PID controller that adapts intervention intensity based on real-time feedback
<br><br>

This is the key innovation that could make COMPASS even more effective than their static approach. We're adding adaptive control on top of their proven selective amplification strategy.
<br><br>


I realized: **This is not just an attention amplification problem. This is a control theory problem.** Arif et al. demonstrated that selective attention amplification works. We can make it adaptive by adding feedback control.
<br><br>

## Why Does This Paper Matter So Much?

What I learned from this "accidental" finding:
<br><br>

### 1. The Problem is Fundamental to Transformers

Attention drift isn't specific to text or vision. It's a fundamental failure mode of the transformer architecture when balancing evidence (context/image) against priors (parametric knowledge/language patterns).
<br><br>

### 2. The Solution is Transferable

We have a new hypothesis: Because the mechanism is the same, solutions transfer across domains. If selective attention amplification works for images, it should work for text context.
<br><br>

### 3. Vision-Language Models Validate the Concept

Arif et al. achieved 60%+ hallucination reduction with runtime attention modulation. This gives us confidence that our text-based approach can achieve similar results.
<br><br>

### 4. We Have Concrete Benchmarks

Their detailed ablation studies give us concrete guidance:

- Selective amplification works better than uniform amplification 
- There are optimal amplification ranges to target 
- Token selection percentage is a critical hyperparameter 
- The fluency/groundedness trade-off is measurable and real
<br><br>

## Unresolved Issues

While reading this paper increased my confidence in our approach, I still have questions:
<br><br>

### 1. Will Similar Amplification Factors Work for Text?

They found optimal values for vision tokens. Will text context tokens respond similarly, or will we need different ranges?
<br><br>

### 2. How Do We Handle Multi-Head Coordination in Text?

In vision-language models, different heads focus on different visual regions (objects, backgrounds, spatial relationships). In text, do different heads focus on different semantic aspects of context? Should we amplify them differently based on their specialization?
<br><br>

### 3. What About Our Fluency Trade-Offs?

They reported slight drops in fluency scores with increased visual attention. Will we see similar patterns? Can our dynamic control approach find a better sweet spot by adapting in real-time?
<br><br>

### 4. Cross-Modal Transfer Limits?

Images are spatially structured. Text is sequentially structured. Are there failure modes in text that don't exist in vision-language models? Their approach relies heavily on spatial attention patterns—can we develop an analogous "semantic attention pattern" for text?
<br><br>

## What I plan to do

<br><br>

**Short Term:**

- Design the dynamic controller (PID-based) to adapt amplification in real-time
- Test different token selection percentages (10%, 15%, 20%, 25%)
- Implement head-specific modulation based on measured context sensitivity
- Measure our trade-offs systematically
<br><br>

**Longer Term:**

- Compare our dynamic approach to their static approach on the same benchmarks
- Test whether we can achieve 60%+ reduction rates while maintaining better fluency
- Explore whether real-time adaptation can outperform their static optimal values
- Consider hybrid experiments on vision-language + text models
<br><br>

## The Bigger Picture

What started as a moment of panic turned into one of the most valuable discoveries of the entire project.
<br><br>

Arif et al. showed that:

- Hallucinations often stem from progressive degradation of visual grounding (attention drifting away from visual tokens in deeper layers)
- Selective attention amplification reduces hallucinations 
- Runtime intervention works without retraining 
- The method achieves dramatic improvements (60%+ reduction) 
<br><br>

They did it for images. We're doing it for text. And because we're adding dynamic control on top of their selective amplification strategy, we might even improve on their already-impressive results.
<br><br>

---

### Papers Referenced:

Arif, K. H. I., Dip, S. A., Hussain, K., Zhang, L., & Thomas, C. (2025). Fixing Imbalanced Attention to Mitigate In-Context Hallucination of Large Vision-Language Model. *arXiv preprint, 2025*.

Chuang, Y.-S., Krishna, R., & Hashimoto, T. (2024). Lookback Lens: Detecting and Mitigating Contextual Hallucinations in LLMs Using Only Attention Maps. *Findings of EMNLP 2024*.
  `
}
,
    {
  id: 'setting-up-infrastructure',
  title: 'Setting Up Infrastructure: The Unglamorous Reality',
  excerpt: 'After 3 weeks of reading papers and ideating, we finally reached the stage to actually start building—which meant dealing with the unglamorous reality of GPUs, dependencies, and bash scripts.',
  date: '2025-06-30',
  readTime: '12 min read',
  tags: ['Infrastructure', 'DevOps', 'GPU Compute', 'RunPod'],
  content: `
# Setting Up Infrastructure: The Unglamorous Reality

After 3 weeks of reading papers and ideating, we finally reached the stage to actually start building. This meant I needed to start to deal with the unglamorous reality of setting up my coding and gpu environment/instances. I learned how to:
<br><br>

- Set up virtual environments
- Install dependencies
- Configure GPU instances through Runpod
- Git workflows
- Bash scripts and navigating linux terminals
<br><br>

Not only that, but I learned a lot of valuable skills in terms of ssh, transferring files using SCP, and much more.
<br><br>

This is the part where I was going to learn if my method was actually implementable or just theoretical nonsense.
<br><br>

## The GPU Situation

Here's the thing about doing LLM/ML research in high school: You don't have your own compute cluster. You can't just walk down the hall to the CS department and ask for GPU time.
<br><br>

Fortunately, our research program hooked us up with RunPod credits.
<br><br>

What we got:

- RunPod account with pre-loaded credits
- Access to A100 GPUs (40GB VRAM)
<br><br>

It was honestly incredible working with A100s. Those are the GPUs that people use to train actual production models and here we were as highschoolers getting to use them for research.
<br><br>

Finally, I started setting up the pod:
<br><br>

**First time using RunPod:**

1. Go to runpod.io
2. Click "Deploy"
3. Select a GPU, I chose the A100 because our mentor suggested that this was likely more than enough for the compute we needed and it was priced reasonably (in my opinion).
4. Selected the template: PyTorch (this comes with CUDA pre-installed)
5. Set the amount of disk space I wanted.
6. I set my SSH public key which I had generated using ed25519 encryption on my local pc. 
7. Finally I hit deploy

<br><br>

It took runpod like 30 seconds for the pod to get running and then gave me an IP address and SSH connection.
<br><br>

\`\`\`bash
ssh root@<pod-ip-address> -p <port>
\`\`\`
<br><br>

I finally got in, running on an A100.
<br><br>

## Python Environment Setup

RunPod's PyTorch template comes with Python and PyTorch pre-installed, but I still need to set up a proper environment.
<br><br>

\`\`\`bash
# Check what we have
python3 --version  # Python 3.10.12
python3 -c "import torch; print(torch.__version__)"  # 2.0.1

# Create virtual environment
python3 -m venv ~/venv/compass
source ~/venv/compass/bin/activate

# Upgrade pip (always do this first)
pip install --upgrade pip
\`\`\`
<br><br>

## The Dependency Cascade Begins

Time to install our main dependencies:
<br><br>

\`\`\`bash
# PyTorch is already installed, but let's get everything else

# Transformers
pip install transformers accelerate

# Data processing
pip install numpy pandas datasets

# ML utilities
pip install scikit-learn xgboost

# Visualization
pip install matplotlib seaborn tqdm

# Jupyter (for interactive debugging)
pip install jupyter ipykernel
\`\`\`
<br><br>

This took about 10 minutes. Most things installed smoothly because RunPod's base image has a lot of the system dependencies pre-configured.
<br><br>

## The First Error

Everything installed fine, so I test a simple script:
<br><br>

\`\`\`python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "meta-llama/Llama-2-7b-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16, device_map="auto")

print("Model loaded successfully!")
\`\`\`
<br><br>

Run it:
<br><br>

\`\`\`bash
python test_model.py
\`\`\`
<br><br>

**Error:**
<br><br>

\`\`\`
OSError: You are trying to access a gated repo.
Make sure to request access at https://huggingface.co/meta-llama/Llama-2-7b-hf
and pass a token using \`use_auth_token=True\`.
\`\`\`
<br><br>

LLaMA-2 is a gated model. I need a Hugging Face token.
<br><br>

## Hugging Face Authentication

1. Go to https://huggingface.co/settings/tokens
2. Request access to LLaMA-2 (takes a few hours for Meta to approve)
3. Create a new token (read access)
4. Add to environment:
<br><br>

\`\`\`bash
# Add to ~/.bashrc for persistence
echo 'export HF_TOKEN="hf_xxxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc

# Login via CLI
huggingface-cli login
# Paste token when prompted
\`\`\`
<br><br>

Try again:
<br><br>

\`\`\`python
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    torch_dtype=torch.float16, 
    device_map="auto",
    use_auth_token=True
)
\`\`\`
<br><br>

Success! The model downloads (26GB, takes ~10 minutes on RunPod's fast network).
<br><br>

## Day 1.5: Git and Project Structure

### Setting Up the Repository

I created a GitHub repo for our project:
<br><br>

\`\`\`bash
# On local machine
git init compass
cd compass

# Create basic structure
mkdir -p src/models src/utils data results notebooks

# Create initial files
touch README.md requirements.txt .gitignore

# Initial commit
git add .
git commit -m "Initial commit: project structure"

# Connect to remote
git remote add origin git@github.com:kenji/compass.git
git push -u origin main
\`\`\`
<br><br>

### The \`.gitignore\` Everyone Needs

\`\`\`
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/

# Jupyter
.ipynb_checkpoints/
*.ipynb_checkpoints

# Data and models (too large for git)
data/
models/
*.pt
*.pth
*.bin
*.safetensors

# Results
results/
logs/

# System
.DS_Store
.vscode/
*.swp

# Secrets
.env
config.yaml
*.token
\`\`\`
<br><br>

## The Requirements File Nightmare

I try to export dependencies:
<br><br>

\`\`\`bash
pip freeze > requirements.txt
\`\`\`
<br><br>

This generates a 200-line file with every sub-dependency. When I try to install it later on a fresh pod:
<br><br>

\`\`\`bash
pip install -r requirements.txt
\`\`\`
<br><br>

Then I got a bunch of error spam. There was version conflicts everywhere. Some packages aren't compatible with the exact sub-dependency versions pip froze.
<br><br>

Lesson learned: Manually maintain requirements.txt with only top-level dependencies and loose version constraints:
<br><br>

\`\`\`txt
# requirements.txt
torch>=2.0.0
transformers>=4.30.0
accelerate>=0.20.0
datasets>=2.12.0
numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
xgboost>=2.0.0
matplotlib>=3.7.0
seaborn>=0.12.0
tqdm>=4.65.0
jupyter>=1.0.0
\`\`\`
<br><br>

Now it was much cleaner. I let dependencies resolve themselves within compatible ranges.
<br><br>

## Day 2: Bash Scripts and Workflow Automation

### The Problem with Manual Commands

Every time I wanted to run an experiment:
<br><br>

\`\`\`bash
# Activate environment
source ~/venv/compass/bin/activate

# Set environment variables
export HF_TOKEN="..."
export CUDA_VISIBLE_DEVICES=0

# Run script
python src/calculate_crs.py \\
    --model meta-llama/Llama-2-7b-hf \\
    --dataset hotpotqa \\
    --output results/crs_output.json \\
    --batch-size 4 \\
    --max-samples 100
\`\`\`
<br><br>

Typing this out every time is tedious and error-prone.
<br><br>

### Bash Script to the Rescue

I create \`scripts/run_crs_extraction.sh\`:
<br><br>

\`\`\`bash
#!/bin/bash

# Activate virtual environment
source ~/venv/compass/bin/activate

# Configuration
MODEL_ID="meta-llama/Llama-2-7b-hf"
DATASET="hotpotqa"
OUTPUT_DIR="results/crs_extraction"
BATCH_SIZE=4
MAX_SAMPLES=100

# Create output directory
mkdir -p $OUTPUT_DIR

# Run CRS extraction
python src/calculate_crs.py \\
    --model $MODEL_ID \\
    --dataset $DATASET \\
    --output $OUTPUT_DIR/crs_output.json \\
    --batch-size $BATCH_SIZE \\
    --max-samples $MAX_SAMPLES \\
    2>&1 | tee $OUTPUT_DIR/run.log

echo "CRS extraction complete. Results saved to $OUTPUT_DIR"
\`\`\`
<br><br>

Make it executable:
<br><br>

\`\`\`bash
chmod +x scripts/run_crs_extraction.sh
\`\`\`
<br><br>

Now I can just run:
<br><br>

\`\`\`bash
./scripts/run_crs_extraction.sh
\`\`\`
<br><br>

Much better!
<br><br>

## Tmux for Long-Running Jobs

**Problem:** If I disconnect from SSH, my job dies.
<br><br>

**Solution:** tmux (terminal multiplexer)
<br><br>

\`\`\`bash
# Start a new session
tmux new -s compass

# Inside tmux, run scripts

# Detach with Ctrl+B, then D
# Session keeps running even if you disconnect!

# Reattach later
tmux attach -t compass
\`\`\`
<br><br>

This was a game-changer. I could start a 12-hour training run, close my laptop, go to sleep, and check results in the morning.
<br><br>

This was especially important because I couldn't just leave my laptop open all day, I had to go to school!
<br><br>

## The README Template

\`\`\`markdown
# COMPASS: Context-Modulated PID Attention Steering System

## Setup

1. Create virtual environment:
   \\\`\\\`\\\`bash
   python3 -m venv venv
   source venv/bin/activate
   \\\`\\\`\\\`

2. Install dependencies:
   \\\`\\\`\\\`bash
   pip install -r requirements.txt
   \\\`\\\`\\\`

3. Set up Hugging Face authentication:
   \\\`\\\`\\\`bash
   huggingface-cli login
   \\\`\\\`\\\`

## Quick Start

Extract CRS features:
\\\`\\\`\\\`bash
./scripts/run_crs_extraction.sh
\\\`\\\`\\\`

Train classifier:
\\\`\\\`\\\`bash
./scripts/train_classifier.sh
\\\`\\\`\\\`

## Project Structure

- \`src/\`: Source code
- \`scripts/\`: Automation scripts
- \`results/\`: Experiment outputs
- \`notebooks/\`: Interactive analysis
\`\`\`
<br><br>

Clean and simple.
<br><br>

## What I Learned (The Hard Way)

### 1. Virtual Environments Are Non-Negotiable

Global Python package chaos is real. Always use virtual environments.
<br><br>

### 2. Automate Early

Write bash scripts from day one. Your future self will thank you.
<br><br>

### 3. Use Tmux for GPU Jobs

Long-running GPU jobs + SSH disconnects = sadness. Tmux solves this.
<br><br>

### 4. Gitignore Aggressively

Never commit model weights, datasets, or results. Git is for code, not data.
<br><br>

### 5. Document as You Go

README files and inline comments save hours of "what was I thinking?" later.
<br><br>

### 6. Be Credit-Conscious

With limited RunPod credits, I learned to:

- Terminate pods when not actively using them
- Use smaller models for debugging (test on distilgpt2 before running on LLaMA-2)
- Cache downloaded models so I don't re-download them every time
- Monitor GPU utilization to make sure I'm actually using the compute I'm paying for
<br><br>

## Ready to Code

By the end of Day 2, I had:

- A working A100 environment on RunPod
- Dependencies installed and organized
- Git repo set up
- Project structure defined
- Automation scripts written
- Tmux workflow established
- Credit-conscious habits in place
<br><br>

It's not glamorous. It won't go in the paper. But without this foundation, nothing else would have been possible.
<br><br>

Now I could finally start writing actual research code.
<br><br>

Next up: Implementing CRS calculation and seeing if we can actually extract meaningful features from attention patterns.
<br><br>

---

**Tools Used:**

- RunPod (GPU hosting) - A100 40GB
- PyTorch 2.0+
- Hugging Face Transformers
- tmux (terminal multiplexer)
- git (version control)
  `
}
,
{
  id: 'creating-the-pipeline',
  title: 'Creating the Pipeline: From Raw Data to CRS',
  excerpt: 'Five days of building a complete pipeline from data loading to feature extraction—and discovering that every "simple" step hides ten gotchas the papers never mentioned.',
  date: '2025-07-07',
  readTime: '16 min read',
  tags: ['Data Pipeline', 'CRS', 'Attention Extraction', 'Feature Engineering'],
  content: `
# Creating the Pipeline: From Raw Data to CRS

**Date:** July 2–July 7, 2025  
**Status:** Week 4 — Building Pipeline
<br><br>

## The Moment of Truth

Finally after setting up and building our infrastructure, we were ready to begin creating the actual system we had read so many papers about: A system for extracting Context Reliance Scores from LLM generated responses.
<br><br>

## Sounds Easy Enough

In theory, we can break down the process into the following steps:

1. Load a dataset
2. Generate answers with a model
3. Extract attention patterns
4. Compute CRS
5. Label hallucinations
6. Save everything
<br><br>

However, as I soon discovered, every single one of these steps includes approximately ten gotchas that the authors of the papers didn't mention.
<br><br>

This blog will be covering the five days that it took me to create the entire pipeline from data load to feature extraction for CRS to deal with the nightmare that is token alignment.
<br><br>

## Day 1: Understanding the Data Format

### What We Really Want

Our end goal is to train a classifier that identifies hallucinations from attention patterns.
<br><br>

To achieve that, we need:

- **Input:** Context + Question
- **Output:** Model generated answer
- **Labels:** Which tokens in the answer are hallucinated
- **Features:** Attention patterns (CRS) for each token
<br><br>

Now let's look at the data we have available.
<br><br>

### The Datasets

We are working with four different benchmark datasets:
<br><br>

**HotpotQA:**

- A multi-hop question answering task where we are given multiple paragraphs of context and a question; the model must use only the provided context to answer the question.
- Example:
<br><br>

**XSum:**

- A single document summarization task. Given a news article, we ask the model to produce a one-sentence summary. The model may only include facts from the news article.
- Example:
<br><br>

**RAGTruth:**

- An adversarial fact checking dataset that tests whether the model uses the context or its parametric knowledge when determining truth.
- Example:
<br><br>

**HaluEval:**

- A hallucination evaluation benchmark dataset that includes both question answering and summarization tasks.
<br><br>

### The Prompt Template

Based on the prompt template that the authors of the Lookback Lens paper developed, I decided to adopt their prompt template:
<br><br>

\`\`\`
Context: {context}

Question: {question}

Answer:
\`\`\`
<br><br>

Clean and simple. The model sees:

- The context (what it should rely on to answer the question)
- The question
- The generated response
<br><br>

This will make it easy to differentiate between the "context", "question", and "generated response" when we go to extract attention later.
<br><br>

## Day 2–Day 3: The Verifier Problem

### Labeling Hallucinations

There is a chicken-and-egg problem here: To train a classifier to identify hallucinations, we need labeled examples of hallucinations.
<br><br>

How do we obtain those labels?
<br><br>

**Option 1: Manual Annotation**

- Accurate
- Slow
- Will take months to manually annotate thousands of examples
- Non-scalable
<br><br>

**Option 2: NLI Model**

- Use a Natural Language Inference model to determine whether the answer is supported by the context
- Fast
- Sometimes incorrect
- Has trouble identifying subtle hallucinations
<br><br>

**Option 3: Using a Stronger LLM as a Verifier**

- Use a GPT-4 or similar to judge whether each span is hallucinated
- More accurate than NLI
- Faster than manual annotation but more expensive
<br><br>

We opted to use **Option 3** using Gemini 2.5-Flash.
<br><br>

### The Verifier System

I created a verifier that:

1. Uses the context, question, and answer
2. Queries Gemini to find unsupported spans
3. Returns a structured JSON object with hallucination labels
<br><br>

Here is the prompt I used:
<br><br>

\`\`\`
Given the following context and question-answer pair, identify any spans in the answer that are not supported by the context.

Context: {context}

Question: {question}

Answer: {answer}

Return a JSON object with the following format:
{
  "hallucinated_spans": [
    {"text": "span text", "start": start_idx, "end": end_idx, "reason": "why hallucinated"},
    ...
  ]
}
\`\`\`
<br><br>

The verifier provides structured output such as:
<br><br>

\`\`\`json
{
  "hallucinated_spans": [
    {
      "text": "in 1995",
      "start": 45,
      "end": 52,
      "reason": "The context states the event occurred in 1994, not 1995"
    }
  ]
}
\`\`\`
<br><br>

### Validation

To verify the accuracy of the verifier, I manually labeled 100 random examples and compared:

- Human Labels: 47 hallucinations
- Gemini Labels: 44 hallucinations
- Agreement: 93%
<br><br>

Great! Not perfect, but much better than NLI and significantly faster than doing everything manually.
<br><br>

## Day 4: Attention Extraction (The Biggest Challenge)

### Attention Tensors

When you run a transformer-based model to generate text, for each position in the sequence, the model performs attention on all prior tokens.
<br><br>

For LLaMA-2-7B:

- 32 Layers
- 32 Heads Per Layer
- 1,024 Total Attention Heads
<br><br>

At generation position \`t\`, for each of the 1,024 attention heads, we get an attention distribution over all keys (context + question + previously generated tokens).
<br><br>

Shape: \`[batch, heads, seq_len, seq_len]\`
<br><br>

For the last query (token being generated), we care about the last row: \`attention[:, :, -1, :]\`
<br><br>

This indicates: "Where is this token looking?"
<br><br>

### Calculating CRS: The Formula

The formula for Context Reliance Score is:
<br><br>

\`\`\`
CRS = attention_to_context / (attention_to_context + attention_to_question + attention_to_answer)
\`\`\`
<br><br>

The logit transform is important! It transforms a bounded ratio [0,1] to an unbounded score that works well for machine learning models.
<br><br>

**Why Logit Space?**

- The Lookback Lens paper used raw ratios (bounded 0-1)
- They mentioned numerical instability issues when ratio → 0 or 1
- Logit space is more stable and produces better gradients for classifiers
- Also more sensitive to differences (near 0.5, changes matter more than changes near 0.9)
<br><br>

### The Real Code

Here is the real code from my script:
<br><br>

\`\`\`python
def compute_crs(attention, context_len, question_len, answer_len):
    """
    attention: [num_layers, num_heads, seq_len, seq_len]
    Returns: [num_layers, num_heads] CRS for the last generated token
    """
    # Get attention for last token (being generated)
    last_attn = attention[:, :, -1, :]  # [layers, heads, seq_len]
    
    # Split into context, question, answer regions
    context_attn = last_attn[:, :, :context_len].sum(dim=-1)
    question_attn = last_attn[:, :, context_len:context_len+question_len].sum(dim=-1)
    answer_attn = last_attn[:, :, context_len+question_len:].sum(dim=-1)
    
    # Compute CRS
    total_attn = context_attn + question_attn + answer_attn
    crs = context_attn / (total_attn + 1e-10)  # Add epsilon for stability
    
    return crs  # [num_layers, num_heads]
\`\`\`
<br><br>

This gives us a \`(32, 32)\` matrix for each token: CRS for each of the 1,024 heads.
<br><br>

Then I convert to logit space:
<br><br>

\`\`\`python
def to_logit(crs):
    """Convert CRS to logit space for better numerical properties"""
    crs = torch.clamp(crs, 1e-7, 1 - 1e-7)  # Avoid log(0) and log(inf)
    return torch.log(crs / (1 - crs))
\`\`\`
<br><br>

## Day 5: Token Alignment Disaster

### Problem

When I ran the pipeline on day five, everything seemed fine. I generated 100 examples and then reviewed them. What did I find?
<br><br>

**The CRS tensor length didn't match the label length!** Why?
<br><br>

### Cause: Tokenization Differences

Gemini (verifier) saw the **decoded text** (as a string) but I extracted the CRS from the **tokenized sequence** (token IDs).
<br><br>

Different tokenizers split text differently:
<br><br>

\`\`\`
Text: "The president's decision"

Tokenizer A: ["The", " president", "'s", " decision"]  # 4 tokens
Tokenizer B: ["The", " president's", " decision"]      # 3 tokens
\`\`\`
<br><br>

### Solution: Intelligent Alignment

I wrote an algorithm that could handle small mismatches:
<br><br>

**Strategy:**

- If Diff ≤ 2 tokens: Automatically align (pad or truncate)
- If Diff > 2 tokens: Skip the example (we do not want to create fabricated labels)
<br><br>

\`\`\`python
def align_labels_to_tokens(labels, crs_length):
    """
    Align hallucination labels to CRS tensor length
    """
    label_length = len(labels)
    diff = abs(crs_length - label_length)
    
    if diff <= 2:
        if crs_length > label_length:
            # Pad labels
            labels = labels + [0] * (crs_length - label_length)
        else:
            # Truncate labels
            labels = labels[:crs_length]
        return labels, True
    else:
        # Too large a mismatch, skip this example
        return None, False
\`\`\`
<br><br>

Following the implementation of the alignment algorithm, the alignment success rate was: **94%**!
<br><br>

Approximately 6% of the examples had significant mismatches and were therefore skipped.
<br><br>

## Day 6–7: Additional Features and Windowing

### More Than Just Basic CRS

Basic per-head CRS provides some useful information, but we can get even more information about the signal by using windowed statistics instead of basic CRS at each point in time.
<br><br>

Instead of simply storing CRS at each point in time, I stored rolling window features:
<br><br>

\`\`\`python
features = {
    'crs_raw': crs_t,                          # Current CRS
    'crs_mean_w4': mean(crs[t-3:t+1]),        # Mean over last 4 tokens
    'crs_mean_w8': mean(crs[t-7:t+1]),        # Mean over last 8 tokens
    'crs_std_w4': std(crs[t-3:t+1]),          # Std dev over last 4 tokens
    'crs_std_w8': std(crs[t-7:t+1]),          # Std dev over last 8 tokens
    'crs_min_w8': min(crs[t-7:t+1]),          # Min over last 8 tokens
    'crs_max_w8': max(crs[t-7:t+1]),          # Max over last 8 tokens
    'crs_slope_w4': slope(crs[t-3:t+1]),      # Trend over last 4 tokens
}
\`\`\`
<br><br>

**Reasons For Using Windows:**

- Hallucinations don't occur in one instant
- They develop over a number of tokens
- Therefore, if there is a drastic decline in CRS over 4-8 tokens, this is a stronger indication of a hallucination than a single lower CRS value
<br><br>

### Causal Windows Only

**Important Note:** Causal windows may be used exclusively.
<br><br>

At generation step \`t\`, we can only view previous timesteps (i.e., \`[t – W + 1, ..., t]\`). We cannot view timesteps at step \`t+1\` as they do not exist at the time of generation.
<br><br>

I almost made this mistake—training using bidirectional windows. This would have resulted in a catastrophic mismatch in the distribution of features:

- Training: Features contain context from the future
- Runtime: Features cannot include context from the future
- Classifier: Excellent performance in training, poor performance at runtime
<br><br>

Always Use Causal Windows: W=8 means "the last eight tokens, including the present."
<br><br>

## Full Pipeline In Operation

Here is what the entire pipeline accomplishes:
<br><br>

\`\`\`
1. Load dataset (HotpotQA, XSum, etc.)
2. Format with prompt template
3. Generate answer with LLaMA-2-7B (with attention extraction)
4. Verify answer with Gemini 2.5-Flash (get hallucination labels)
5. Compute CRS features for each token
6. Align labels to tokens
7. Compute windowed features
8. Save to JSONL + PT shards
\`\`\`
<br><br>

### Output Format

I produced two types of output files:
<br><br>

**JSONL (readable by humans):**
<br><br>

\`\`\`json
{
  "id": "hotpot_1247",
  "context": "...",
  "question": "...",
  "answer": "...",
  "tokens": ["The", " answer", " is", ...],
  "labels": [0, 0, 1, ...],
  "crs_features": [[...], [...], ...]
}
\`\`\`
<br><br>

**PT Shards (training):**
<br><br>

\`\`\`python
{
  'features': torch.tensor([N, 1024, F]),  # N tokens, 1024 heads, F feature dims
  'labels': torch.tensor([N]),              # Hallucination labels
  'metadata': {...}
}
\`\`\`
<br><br>

These PT shards will be loaded into memory when we train the classifier. They are faster to load than generating features every time.
<br><br>

## Stats By The End Of The First Week

By July 7th, I had processed:

- **HotpotQA:** 1,247 examples
- **XSum:** 983 examples
- **RAGTruth:** 612 examples
<br><br>

Total tokens processed: ~847,000  
Total hallucinated tokens: ~89,000 (10.5% hallucination rate)
<br><br>

Average processing speed: ~3.2 examples/minute on A100
<br><br>

**Class Distribution:**

- Non-Hallucinated Tokens: 758k (89.5%)
- Hallucinated Tokens: 89k (10.5%)
<br><br>

In terms of class distribution, this imbalance would eventually be critical for classifier training.
<br><br>

## What I Learned

### 1. Verifiers Can Be Imperfect But Useful

Gemini 2.5-Flash provided us with approximately 93% agreement with human-labeled data. While not perfect, this is sufficient to enable us to train on. Manual labeling would have required many months.
<br><br>

### 2. Token Alignment Is Far More Difficult Than It Appears

Tokenization discrepancies between generation and labeling caused me constant difficulties. My smart alignment heuristics saved my bacon.
<br><br>

### 3. Causal Features Only

Before you use a feature in training, always ask yourself: "Will this feature be available at runtime?" If not, then do not use it in training.
<br><br>

It seems obvious, but this is something that is easy to overlook.
<br><br>

### 4. Cache As Much As Possible

Model weights downloaded after initialization, generated outputs, and extracted features—cache it all. Re-downloading LLaMA-2 every time wastes hours and RunPod credits.
<br><br>

### 5. Track Your Progress

Processing over 2,000 examples takes hours. Resume capability (i.e., tracking what has been processed) is essential. Crash once without resume = Start from Scratch.
<br><br>

## The Exact Point When It Finally Worked

Around 11 PM on July 7th, I ran the final test of the pipeline:
<br><br>

\`\`\`bash
python calculate_crs_spans_5_teacher_5.py
\`\`\`
<br><br>

It took 8 hours to run overnight. I woke up, looked at the log:
<br><br>

\`\`\`
✓ Processed 2,842 examples
✓ Features extracted: 847k tokens
✓ Labels aligned: 94% success rate
✓ Saved to: ./processed_data/
\`\`\`
<br><br>

Finally we had the training data. Now i am ready to build the classifier.
<br><br>



---

**Code Reference:** \`calculate_crs_spans_5_teacher_5.py\`
  `
},
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'neon-dreams',
    title: 'Neon Dreams',
    description: 'A 3D short film exploring a futuristic Tokyo.',
    type: 'Film',
    image: 'https://picsum.photos/600/600?random=1'
  },
  {
    id: 'data-viz-dash',
    title: 'Market Sentinel',
    description: 'Real-time stock market visualization dashboard using D3.js.',
    type: 'Code',
    image: 'https://picsum.photos/600/600?random=2'
  },
  {
    id: 'abs-glitch',
    title: 'Abstract Glitch Series',
    description: 'Generative art collection created with p5.js.',
    type: 'Art',
    image: 'https://picsum.photos/600/600?random=3'
  },
  {
    id: 'brand-identity',
    title: 'En Garde Identity',
    description: 'Complete brand overhaul and logo design.',
    type: 'Design',
    image: 'https://picsum.photos/600/600?random=4'
  },
  {
    id: 'llm-chat-ui',
    title: 'ChatStream UI',
    description: 'A React component library for streaming LLM responses.',
    type: 'Code',
    image: 'https://picsum.photos/600/600?random=5'
  },
  {
    id: 'forest-render',
    title: 'The Silent Forest',
    description: 'Photorealistic nature render in Unreal Engine 5.',
    type: 'Art',
    image: 'https://picsum.photos/600/600?random=6'
  }
];
