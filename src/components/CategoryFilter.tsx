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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategoryId === null
              ? 'text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={selectedCategoryId === null ? { backgroundColor: '#3a5a40' } : {}}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategoryId === category.id
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={selectedCategoryId === category.id ? { backgroundColor: '#3a5a40' } : {}}
          >
            {category.name}
          </button>
        ))}
      </div>
      {selectedCategoryId && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800">
            <span className="font-semibold">Showing:</span>{' '}
            {categories.find(c => c.id === selectedCategoryId)?.name}
          </p>
        </div>
      )}
    </div>
  );
};
