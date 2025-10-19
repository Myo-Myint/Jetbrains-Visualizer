import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { fetchCategories, fetchAllCategoryCounts, fetchQuestions } from './services/triviaApi';
import { CategoryDistributionChart } from './components/CategoryDistributionChart';
import { DifficultyDistributionChart } from './components/DifficultyDistributionChart';
import { CategoryFilter } from './components/CategoryFilter';
import { ModeSelector } from './components/ModeSelector';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import type { Category, CategoryCountResponse, Question } from './types';

function App() {
  // useState hooks to manage state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCountResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  
  // Mode selector state
  const [analysisMode, setAnalysisMode] = useState<'database' | 'sample'>('database');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [sampleCounts, setSampleCounts] = useState<CategoryCountResponse[]>([]);

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadingProgress(0);
        
        // Step 1: Fetch categories
        setLoadingMessage('Fetching categories...');
        setLoadingProgress(10);
        console.log('Fetching categories...');
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setLoadingProgress(30);
        console.log('Categories loaded:', categoriesData.length);
        
        // Step 2: Fetch question counts for all categories
        setLoadingMessage('Fetching question counts...');
        console.log('Fetching category counts...');
        const countsData = await fetchAllCategoryCounts(categoriesData, (current, total) => {
          // Calculate progress: 30% base + 70% for fetching counts
          const fetchProgress = (current / total) * 70;
          setLoadingProgress(30 + fetchProgress);
          setLoadingMessage(`Fetching questions from the api...`);
        });
        setCategoryCounts(countsData);
        setLoadingProgress(100);
        setLoadingMessage('Complete!');
        
        console.log('Category counts loaded:', countsData.length);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array = run once on mount

  // Get the appropriate data based on mode
  const displayCounts = analysisMode === 'database' ? categoryCounts : sampleCounts;
  
  // Calculate total questions for info display
  const totalQuestions = displayCounts.reduce((sum, cat) => sum + cat.category_question_count.total_question_count, 0);

  // Get available categories based on current mode
  // In sample mode, only show categories that were actually fetched
  const availableCategories = useMemo(() => {
    if (analysisMode === 'database') {
      return categories; // Show all categories
    } else {
      // In sample mode, only show categories that have questions in the sample
      const sampleCategoryIds = new Set(sampleCounts.map(count => count.category_id));
      return categories.filter(cat => sampleCategoryIds.has(cat.id));
    }
  }, [analysisMode, categories, sampleCounts]);

  // useMemo to filter category counts based on selected category
  // This avoids recalculating on every render - only when dependencies change
  const filteredCategoryCounts = useMemo(() => {
    if (selectedCategoryId === null) {
      return displayCounts; // Show all categories
    }
    // Filter to show only the selected category
    return displayCounts.filter(count => count.category_id === selectedCategoryId);
  }, [displayCounts, selectedCategoryId]);

  // Handler function for category selection
  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  // Handler for mode change
  const handleModeChange = (mode: 'database' | 'sample') => {
    setAnalysisMode(mode);
    setSelectedCategoryId(null); // Reset filter when switching modes
  };

  // Handler for analyzing sample questions
  const handleAnalyzeSample = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setLoadingMessage('Fetching sample questions...');
      setLoadingProgress(0);
      
      // Since we're limiting to 50 max, only one batch needed
      setLoadingMessage(`Fetching ${questionCount} questions...`);
      setLoadingProgress(50);
      
      const allQuestions: Question[] = [];
      
      try {
        const questions = await fetchQuestions(questionCount);
        allQuestions.push(...questions);
      } catch (fetchError) {
        console.error(`Error fetching questions:`, fetchError);
        throw fetchError;
      }
      
      // Convert questions to count format
      const countMap = new Map<number, { easy: number; medium: number; hard: number; total: number }>();
      
      allQuestions.forEach((question) => {
        // Find category ID from category name
        const category = categories.find(cat => cat.name === question.category);
        if (category) {
          const current = countMap.get(category.id) || { easy: 0, medium: 0, hard: 0, total: 0 };
          current.total++;
          if (question.difficulty === 'easy') current.easy++;
          else if (question.difficulty === 'medium') current.medium++;
          else if (question.difficulty === 'hard') current.hard++;
          countMap.set(category.id, current);
        }
      });
      
      // Convert map to CategoryCountResponse format
      const sampleCountsData: CategoryCountResponse[] = Array.from(countMap.entries()).map(([categoryId, counts]) => ({
        category_id: categoryId,
        category_question_count: {
          total_question_count: counts.total,
          total_easy_question_count: counts.easy,
          total_medium_question_count: counts.medium,
          total_hard_question_count: counts.hard
        }
      }));
      
      setSampleCounts(sampleCountsData);
      setSelectedCategoryId(null); // Reset filter when analyzing new sample
      setLoadingProgress(100);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sample';
      setError(errorMessage);
      console.error('Error fetching sample:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Conditional rendering based on state
  if (loading) {
    return <Loading message={loadingMessage} progress={loadingProgress} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f3ee' }}>
      <header className="text-white shadow-lg" style={{ backgroundColor: '#3a5a40' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">Open Trivia Database Visualizer</h1>
          <p className="text-gray-100 text-lg">
            Visualizing the Open Trivia Database distributions by categories and question .
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ModeSelector
          mode={analysisMode}
          questionCount={questionCount}
          onModeChange={handleModeChange}
          onQuestionCountChange={setQuestionCount}
          onAnalyze={handleAnalyzeSample}
          isAnalyzing={isAnalyzing}
          totalQuestions={totalQuestions}
        />
        <CategoryFilter 
          categories={availableCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryDistributionChart 
            categories={categories} 
            categoryCounts={filteredCategoryCounts} 
          />
          <DifficultyDistributionChart 
            categoryCounts={filteredCategoryCounts} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
