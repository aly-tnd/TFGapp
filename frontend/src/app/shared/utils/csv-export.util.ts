/**
 * Genera y descarga un archivo CSV a partir de un array de objetos.
 * Las claves del primer objeto se usan como cabeceras.
 */
export function exportarCSV(datos: Record<string, unknown>[], nombreArchivo: string): void {
  if (!datos.length) return;

  const cabeceras = Object.keys(datos[0]).join(',');
  const filas = datos.map(fila =>
    Object.values(fila)
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );

  const csv  = [cabeceras, ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = url;
  link.download = `${nombreArchivo}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
