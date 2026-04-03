import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FileSpreadsheet, FileText, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { downloadReportFile } from "../../services/reportService";

const VALID_TYPES = ["excel", "pdf"];

const Reports = () => {
  const [loading, setLoading] = useState(null);

  const handleDownload = async (type) => {
    if (!VALID_TYPES.includes(type)) {
      toast.error("Invalid report type");
      return;
    }

    if (loading) return;

    setLoading(type);
    const toastId = toast.loading(`Generating ${type.toUpperCase()} report...`);

    try {
      // ✅ Now it returns 'true' from service
      const isSuccess = await downloadReportFile(type);

      if (isSuccess) {
        toast.success(`${type.toUpperCase()} report downloaded!`, { id: toastId });
      }
    } catch (err) {
      console.error("Report Download Error:", err);
      
      // ✅ Extracting actual error even if it's a blob error
      let errorMessage = "Network error. Please check your server.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data) {
        errorMessage = err.response.data.message || "Server Error";
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-6"
    >
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Data Exports & Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Generate and download professional analytics reports in multiple formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          title="Sales Dataset"
          description="Complete raw data of all transactions in spreadsheet format."
          buttonText="Export to Excel"
          type="excel"
          activeLoading={loading}
          icon={FileSpreadsheet}
          colorTheme="green"
          onDownload={handleDownload}
        />

        <ReportCard
          title="Executive Summary"
          description="A visual PDF summary of business performance and AI insights."
          buttonText="Download PDF"
          type="pdf"
          activeLoading={loading}
          icon={FileText}
          colorTheme="red"
          onDownload={handleDownload}
        />
      </div>
    </Motion.div>
  );
};

// --- SUB-COMPONENT: ReportCard ---
// --- SUB-COMPONENT: ReportCard ---
const ReportCard = ({ 
  title, 
  description, 
  buttonText, 
  type, 
  activeLoading, 
  icon: Icon, 
  colorTheme, 
  onDownload 
}) => {
  const isLoading = activeLoading === type;
  const isAnyLoading = activeLoading !== null;

  const themes = {
    green: {
      iconBg: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
      btn: "bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-green-500/20",
    },
    red: {
      iconBg: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/20",
    },
  };

  const theme = themes[colorTheme] || themes.green;

  return (
    <Motion.div
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-xl ${theme.iconBg}`}>
          {/* ✅ 2. Ab 'Icon' ko component ki tarah use kiya (Warning Gone!) */}
          <Icon size={24} /> 
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-800">
        <button
          onClick={() => onDownload(type)}
          disabled={isAnyLoading}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${theme.btn}`}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              {buttonText}
            </>
          )}
        </button>
      </div>
    </Motion.div>
  );
};

export default Reports;