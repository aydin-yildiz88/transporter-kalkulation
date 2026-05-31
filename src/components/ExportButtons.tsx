import { useCalculationStore } from '../store/calculationStore';
import { ExportService } from '../services/exportService';

export const ExportButtons = () => {
  const summary = useCalculationStore((state) => state.summary);

  if (!summary) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => ExportService.openPrintDialog(summary)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
      >
        🖨️ Drucken
      </button>

      <button
        onClick={() => ExportService.exportAndDownloadCSV(summary)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
      >
        📊 Als CSV
      </button>

      <button
        onClick={() => ExportService.exportAndDownloadJSON(summary)}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
      >
        💾 Als JSON
      </button>
    </div>
  );
};
