import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}: CategoryFilterProps) => {
  return (
    <div>
      <h3>Filter by Category</h3>
      <div>
        <button 
          onClick={() => onSelectCategory(null)}
          disabled={selectedCategoryId === null}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            disabled={selectedCategoryId === category.id}
          >
            {category.name}
          </button>
        ))}
      </div>
      {selectedCategoryId && (
        <p>
          Showing: {categories.find(c => c.id === selectedCategoryId)?.name}
        </p>
      )}
    </div>
  );
};
