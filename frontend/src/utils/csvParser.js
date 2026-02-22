/**
 * csvParser.js — Parse CSV/JSON files for bulk station import
 */
export function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    const obj = { _rowIndex: index + 1 };
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

export function parseJSON(text) {
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : data.stations || [];
  } catch {
    return null;
  }
}

export function validateStationData(rows) {
  const errors = [];
  const warnings = [];
  const codes = [];

  rows.forEach((row, i) => {
    const rowNum = i + 1;
    if (!row.name) errors.push({ row: rowNum, field: 'name', message: `Row ${rowNum}: Missing station name` });
    if (!row.code) errors.push({ row: rowNum, field: 'code', message: `Row ${rowNum}: Missing station code` });
    else {
      if (codes.includes(row.code.toUpperCase())) {
        errors.push({ row: rowNum, field: 'code', message: `Row ${rowNum}: Duplicate code "${row.code}"` });
      }
      codes.push(row.code.toUpperCase());
    }
    if (!row.line) warnings.push({ row: rowNum, field: 'line', message: `Row ${rowNum}: No line specified` });
  });

  return { errors, warnings, isValid: errors.length === 0 };
}