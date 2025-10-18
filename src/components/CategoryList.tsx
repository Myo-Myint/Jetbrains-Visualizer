import type { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
}

export const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <div className="category-list">
      <h2>Trivia Categories</h2>
      <p className="count">Found {categories.length} categories</p>
      
      <ul className="categories">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            <span className="category-id">#{category.id}</span>
            <span className="category-name">{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
