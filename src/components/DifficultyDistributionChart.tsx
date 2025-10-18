import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DifficultyDistributionChartProps } from '../types';
import type { PieLabelRenderProps } from 'recharts';
import { COLORS } from '../types';

export const DifficultyDistributionChart = ({ categoryCounts }: DifficultyDistributionChartProps) => {
  // Aggregate difficulty counts across all categories
  const totalEasy = categoryCounts.reduce((sum, cat) => 
    sum + cat.category_question_count.total_easy_question_count, 0);
  const totalMedium = categoryCounts.reduce((sum, cat) => 
    sum + cat.category_question_count.total_medium_question_count, 0);
  const totalHard = categoryCounts.reduce((sum, cat) => 
    sum + cat.category_question_count.total_hard_question_count, 0);

  // Format data for pie chart
  const chartData = [
    { name: 'Easy', value: totalEasy, color: COLORS.easy },
    { name: 'Medium', value: totalMedium, color: COLORS.medium },
    { name: 'Hard', value: totalHard, color: COLORS.hard }
  ];
  // Custom label to show percentage
  const renderLabel = (props: PieLabelRenderProps) => {
    const total = totalEasy + totalMedium + totalHard;
    const value = typeof props.value === 'number' ? props.value : Number(props.value) || 0;
    const ratio = typeof props.percent === 'number' ? props.percent : (total > 0 ? value / total : 0);
    return `${(ratio * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions Distribution by Difficulty</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-lg border" style={{ backgroundColor: '#8cb36920', borderColor: '#8cb369' }}>
          <p className="text-sm font-medium" style={{ color: '#6a8f52' }}>Easy</p>
          <p className="text-2xl font-bold" style={{ color: '#5a7e42' }}>{totalEasy}</p>
        </div>
        <div className="p-3 rounded-lg border" style={{ backgroundColor: '#ffd97d20', borderColor: '#ffd97d' }}>
          <p className="text-sm font-medium" style={{ color: '#d9b558' }}>Medium</p>
          <p className="text-2xl font-bold" style={{ color: '#c9a548' }}>{totalMedium}</p>
        </div>
        <div className="p-3 rounded-lg border" style={{ backgroundColor: '#ff9b8520', borderColor: '#ff9b85' }}>
          <p className="text-sm font-medium" style={{ color: '#e67a66' }}>Hard</p>
          <p className="text-2xl font-bold" style={{ color: '#d96b57' }}>{totalHard}</p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600">
          <span className="font-semibold">Total Questions:</span>{' '}
          <span className="text-lg font-bold text-gray-900">{totalEasy + totalMedium + totalHard}</span>
        </p>
      </div>
    </div>
  );
};
