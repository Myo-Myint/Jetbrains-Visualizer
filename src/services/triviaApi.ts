import type { 
  CategoryApiResponse, 
  TriviaApiResponse, 
  Category, 
  Question,
  CategoryCountResponse 
} from '../types';

const BASE_URL = 'https://opentdb.com';

/**
 * Fetch all available categories from the API
 * Endpoint: https://opentdb.com/api_category.php
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/api_category.php`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  const data: CategoryApiResponse = await response.json();
  return data.trivia_categories;
};

/**
 * Fetch question count for a specific category
 * Endpoint: https://opentdb.com/api_count.php?category=CATEGORY_ID
 * 
 * @param categoryId - The category ID to get question count for
 */
export const fetchCategoryCount = async (categoryId: number): Promise<CategoryCountResponse> => {
  const response = await fetch(`${BASE_URL}/api_count.php?category=${categoryId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category count: ${response.status}`);
  }
  
  const data: CategoryCountResponse = await response.json();
  return data;
};

/**
 * Fetch question counts for all categories
 * Makes multiple API calls with rate limiting
 * 
 * @param categories - Array of categories to fetch counts for
 * @param onProgress - Optional callback to track progress (current, total)
 */
export const fetchAllCategoryCounts = async (
  categories: Category[], 
  onProgress?: (current: number, total: number) => void
): Promise<CategoryCountResponse[]> => {
  const counts: CategoryCountResponse[] = [];
  const total = categories.length;
  
  for (let i = 0; i < total; i++) {
    // Add small delay to respect rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    try {
      const count = await fetchCategoryCount(categories[i].id);
      counts.push(count);
      
      // Report progress
      if (onProgress) {
        onProgress(i + 1, total);
      }
    } catch (error) {
      console.error(`Failed to fetch count for category ${categories[i].id}:`, error);
      // Continue with other categories even if one fails
    }
  }
  
  return counts;
};





/**
 * Fetch questions from the API
 * Endpoint: https://opentdb.com/api.php
 * 
 * @param amount - Number of questions to fetch (max 50 per request)
 * @param category - Optional category ID to filter
 * @param difficulty - Optional difficulty level
 */
export const fetchQuestions = async (
  amount: number = 50,
  category?: number,
  difficulty?: 'easy' | 'medium' | 'hard'
): Promise<Question[]> => {
  let url = `${BASE_URL}/api.php?amount=${amount}`;
  
  if (category) {
    url += `&category=${category}`;
  }
  
  if (difficulty) {
    url += `&difficulty=${difficulty}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.status}`);
  }
  
  const data: TriviaApiResponse = await response.json();
  
  // Handle API response codes
  switch (data.response_code) {
    case 0:
      return data.results;
    case 1:
      console.warn('Not enough questions available');
      return data.results || [];
    case 2:
      throw new Error('Invalid parameters');
    case 5:
      throw new Error('Rate limit exceeded. Please wait.');
    default:
      throw new Error(`API error: ${data.response_code}`);
  }
};
