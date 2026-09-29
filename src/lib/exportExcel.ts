/**
 * exportExcel.ts
 * Client-side Excel export utility using SheetJS (xlsx).
 * Exports any array of flat objects to a formatted .xlsx file.
 */

import * as XLSX from 'xlsx';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Exports a dataset to a formatted .xlsx file and triggers a browser download.
 *
 * @param data     - Array of records (flat objects)
 * @param columns  - Column definitions: { header, key, width }
 * @param filename - Output filename (without extension)
 * @param sheetName - Name of the worksheet tab
 */
export function exportToExcel(
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename = 'export',
  sheetName = 'Sheet1'
) {
  // 1. Build rows: header row first, then data rows in defined column order
  const headerRow = columns.map((col) => col.header);
  const dataRows = data.map((record) =>
    columns.map((col) => {
      const val = record[col.key];
      // Normalise timestamps (milliseconds) to readable date strings
      if (col.key === 'createdAt' || col.key === 'updatedAt') {
        if (typeof val === 'number' && val > 1_000_000_000_000) {
          return new Date(val).toLocaleString();
        }
      }
      return val ?? '';
    })
  );

  const worksheetData = [headerRow, ...dataRows];

  // 2. Create worksheet and set column widths
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  ws['!cols'] = columns.map((col) => ({ wch: col.width ?? 20 }));

  // 3. Style header row (bold) — supported by xlsx-style, works in basic xlsx too
  const headerStyle = {
    font: { bold: true, color: { rgb: '000000' } },
    fill: { fgColor: { rgb: '8DB833' } }, // SANEX brand green
    alignment: { horizontal: 'center' },
  };
  columns.forEach((_, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle;
    }
  });

  // 4. Create workbook and append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // 5. Trigger download
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Convenience: export all bookings with standard SANEX column layout.
 */
export function exportBookingsToExcel(bookings: any[], label = 'all') {
  const columns: ExportColumn[] = [
    { header: 'Reference ID',      key: 'id',              width: 22 },
    { header: 'Customer Name',     key: 'customerName',    width: 25 },
    { header: 'Email',             key: 'email',           width: 30 },
    { header: 'Phone',             key: 'phone',           width: 18 },
    { header: 'Service Type',      key: 'serviceType',     width: 30 },
    { header: 'Status',            key: 'status',          width: 14 },
    { header: 'Appointment Date',  key: 'appointmentDate', width: 20 },
    { header: 'Preferred Time',    key: 'preferredTime',   width: 16 },
    { header: 'Description',       key: 'description',     width: 45 },
    { header: 'Location URL',      key: 'locationUrl',     width: 40 },
    { header: 'Referral Source',   key: 'referralSource',  width: 22 },
    { header: 'Submitted At',      key: 'createdAt',       width: 22 },
  ];

  const dateStamp = new Date().toISOString().slice(0, 10);
  const filename = `SANEX_Bookings_${label}_${dateStamp}`;

  exportToExcel(bookings, columns, filename, 'Service Requests');
}
