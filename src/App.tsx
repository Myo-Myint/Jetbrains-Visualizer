import { useState, useEffect } from 'react';
import './App.css';
import { fetchCategories } from './services/triviaApi';
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

  if (loading) {
    return (
      <div className="app">
        <h1>Loading...</h1>
        <p>Fetching categories from Open Trivia DB...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <h1>Error</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Trivia Categories</h1>
      <p>Found {categories.length} categories</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Categories List:</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          {categories.map((category) => (
            <li key={category.id}>
              <strong>ID {category.id}:</strong> {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
