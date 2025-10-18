import { useState, useEffect } from 'react';
import './App.css';
import { fetchCategories } from './services/triviaApi';
import { CategoryList } from './components/CategoryList';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import type { Category } from './types';

function App() {
  // useState hook to manage categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching categories...');
        const data = await fetchCategories();
        
        setCategories(data);
        console.log('Categories loaded:', data.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(errorMessage);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []); // Empty dependency array = run once on mount

  // Conditional rendering based on state
  if (loading) {
    return <Loading message="Fetching categories from Open Trivia DB..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Open Trivia Database Visualizer</h1>
      </header>
      <main>
        <CategoryList categories={categories} />
      </main>
    </div>
  );
}

export default App;
