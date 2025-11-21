import { BlogPost, PortfolioItem } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'rag-optimization',
    title: 'Optimizing RAG Pipelines for production',
    excerpt: 'A deep dive into vector database indexing strategies and re-ranking models during my internship.',
    date: '2023-10-15',
    readTime: '8 min read',
    tags: ['RAG', 'LLM', 'Internship'],
    coverImage: 'https://picsum.photos/800/400?grayscale',
    content: `
# Optimizing RAG Pipelines

Retrieval-Augmented Generation (RAG) is the cornerstone of modern enterprise LLM applications. During my recent internship, I faced significant latency issues when scaling our knowledge base to millions of vectors.

## The Challenge
Standard cosine similarity search was taking upwards of 500ms.

## The Solution
We implemented a two-stage retrieval process:
1. **HNSW Indexing**: Approximate nearest neighbor search for speed.
2. **Cross-Encoder Re-ranking**: High-precision sorting of the top 50 results.

\`\`\`python
# Example of a simple reranker implementation
from sentence_transformers import CrossEncoder
model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
scores = model.predict(pairs)
\`\`\`

This reduced latency by 40% while improving retrieval accuracy (NDCG@10) by 15%.
    `
  },
  {
    id: 'threejs-particles',
    title: 'Building High-Performance Particle Systems',
    excerpt: 'How I optimized 10,000 interactive particles in React Three Fiber without dropping frames.',
    date: '2023-11-02',
    readTime: '5 min read',
    tags: ['Graphics', 'Three.js', 'React'],
    coverImage: 'https://picsum.photos/800/401?blur',
    content: `
# 10,000 Particles at 60FPS

Using \`PointsMaterial\` is okay for small systems, but for massive scale, you need custom shaders and buffer geometries.

## InstancedMesh vs Points
For complex shapes, \`InstancedMesh\` is king. For simple dots, stick to \`Points\` but manage your own \`Float32Array\` positions buffer.

\`\`\`javascript
// Basic buffer geometry setup
const positions = new Float32Array(count * 3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
\`\`\`

> "Performance is not an afterthought, it's a feature."
    `
  },
  {
    id: 'gemini-multimodal',
    title: 'Exploring Gemini 2.5 Multimodal Capabilities',
    excerpt: 'Using the new Gemini API to analyze video streams in real-time for sentiment analysis.',
    date: '2023-12-10',
    readTime: '12 min read',
    tags: ['Gemini', 'AI', 'Video'],
    coverImage: 'https://picsum.photos/800/402',
    content: `
# Vision is the Future

The new Gemini 2.5 Flash model offers incredible speed for video tokenization. I built a simple app that watches a webcam feed and critiques my posture.

## Demo Video
<iframe width="100%" height="400" src="https://www.youtube.com/embed/LXb3EKWsInQ" title="Gemini AI Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Key Takeaways
- **Latency**: Extremely low, suitable for real-time interactions.
- **Context Window**: Large enough to hold minutes of video history.
    `
  },
  {
    id: 'math-transformers',
    title: 'The Math Behind Transformers',
    excerpt: 'Understanding Self-Attention and Positional Encodings from first principles.',
    date: '2024-01-05',
    readTime: '15 min read',
    tags: ['Math', 'Deep Learning'],
    coverImage: 'https://picsum.photos/800/403',
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
    coverImage: 'https://picsum.photos/800/404',
    content: `# Cyberpunk Aesthetics\n\nCreating a moody atmosphere requires careful lighting setup. I usually start with a volumetric fog pass...`
  },
  {
    id: 'internship-reflections',
    title: 'What I Learned as a Data Engineering Intern',
    excerpt: 'Soft skills, git hygiene, and the importance of documentation.',
    date: '2024-02-01',
    readTime: '8 min read',
    tags: ['Internship', 'Career'],
    coverImage: 'https://picsum.photos/800/405',
    content: `# Beyond the Code\n\nThe most valuable lesson wasn't Python, it was communication. Daily standups taught me to be concise.`
  },
  // Duplicates for Pagination Demo
  {
    id: 'rag-optimization-2',
    title: 'Advanced RAG: HyDE Strategies',
    excerpt: 'Implementing Hypothetical Document Embeddings to improve recall.',
    date: '2023-10-20',
    readTime: '10 min read',
    tags: ['RAG', 'LLM'],
    coverImage: 'https://picsum.photos/800/406',
    content: '# HyDE Explained\n\nHyDE generates a fake answer using an LLM, then embeds that answer to find real documents...'
  },
  {
    id: 'threejs-shaders',
    title: 'Shader Magic with GLSL',
    excerpt: 'Writing custom fragment shaders for liquid metal effects.',
    date: '2023-11-15',
    readTime: '7 min read',
    tags: ['Graphics', 'Three.js'],
    coverImage: 'https://picsum.photos/800/407',
    content: '# The Power of GLSL\n\nFragment shaders run for every pixel...'
  },
  {
    id: 'career-pivot',
    title: 'From Physics to Data Science',
    excerpt: 'How my background in academic physics helps with deep learning research.',
    date: '2024-02-10',
    readTime: '6 min read',
    tags: ['Career', 'Math'],
    coverImage: 'https://picsum.photos/800/408',
    content: '# Transferable Skills\n\nLinear algebra is everywhere...'
  },
  {
    id: 'react-performance',
    title: 'React Render Optimization',
    excerpt: 'Using useMemo and useCallback effectively in large dashboards.',
    date: '2024-02-15',
    readTime: '9 min read',
    tags: ['React', 'Internship'],
    coverImage: 'https://picsum.photos/800/409',
    content: '# Stop Re-rendering\n\nCheck your dependency arrays!'
  },
  {
    id: 'future-of-ai',
    title: 'Agents are the Next Big Thing',
    excerpt: 'Why autonomous agents will replace simple chatbots.',
    date: '2024-03-01',
    readTime: '11 min read',
    tags: ['AI', 'Gemini'],
    coverImage: 'https://picsum.photos/800/410',
    content: '# Agentic Workflows\n\nInstead of zero-shot, we give the model tools...'
  },
  {
    id: 'design-systems',
    title: 'Building a Design System from Scratch',
    excerpt: 'Creating a consistent UI language for En Garde Data.',
    date: '2024-03-05',
    readTime: '8 min read',
    tags: ['Design', 'React'],
    coverImage: 'https://picsum.photos/800/411',
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