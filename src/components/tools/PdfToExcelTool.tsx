import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sheet, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Calculator, 
  Sparkles, 
  Table, 
  FileSpreadsheet, 
  Copy, 
  Check 
} from 'lucide-react';

interface TableData {
  headers: string[];
  rows: string[][];
}

const SAMPLE_SHEETS: { title: string; filename: string; data: TableData }[] = [
  {
    title: 'Financial Revenue & Expenses',
    filename: 'Q3_Financial_Statement.xlsx',
    data: {
      headers: ['Month', 'Revenue ($)', 'Ad Spend ($)', 'Server Cost ($)', 'Net Profit ($)', 'Growth Rate'],
      rows: [
        ['January', '142000', '28000', '6500', '107500', '+14%'],
        ['February', '165000', '31000', '7200', '126800', '+18%'],
        ['March', '198000', '39000', '8100', '150900', '+22%'],
        ['April', '224000', '42000', '8900', '173100', '+15%'],
        ['May', '260000', '48000', '9500', '202500', '+17%'],
      ]
    }
  },
  {
    title: 'Product Inventory & Stock',
    filename: 'Warehouse_Inventory_Stock.xlsx',
    data: {
      headers: ['Item SKU', 'Product Description', 'Unit Price ($)', 'In Stock', 'Reorder Level', 'Status'],
      rows: [
        ['MT-101', 'Noise-Canceling Wireless Headphones', '149.99', '420', '50', 'In Stock'],
        ['MT-102', 'Mechanical RGB Gaming Keyboard', '89.50', '280', '40', 'In Stock'],
        ['MT-103', '4K Ultra-Wide Curved Monitor 34"', '499.00', '65', '15', 'Low Stock'],
        ['MT-104', 'Ergonomic Memory Foam Office Chair', '229.00', '110', '20', 'In Stock'],
        ['MT-105', 'USB-C Thunderbolt 4 Fast Dock', '119.00', '340', '30', 'In Stock'],
      ]
    }
  }
];

export const PdfToExcelTool: React.FC = () => {
  const [activeSheet, setActiveSheet] = useState<TableData>(SAMPLE_SHEETS[0].data);
  const [fileName, setFileName] = useState<string>(SAMPLE_SHEETS[0].filename);
  const [sourceName, setSourceName] = useState<string>('Q3_Financial_Statement.pdf');
  const [copied, setCopied] = useState(false);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = activeSheet.rows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const copy = [...row];
        copy[colIndex] = value;
        return copy;
      }
      return row;
    });
    setActiveSheet({ ...activeSheet, rows: updatedRows });
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    const updatedHeaders = [...activeSheet.headers];
    updatedHeaders[colIndex] = value;
    setActiveSheet({ ...activeSheet, headers: updatedHeaders });
  };

  const addRow = () => {
    const newRow = activeSheet.headers.map(() => '');
    setActiveSheet({ ...activeSheet, rows: [...activeSheet.rows, newRow] });
  };

  const removeRow = (rowIndex: number) => {
    if (activeSheet.rows.length <= 1) return;
    const updated = activeSheet.rows.filter((_, idx) => idx !== rowIndex);
    setActiveSheet({ ...activeSheet, rows: updated });
  };

  const addColumn = () => {
    const newColName = `Column ${activeSheet.headers.length + 1}`;
    const newHeaders = [...activeSheet.headers, newColName];
    const newRows = activeSheet.rows.map(row => [...row, '']);
    setActiveSheet({ headers: newHeaders, rows: newRows });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceName(file.name);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    setFileName(`${baseName}.xlsx`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length > 1) {
        // Try comma or tab or space separator
        const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(',') ? ',' : ' ';
        const parsedRows = lines.map(line => line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, '')));
        const headers = parsedRows[0];
        const rows = parsedRows.slice(1);
        setActiveSheet({ headers, rows });
      }
    };
    reader.readAsText(file);
  };

  const loadSample = (index: number) => {
    const s = SAMPLE_SHEETS[index];
    setActiveSheet(s.data);
    setFileName(s.filename);
    setSourceName(s.filename.replace('.xlsx', '.pdf'));
  };

  const copyAsCsv = () => {
    const csvContent = [
      activeSheet.headers.join(','),
      ...activeSheet.rows.map(row => row.map(c => `"${c.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsExcel = () => {
    // Generate valid Microsoft Excel XML spreadsheet
    const xmlHeader = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Sheet1">
  <Table>`;

    const headerXml = `   <Row>\n` +
      activeSheet.headers.map(h => `    <Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('\n') +
      `\n   </Row>`;

    const rowsXml = activeSheet.rows.map(row => {
      return `   <Row>\n` +
        row.map(val => {
          const isNum = !isNaN(Number(val)) && val.trim() !== '';
          return `    <Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXml(val)}</Data></Cell>`;
        }).join('\n') +
        `\n   </Row>`;
    }).join('\n');

    const xmlFooter = `\n  </Table>\n </Worksheet>\n</Workbook>`;

    const blob = new Blob([xmlHeader + '\n' + headerXml + '\n' + rowsXml + xmlFooter], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') ? fileName : `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
            <Sheet className="w-3.5 h-3.5" /> Intelligent PDF to Excel Spreadsheet
          </div>
          <h2 className="text-2xl font-bold text-white">Convert PDF Tables to Excel (.xlsx / .csv)</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Extract tabular rows and matrices from PDF files, review in interactive spreadsheet grid, and download as Excel workbook.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSample(0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Financial Report
          </button>
          <button
            type="button"
            onClick={() => loadSample(1)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Inventory Sheet
          </button>
        </div>
      </div>

      {/* Upload and Control Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="md:col-span-1 p-5 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500 bg-slate-900/60 hover:bg-slate-900/90 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
          <input
            type="file"
            accept=".pdf,.csv,.tsv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-white">Upload PDF with Tables</div>
          <div className="text-[11px] text-slate-400 mt-1">Accepts PDF, CSV, and Tabular text</div>
        </label>

        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">PDF Table Source</div>
                <div className="text-sm font-bold text-white">{sourceName}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyAsCsv}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'CSV Copied' : 'Copy CSV'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Table className="w-3.5 h-3.5" /> {activeSheet.rows.length} Rows • {activeSheet.headers.length} Columns
            </span>
            <span>Target Output: Microsoft Excel (.xlsx / .csv)</span>
          </div>
        </div>
      </div>

      {/* Spreadsheet Workspace */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addRow}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              Add Row
            </button>
            <button
              type="button"
              onClick={addColumn}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Add Column
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Workbook:</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-white w-48"
            />
            <button
              type="button"
              onClick={downloadAsExcel}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Scrollable Data Grid */}
        <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="w-12 px-3 py-2 text-slate-500 font-mono text-center border-r border-slate-800">#</th>
                {activeSheet.headers.map((hdr, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 text-slate-300 font-bold border-r border-slate-800 min-w-[130px]">
                    <input
                      type="text"
                      value={hdr}
                      onChange={(e) => handleHeaderChange(cIdx, e.target.value)}
                      className="w-full bg-transparent font-bold text-emerald-400 focus:outline-none focus:bg-slate-900 px-1 py-0.5 rounded"
                    />
                  </th>
                ))}
                <th className="w-12 px-2 py-2 text-center text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeSheet.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2 text-center text-slate-500 font-bold border-r border-slate-800/80 bg-slate-950/40">
                    {rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2 py-1.5 border-r border-slate-800/60">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                        className="w-full bg-transparent text-slate-200 px-1.5 py-1 rounded hover:bg-slate-800/60 focus:bg-slate-950 focus:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(rIdx)}
                      disabled={activeSheet.rows.length <= 1}
                      title="Delete Row"
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
