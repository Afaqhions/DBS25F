import { useState, useEffect } from 'react';
import { REPORT_TYPES } from '../utils/constants';
import DateRangePicker from '../components/common/DateRangePicker';
import { customersAPI } from '../api/customers';
import { reportsAPI } from '../api/reports';
import toast from 'react-hot-toast';
import { FileText, Download, Eye, BarChart3 } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Reports() {
  const [reportType, setReportType] = useState('');
  const [selectedParams, setSelectedParams] = useState({});
  const [generating, setGenerating] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    customersAPI.getAll({ page: 1, pageSize: 100 })
      .then((res) => {
        const data = res.data.data || res.data;
        setCustomers(data.items || []);
      })
      .catch(() => {});
  }, []);

  const currentReport = REPORT_TYPES.find((r) => r.value === reportType);

  const handleGenerate = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }
    setGenerating(true);
    try {
      const params = {};
      if (selectedParams.startDate) params.startDate = selectedParams.startDate;
      if (selectedParams.endDate) params.endDate = selectedParams.endDate;
      if (selectedParams.topN) params.topN = parseInt(selectedParams.topN);
      if (selectedParams.customerId) params.customerId = parseInt(selectedParams.customerId);
      if (selectedParams.year) params.year = parseInt(selectedParams.year);
      if (selectedParams.threshold) params.threshold = parseInt(selectedParams.threshold);

      const response = await reportsAPI.generatePDF(reportType, params);

      const contentDisposition = response.headers?.['content-disposition'];
      let filename = `${reportType}-report.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match) filename = match[1].replace(/['"]/g, '');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, filename);
      toast.success('Report generated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }
    setGenerating(true);
    try {
      const params = {};
      if (selectedParams.startDate) params.startDate = selectedParams.startDate;
      if (selectedParams.endDate) params.endDate = selectedParams.endDate;
      if (selectedParams.topN) params.topN = parseInt(selectedParams.topN);
      if (selectedParams.customerId) params.customerId = parseInt(selectedParams.customerId);
      if (selectedParams.year) params.year = parseInt(selectedParams.year);
      if (selectedParams.threshold) params.threshold = parseInt(selectedParams.threshold);

      const response = await reportsAPI.generatePDF(reportType, params);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      toast.success('Report opened in new tab');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleParamChange = (key, value) => {
    setSelectedParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and download business reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Report Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type *</label>
                <select
                  value={reportType}
                  onChange={(e) => { setReportType(e.target.value); setSelectedParams({}); }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                >
                  <option value="">-- Select Report --</option>
                  {REPORT_TYPES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {currentReport?.params?.includes('startDate') && (
                <DateRangePicker
                  startDate={selectedParams.startDate || ''}
                  endDate={selectedParams.endDate || ''}
                  onStartChange={(v) => handleParamChange('startDate', v)}
                  onEndChange={(v) => handleParamChange('endDate', v)}
                />
              )}

              {currentReport?.params?.includes('topN') && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Top N Products</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={selectedParams.topN || '20'}
                    onChange={(e) => handleParamChange('topN', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                  />
                </div>
              )}

              {currentReport?.params?.includes('customerId') && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                  <select
                    value={selectedParams.customerId || ''}
                    onChange={(e) => handleParamChange('customerId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map((c) => (
                      <option key={c.customerId} value={c.customerId}>{c.fullName}</option>
                    ))}
                  </select>
                </div>
              )}

              {currentReport?.params?.includes('year') && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    value={selectedParams.year || new Date().getFullYear()}
                    onChange={(e) => handleParamChange('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                  />
                </div>
              )}

              {currentReport?.params?.includes('threshold') && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Low Stock Threshold</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={selectedParams.threshold || '10'}
                    onChange={(e) => handleParamChange('threshold', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={generating || !reportType}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {generating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  {generating ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={handlePrint}
                  disabled={generating || !reportType}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
                >
                  <Eye size={16} /> Preview in Browser
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Available Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TYPES.map((report) => (
                <button
                  key={report.value}
                  onClick={() => { setReportType(report.value); setSelectedParams({}); }}
                  className={`flex items-start gap-3 p-4 border text-left transition ${
                    reportType === report.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`p-2 border ${reportType === report.value ? 'bg-primary/10 text-primary border-primary/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'}`}>
                    {reportType === report.value ? <BarChart3 size={20} /> : <FileText size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{report.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {report.params.length === 0 ? 'No parameters required' : `Requires: ${report.params.join(', ')}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {reportType && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5">
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Ready to Generate</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    Configure the parameters on the left and click "Download PDF" or "Preview in Browser" to generate the report.
                    The PDF will include formatted data, charts, and company branding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
