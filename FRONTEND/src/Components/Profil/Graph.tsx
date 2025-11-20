import type { FC } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineChartProps = {
  chartData: ChartData<'line'>;
  options?: ChartOptions<'line'>;

  height?: number;
  width?: number;

  style?: React.CSSProperties;
};

export const GraphDisplayed: FC<LineChartProps> = ({
  chartData,
  options,
  height = 300,
  style,
}) => {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Match Performance Over Time',
      },
    },
  };

  return (
    <div style={{height, ...style }}>
      <Line
        data={chartData}
        options={options ?? defaultOptions}
      />
    </div>
  );
};
