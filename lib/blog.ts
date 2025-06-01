import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export async function getAllPosts(): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: slug,
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || '',
      content,
      coverImage: data.image || '',
      tags: data.tags || [],
      readingTime: `${Math.ceil(content.split(' ').length / 200)} min`
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: slug,
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || '',
      content,
      coverImage: data.image || '',
      tags: data.tags || [],
      readingTime: `${Math.ceil(content.split(' ').length / 200)} min`
    };
  } catch (e) {
    return undefined;
  }
}