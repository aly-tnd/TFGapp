/**
 * Genera y descarga un archivo CSV separado por punto y coma (compatible con Excel ES).
 * Incluye BOM UTF-8 para que los acentos se lean correctamente.
 */
export function exportarCSV(datos: Record<string, unknown>[], nombreArchivo: string): void {
  if (!datos.length) return;

  const SEP = ';';
  const cabeceras = Object.keys(datos[0]).join(SEP);
  const filas = datos.map(fila =>
    Object.values(fila)
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(SEP)
  );

  const csv  = '﻿' + [cabeceras, ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = url;
  link.download = `${nombreArchivo}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
