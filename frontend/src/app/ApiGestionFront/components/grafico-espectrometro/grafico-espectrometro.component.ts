import {
  Component, Input, OnChanges, SimpleChanges,
  AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart, BarController, BarElement,
  CategoryScale, LinearScale, Tooltip, Legend, Title
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

@Component({
  selector: 'app-grafico-espectrometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-espectrometro.component.html',
  styleUrls: ['./grafico-espectrometro.component.scss']
})
export class GraficoEspectrometroComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() espectrometroId!: string;
  @Input() nombreEspectrometro!: string;
  @Input() sondas: string[] = [];
  /** Registros del usuario; proporcionados por el componente padre */
  @Input() registros: any[] = [];

  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private canvasListo = false;

  ngAfterViewInit() {
    this.canvasListo = true;
    this.renderChart();
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.canvasListo) {
      this.renderChart();
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private renderChart() {
    const conteosPorSonda = this.sondas.map(sonda =>
      this.registros.filter(r =>
        (r.espectrometro_id === this.espectrometroId || r.espectrometro === this.nombreEspectrometro)
        && r.sonda === sonda
      ).length
    );

    const colores = this.sondas.map((_, i) => `hsl(${(i * 47) % 360}, 65%, 55%)`);

    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.sondas,
        datasets: [{
          label: 'Muestras procesadas',
          data: conteosPorSonda,
          backgroundColor: colores,
          borderColor: colores.map(c => c.replace('55%', '40%')),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Uso de sondas — ${this.nombreEspectrometro}`,
            font: { size: 14 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} muestra${ctx.parsed.y !== 1 ? 's' : ''}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Sonda' },
            ticks: { maxRotation: 35, font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'N.º de muestras' },
            ticks: { stepSize: 1, precision: 0 }
          }
        }
      }
    });
  }
}
