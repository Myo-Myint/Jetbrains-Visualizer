import type { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
}

export const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">All Categories</h2>
      <p className="text-gray-600 mb-4">Found {categories.length} categories</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <span className="text-xs text-gray-500 font-medium">#{category.id}</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
