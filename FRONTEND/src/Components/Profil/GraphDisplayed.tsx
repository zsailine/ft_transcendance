import { GraphDisplayed } from './Graph';
import type { ChartData } from 'chart.js';

const data: ChartData<'line'> = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
  datasets: [
    {
      label: 'games played',
      data: [100, 140, 180, 160, 220],
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.3)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export default function Dashboard() {
  return (
    <div>
      <h2>Match stats</h2>

      <GraphDisplayed
        chartData={data}
        height={400}
      />
    </div>
  );
}
