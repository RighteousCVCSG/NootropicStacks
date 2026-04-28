import { blogArticles } from '../src/data/blogArticles.js';
import { writeFileSync } from 'fs';

const index = blogArticles.map(({ slug, title, excerpt, publishedDate, readTime, tags, category, bottomLine }) => ({
  slug, title, excerpt: excerpt || '', publishedDate, readTime, tags: tags || [], category: category || '', bottomLine: bottomLine || ''
}));

const content = `export const blogArticlesIndex = ${JSON.stringify(index, null, 2)};

export function getRecentArticlesMeta(count = 100) {
  return [...blogArticlesIndex]
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, count);
}
`;

writeFileSync('./src/data/blogArticlesIndex.js', content);
console.log('[index] Built article index:', index.length, 'articles');
