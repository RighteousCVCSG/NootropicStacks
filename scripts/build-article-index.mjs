import { blogArticles } from '../src/data/blogArticles.js';
import { writeFileSync, mkdirSync } from 'fs';

const index = blogArticles.map(({ slug, title, excerpt, description, publishedDate, readTime, tags, category, bottomLine }) => ({
  // Some articles were authored with `description` instead of `excerpt` — fall back so
  // every card always has summary text to show.
  slug, title, excerpt: excerpt || description || '', publishedDate, readTime, tags: tags || [], category: category || '', bottomLine: bottomLine || ''
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

// Write individual article JSON files for per-slug fetching
mkdirSync('./public/articles', { recursive: true });
for (const article of blogArticles) {
  writeFileSync(`./public/articles/${article.slug}.json`, JSON.stringify(article));
}
console.log('[index] Wrote', blogArticles.length, 'individual article JSON files');
