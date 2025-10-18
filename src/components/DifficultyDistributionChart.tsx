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
    <div>
      <h2>Question Distribution by Difficulty</h2>
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
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          <strong>Easy:</strong> {totalEasy} | 
          <strong> Medium:</strong> {totalMedium} | 
          <strong> Hard:</strong> {totalHard}
        </p>
        <p><strong>Total Questions:</strong> {totalEasy + totalMedium + totalHard}</p>
      </div>
    </div>
  );
};
