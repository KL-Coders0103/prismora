import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { downloadReportFile } from "../../services/reportService";

const Reports = () => {

  const [loading,setLoading] = useState(null);
  const [error,setError] = useState("");

  const handleDownload = async (type) => {

    setLoading(type);
    setError("");

    try{

      await downloadReportFile(type);

    }catch(err){

      console.error(err);

      setError("Failed to download report");

    }finally{

      setLoading(null);

    }

  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Reports
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        <ReportCard
          title="Sales Excel Report"
          description="Download complete sales dataset in Excel format."
          buttonText="Download Excel"
          type="excel"
          loading={loading}
          color="bg-blue-500 hover:bg-blue-600"
          onDownload={handleDownload}
        />

        <ReportCard
          title="Sales PDF Report"
          description="Export analytics summary in PDF format."
          buttonText="Download PDF"
          type="pdf"
          loading={loading}
          color="bg-green-500 hover:bg-green-600"
          onDownload={handleDownload}
        />

      </div>

    </DashboardLayout>

  );

};

const ReportCard = ({
  title,
  description,
  buttonText,
  type,
  loading,
  color,
  onDownload
}) => {

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        {description}
      </p>

      <button
        onClick={() => onDownload(type)}
        disabled={loading === type}
        className={`${color} px-4 py-2 rounded disabled:opacity-50`}
      >

        {loading === type
          ? "Downloading..."
          : buttonText}

      </button>

    </div>

  );

};

export default Reports;