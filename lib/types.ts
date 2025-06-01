export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  readingTime: string;
}

export interface App {
  id: string;
  title: string;
  slug: string;
  description: string;
  appStoreLink: string;
  icon: string;
  screenshots: string[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  technologies: string[];
  stats: {
    downloads: string;
    rating: number;
    reviews: number;
  };
}