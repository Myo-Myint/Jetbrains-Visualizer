// Types for the API responses and data structures
export interface Question {
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string; 
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoryApiResponse {
  trivia_categories: Category[];
}

//might need it later
export interface TriviaApiResponse {
  response_code: number;
  results: Question[];
}


//  https://opentdb.com/api_count.php?category=CATEGORY_ID
export interface CategoryCount {
  category_id: number;
  category_question_count: {
    total_question_count: number;
    total_easy_question_count: number;
    total_medium_question_count: number;
    total_hard_question_count: number;
  };
}

