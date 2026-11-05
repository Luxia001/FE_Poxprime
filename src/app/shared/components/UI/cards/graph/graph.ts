import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  styleUrl: './graph.css',
  templateUrl: './graph.html',
})
export class Graph implements AfterViewInit {
  @ViewChild('chartCanvas', { static: true }) private chartCanvas!: ElementRef<HTMLCanvasElement>;
  readonly title = input('Chart');
  readonly value = input('');
  readonly change = input('');
  readonly changePositive = input(true);
  readonly configuration = input<ChartConfiguration>({
    type: 'line',
    data: { labels: [], datasets: [] },
  });
  private chart?: Chart;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, this.configuration());
  }
}
