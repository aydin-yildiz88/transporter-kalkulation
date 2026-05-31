import { CalculationSummary } from '../types/calculations';
import { formatters } from '../utils/formatters';

/**
 * Export Service für PDF und Excel
 * Phase 7: Reporting & Export
 */

export class ExportService {
  /**
   * Export zu CSV (für Excel)
   */
  static exportToCSV(summary: CalculationSummary): string {
    const lines: string[] = [];

    // Header
    lines.push('LKW-Transporter Kalkulation');
    lines.push(`Fahrzeug,${summary.vehicle.name}`);
    lines.push(`Kennzeichen,${summary.vehicle.registration}`);
    lines.push('');

    // Nebenrechnungen
    lines.push('NEBENRECHNUNGEN');
    lines.push('Kostenart,Betrag,Einheit');
    lines.push(`Treibstoffkosten pro Jahr,${summary.supplementary.annualFuelCosts},EUR`);
    lines.push(`Öl pro Jahr,${summary.supplementary.annualOilCosts},EUR`);
    lines.push(`Reifen pro Jahr,${summary.supplementary.annualTireCosts},EUR`);
    lines.push(`Reparaturen pro Jahr,${summary.supplementary.annualRepairCosts},EUR`);
    lines.push(`Abschreibung pro Jahr,${summary.supplementary.depreciationPerYear},EUR`);
    lines.push(`Versicherung pro Jahr,${summary.supplementary.annualInsuranceCosts},EUR`);
    lines.push('');

    // Splitsatz
    lines.push('SPLITSATZ');
    lines.push('Kennwert,Betrag,Einheit');
    lines.push(`Kosten pro KM,${summary.splitRate.costPerKM},EUR/km`);
    lines.push(`Kosten pro Stunde,${summary.splitRate.costPerHour},EUR/h`);
    lines.push(`Gesamtkosten pro Jahr,${summary.splitRate.totalAnnualCosts},EUR`);
    lines.push('');

    // Aufträge
    if (summary.orders.length > 0) {
      lines.push('AUFTRÄGE');
      lines.push('Route,Kilometer,Kosten,Erlös,Gewinn,Marge %');
      summary.orders.forEach((order) => {
        lines.push(
          `${order.route},${order.distance},${order.directCosts},${order.revenue},${order.profit},${order.profitMargin}`
        );
      });
    }

    return lines.join('\n');
  }

  /**
   * Export zu JSON
   */
  static exportToJSON(summary: CalculationSummary): string {
    return JSON.stringify(summary, null, 2);
  }

  /**
   * Download-Funktion
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Export als CSV und Download
   */
  static exportAndDownloadCSV(summary: CalculationSummary) {
    const csv = this.exportToCSV(summary);
    const filename = `Kalkulation_${summary.vehicle.name}_${new Date().toISOString().split('T')[0]}.csv`;
    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * Export als JSON und Download
   */
  static exportAndDownloadJSON(summary: CalculationSummary) {
    const json = this.exportToJSON(summary);
    const filename = `Kalkulation_${summary.vehicle.name}_${new Date().toISOString().split('T')[0]}.json`;
    this.downloadFile(json, filename, 'application/json');
  }

  /**
   * Druckversion (HTML)
   */
  static generatePrintHTML(summary: CalculationSummary): string {
    const html = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kalkulation - ${summary.vehicle.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; }
          .page { max-width: 210mm; margin: 0 auto; padding: 2cm; background: white; min-height: 297mm; }
          h1 { color: #2563eb; margin-bottom: 20px; }
          h2 { color: #1e40af; font-size: 1.3em; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f0f0f0; padding: 8px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .section { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; }
          .value { text-align: right; }
          .highlight { background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .negative { color: #dc2626; }
          .positive { color: #10b981; }
          @media print { body { background: white; } .page { padding: 0; margin: 0; } }
        </style>
      </head>
      <body>
        <div class="page">
          <h1>🚛 LKW-Transporter Kalkulation</h1>

          <div class="section">
            <div class="info-row">
              <span class="label">Fahrzeug:</span>
              <span class="value">${summary.vehicle.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Kennzeichen:</span>
              <span class="value">${summary.vehicle.registration}</span>
            </div>
            <div class="info-row">
              <span class="label">Druckdatum:</span>
              <span class="value">${new Date().toLocaleDateString('de-DE')}</span>
            </div>
          </div>

          <h2>Nebenrechnungen</h2>
          <table>
            <tr>
              <th>Kostenart</th>
              <th style="text-align: right;">Betrag</th>
            </tr>
            <tr>
              <td>Treibstoffkosten/Jahr</td>
              <td style="text-align: right;">${formatters.currency(summary.supplementary.annualFuelCosts)}</td>
            </tr>
            <tr>
              <td>Öl & Schmierstoff/Jahr</td>
              <td style="text-align: right;">${formatters.currency(summary.supplementary.annualOilCosts)}</td>
            </tr>
            <tr>
              <td>Reifenkosten/Jahr</td>
              <td style="text-align: right;">${formatters.currency(summary.supplementary.annualTireCosts)}</td>
            </tr>
            <tr>
              <td>Reparaturen/Jahr</td>
              <td style="text-align: right;">${formatters.currency(summary.supplementary.annualRepairCosts)}</td>
            </tr>
            <tr>
              <td>Abschreibung/Jahr</td>
              <td style="text-align: right;">${formatters.currency(summary.supplementary.depreciationPerYear)}</td>
            </tr>
            <tr>
              <td>Steuern & Versicherung/Jahr</td>
              <td style="text-align: right;">${formatters.currency(summary.supplementary.annualInsuranceCosts)}</td>
            </tr>
          </table>

          <h2>Splitsatz</h2>
          <div class="highlight">
            <div class="info-row">
              <span class="label">Kosten pro KM:</span>
              <span class="value">${formatters.currency(summary.splitRate.costPerKM)}</span>
            </div>
            <div class="info-row">
              <span class="label">Kosten pro Stunde:</span>
              <span class="value">${formatters.currency(summary.splitRate.costPerHour)}</span>
            </div>
            <div class="info-row">
              <span class="label">Gesamtkosten/Jahr:</span>
              <span class="value">${formatters.currency(summary.splitRate.totalAnnualCosts)}</span>
            </div>
          </div>

          ${summary.orders.length > 0 ? `
            <h2>Aufträge</h2>
            <table>
              <tr>
                <th>Route</th>
                <th style="text-align: right;">km</th>
                <th style="text-align: right;">Kosten</th>
                <th style="text-align: right;">Erlös</th>
                <th style="text-align: right;">Gewinn</th>
                <th style="text-align: right;">Marge</th>
              </tr>
              ${summary.orders.map(order => `
                <tr>
                  <td>${order.route}</td>
                  <td style="text-align: right;">${order.distance}</td>
                  <td style="text-align: right;">${formatters.currency(order.directCosts)}</td>
                  <td style="text-align: right;">${formatters.currency(order.revenue)}</td>
                  <td style="text-align: right;" class="${order.profit >= 0 ? 'positive' : 'negative'}">
                    ${formatters.currency(order.profit)}
                  </td>
                  <td style="text-align: right;">${formatters.percent(order.profitMargin, 1)}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Öffne Druckdialog
   */
  static openPrintDialog(summary: CalculationSummary) {
    const html = this.generatePrintHTML(summary);
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
