import { Component } from '@angular/core';
import { BarHead } from '../../../shared/components/UI/headers/bar-head/bar-head';
import { Graph } from '../../../shared/components/UI/cards/graph/graph';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  imports: [BarHead, Graph],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly balanceChart = this.lineChart(
    [8200, 8450, 8320, 8790, 9140, 9350, 9680],
    '#2563eb',
    true,
  );
  readonly profitChart: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: this.labels,
      datasets: [
        {
          data: [220, 360, -120, 480, 310, 590, 430],
          backgroundColor: ({ raw }) => (Number(raw) >= 0 ? '#10b981' : '#ef4444'),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: this.options('$'),
  };
  readonly allocationChart: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: {
      labels: ['Forex', 'Crypto', 'Gold', 'Cash'],
      datasets: [
        {
          data: [48, 22, 18, 12],
          backgroundColor: ['#2563eb', '#8b5cf6', '#f59e0b', '#cbd5e1'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 18 } },
      },
    },
  };
  readonly tradesChart = this.lineChart([8, 14, 11, 18, 16, 24, 21], '#8b5cf6');

  private lineChart(data: number[], color: string, fill = false): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            data,
            borderColor: color,
            backgroundColor: `${color}1f`,
            fill,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: this.options(),
    };
  }

  private options<T extends 'line' | 'bar'>(prefix = ''): ChartOptions<T> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: { formattedValue: string }) => `${prefix}${context.formattedValue}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: { beginAtZero: true, border: { display: false }, grid: { color: '#f1f5f9' } },
      },
    } as unknown as ChartOptions<T>;
  }
}
