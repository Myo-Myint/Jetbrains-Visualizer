import { useState, useEffect } from 'react';
import './App.css';
import { fetchCategories, fetchAllCategoryCounts } from './services/triviaApi';
import { CategoryList } from './components/CategoryList';
import { CategoryDistributionChart } from './components/CategoryDistributionChart';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import type { Category, CategoryCountResponse } from './types';

function App() {
  // useState hooks to manage state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCountResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Step 1: Fetch categories
        console.log('Fetching categories...');
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        console.log('Categories loaded:', categoriesData.length);
        
        // Step 2: Fetch question counts for all categories
        console.log('Fetching category counts...');
        const countsData = await fetchAllCategoryCounts(categoriesData);
        setCategoryCounts(countsData);
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

  // Conditional rendering based on state
  if (loading) {
    return <Loading message="Fetching trivia data... This may take a moment." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Open Trivia Database Visualizer</h1>
        <p>Visualizing {categories.length} categories</p>
      </header>
      <main>
        <CategoryDistributionChart 
          categories={categories} 
          categoryCounts={categoryCounts} 
        />
        <CategoryList categories={categories} />
      </main>
    </div>
  );
}

export default App;
