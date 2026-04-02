import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FileSpreadsheet, FileText, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { downloadReportFile } from "../../services/reportService";

const Reports = () => {
  const [loading, setLoading] = useState(null);

  const handleDownload = async (type) => {
    setLoading(type);
    const toastId = toast.loading(`Generating ${type.toUpperCase()} report...`);

    try {
      await downloadReportFile(type);
      toast.success(`${type.toUpperCase()} report downloaded successfully!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || `Failed to download ${type.toUpperCase()} report.`, { id: toastId });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl space-y-6"
    >
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Data Exports & Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate and download comprehensive analytics reports for stakeholders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          title="Sales Dataset"
          description="Download the complete, raw sales dataset including all historical transactions, regions, and product categories."
          buttonText="Export to Excel"
          type="excel"
          loading={loading}
          icon={FileSpreadsheet}
          colorTheme="green"
          onDownload={handleDownload}
        />

        <ReportCard
          title="Executive Summary"
          description="Export a high-level analytics summary, including revenue trends, KPI metrics, and AI-driven insights."
          buttonText="Download PDF"
          type="pdf"
          loading={loading}
          icon={FileText}
          colorTheme="red"
          onDownload={handleDownload}
        />
      </div>
    </Motion.div>
  );
};

const ReportCard = ({ title, description, buttonText, type, loading, icon: Icon, colorTheme, onDownload }) => {
  const isLoading = loading === type;

  // Dynamic theme mapping for a premium SaaS feel
  const themes = {
    green: {
      iconBg: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
      btn: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    red: {
      iconBg: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    }
  };

  const theme = themes[colorTheme] || themes.green;

  return (
    <Motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => onDownload(type)}
          disabled={isLoading || loading !== null} // Disable all buttons if ANY is loading
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-gray-900 ${theme.btn}`}
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