import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-exportar-csv',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-raised-button style="background-color: #2e7d32; color: white;" (click)="exportar()">
      <mat-icon>download</mat-icon> {{ textoBoton }}
    </button>
  `
})
export class ExportarCsvComponent {
  @Input() datos: any[] = []; // Recibe cualquier array de datos
  @Input() nombreArchivo: string = 'datos.csv'; // Nombre por defecto
  @Input() textoBoton: string = 'Exportar CSV';

  exportar() {
    if (!this.datos || this.datos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = Object.keys(this.datos[0]);
    
    // Cambiamos la coma por PUNTO Y COMA (;)
    const rows = this.datos.map(row => 
      headers.map(header => row[header]).join(';') 
    );

    // Añadimos el separador de filas y el código BOM (\uFEFF) para los acentos en Excel
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', this.nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}