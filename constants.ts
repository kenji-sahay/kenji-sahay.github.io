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
python calculate_crs_spans_5_teacher_5.py --dataset all --output_dir ./processed_data
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

It worked.
<br><br>

We had the training data.
<br><br>

Features were extracted.
<br><br>

Labels were aligned.
<br><br>

Everything was saved.
<br><br>

**Now It Was Time To Build The Classifier.**

---

**Code Reference:** \`calculate_crs_spans_5_teacher_5.py\`
  `
},
  {
    id: 'math-transformers',
    title: 'The Math Behind Transformers',
    excerpt: 'Understanding Self-Attention and Positional Encodings from first principles.',
    date: '2024-01-05',
    readTime: '15 min read',
    tags: ['Math', 'Deep Learning'],
    content: `
# Attention is All You Need

Let's look at the core equation:

$$ Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V $$

The scaling factor $\\sqrt{d_k}$ is crucial for gradient stability. Without it, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients.
    `
  },
  {
    id: 'digital-art-process',
    title: 'My Digital Art Workflow',
    excerpt: 'From Blender to Photoshop: A breakdown of my cyberpunk city renders.',
    date: '2024-01-20',
    readTime: '6 min read',
    tags: ['Art', 'Blender', 'Design'],
    content: `# Cyberpunk Aesthetics\n\nCreating a moody atmosphere requires careful lighting setup. I usually start with a volumetric fog pass...`
  },
  {
    id: 'internship-reflections',
    title: 'What I Learned as a Data Engineering Intern',
    excerpt: 'Soft skills, git hygiene, and the importance of documentation.',
    date: '2024-02-01',
    readTime: '8 min read',
    tags: ['Internship', 'Career'],
    content: `# Beyond the Code\n\nThe most valuable lesson wasn't Python, it was communication. Daily standups taught me to be concise.`
  },
  {
    id: 'rag-optimization-2',
    title: 'Advanced RAG: HyDE Strategies',
    excerpt: 'Implementing Hypothetical Document Embeddings to improve recall.',
    date: '2023-10-20',
    readTime: '10 min read',
    tags: ['RAG', 'LLM'],
    content: '# HyDE Explained\n\nHyDE generates a fake answer using an LLM, then embeds that answer to find real documents...'
  },
  {
    id: 'threejs-shaders',
    title: 'Shader Magic with GLSL',
    excerpt: 'Writing custom fragment shaders for liquid metal effects.',
    date: '2023-11-15',
    readTime: '7 min read',
    tags: ['Graphics', 'Three.js'],
    content: '# The Power of GLSL\n\nFragment shaders run for every pixel...'
  },
  {
    id: 'career-pivot',
    title: 'From Physics to Data Science',
    excerpt: 'How my background in academic physics helps with deep learning research.',
    date: '2024-02-10',
    readTime: '6 min read',
    tags: ['Career', 'Math'],
    content: '# Transferable Skills\n\nLinear algebra is everywhere...'
  },
  {
    id: 'react-performance',
    title: 'React Render Optimization',
    excerpt: 'Using useMemo and useCallback effectively in large dashboards.',
    date: '2024-02-15',
    readTime: '9 min read',
    tags: ['React', 'Internship'],
    content: '# Stop Re-rendering\n\nCheck your dependency arrays!'
  },
  {
    id: 'future-of-ai',
    title: 'Agents are the Next Big Thing',
    excerpt: 'Why autonomous agents will replace simple chatbots.',
    date: '2024-03-01',
    readTime: '11 min read',
    tags: ['AI', 'Gemini'],
    content: '# Agentic Workflows\n\nInstead of zero-shot, we give the model tools...'
  },
  {
    id: 'design-systems',
    title: 'Building a Design System from Scratch',
    excerpt: 'Creating a consistent UI language for En Garde Data.',
    date: '2024-03-05',
    readTime: '8 min read',
    tags: ['Design', 'React'],
    content: '# Tokens and Components\n\nConsistency is key...'
  }
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