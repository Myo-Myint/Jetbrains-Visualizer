import type { CategoryApiResponse, TriviaApiResponse, Category, Question } from '../types';

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
