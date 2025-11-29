export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown/HTML content
  date: string;
  tags: string[];
  readTime: string;
  coverImage?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'Art' | 'Film' | 'Code' | 'Design';
  image: string;
  link?: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}