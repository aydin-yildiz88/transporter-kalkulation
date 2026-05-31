const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\aydin.yildiz\\.claude\\uploads\\db892a50-e6fa-4a8c-93c1-2570e398597f\\23ad0d9a-Transporter_Kalkulation_XP13.xlsx';

try {
  const workbook = XLSX.readFile(filePath);

  console.log('=== SHEET NAMES ===');
  console.log(workbook.SheetNames);

  const allSheets = {};

  workbook.SheetNames.forEach((sheetName) => {
    console.log(`\n=== SHEET: ${sheetName} ===`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    allSheets[sheetName] = data;

    console.log(`Rows: ${data.length}, Columns: ${data[0] ? data[0].length : 0}`);
    console.log('Content (first 30 rows):');
    data.slice(0, 30).forEach((row, idx) => {
      const rowStr = row.slice(0, 15).map(v => String(v).substring(0, 20)).join(' | ');
      console.log(`[${idx}]: ${rowStr}`);
    });
  });

  // Save as JSON
  fs.writeFileSync('./public/excel-data.json', JSON.stringify(allSheets, null, 2));
  console.log('\n✓ Datei gespeichert: public/excel-data.json');

} catch (error) {
  console.error('Fehler:', error.message);
}
