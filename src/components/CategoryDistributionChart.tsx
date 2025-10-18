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

  // Calculate total questions
  const totalQuestions = chartData.reduce((sum, item) => sum + item.questions, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions Distribution by Category</h2>
        <p className="text-sm text-gray-500">
          Showing {chartData.length} {chartData.length === 1 ? 'category' : 'categories'} with {totalQuestions.toLocaleString()} total questions
        </p>
      </div>
      <div className="rounded-lg pt-12 p-4 flex items-center justify-center" style={{ backgroundColor: '#f4f3ee' }}>
        <ResponsiveContainer width="95%" height={450}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={130}
              interval={0}
              tick={{ fontSize: 10, fill: '#374151' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              label={{ 
                value: 'Questions', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#374151', fontWeight: 600, fontSize: 12 } 
              }}
              tick={{ fontSize: 11, fill: '#374151' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(58, 90, 64, 0.1)' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
              itemStyle={{ color: '#3a5a40', fontWeight: 600 }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '24px',
                fontSize: '14px',
                fontWeight: 600
              }}
              iconType="circle"
            />
            <Bar 
              dataKey="questions" 
              fill="#3a5a40"
              name="Number Of Questions" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
