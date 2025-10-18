import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CategoryDistributionChartProps } from '../types';


export const CategoryDistributionChart = ({ categories, categoryCounts }: CategoryDistributionChartProps) => {
  // Combine category names with their counts for the chart
  const chartData = categoryCounts.map(countData => {
    const category = categories.find(cat => cat.id === countData.category_id);
    return {
      name: category?.name || `Category ${countData.category_id}`,
      questions: countData.category_question_count.total_question_count,
      categoryId: countData.category_id
    };
  }).sort((a, b) => b.questions - a.questions); // Sort by question count descending

  return (
    <div>
      <h2>Question Distribution by Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={120}
            interval={0}
            style={{ fontSize: '12px' }}
          />
          <YAxis label={{ value: 'Number of Questions', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="questions" fill="#8884d8" name="Total Questions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
