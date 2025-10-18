import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { fetchCategories, fetchAllCategoryCounts } from './services/triviaApi';
import { CategoryDistributionChart } from './components/CategoryDistributionChart';
import { DifficultyDistributionChart } from './components/DifficultyDistributionChart';
import { CategoryFilter } from './components/CategoryFilter';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import type { Category, CategoryCountResponse } from './types';

function App() {
  // useState hooks to manage state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCountResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);

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

  // useMemo to filter category counts based on selected category
  // This avoids recalculating on every render - only when dependencies change
  const filteredCategoryCounts = useMemo(() => {
    if (selectedCategoryId === null) {
      return categoryCounts; // Show all categories
    }
    // Filter to show only the selected category
    return categoryCounts.filter(count => count.category_id === selectedCategoryId);
  }, [categoryCounts, selectedCategoryId]);

  // Handler function for category selection
  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
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
        <CategoryFilter 
          categories={categories}
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
