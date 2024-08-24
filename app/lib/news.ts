const NEWS_API_KEY = '0cb5981728ad41e08c68600b27b54fca';
const NEWS_BASE_URL = 'https://newsapi.org/v2';

export async function fetchTopHeadlines() {
  const response = await fetch(`${NEWS_BASE_URL}/top-headlines?country=us&apiKey=${NEWS_API_KEY}`);
  if (!response.ok) {
    throw new Error('Top headlines data not available');
  }
  return response.json();
}

export async function fetchNewsByQuery(query: string) {
  const response = await fetch(`${NEWS_BASE_URL}/everything?q=${query}&apiKey=${NEWS_API_KEY}`);
  if (!response.ok) {
    throw new Error('News data not available');
  }
  return response.json();
}
