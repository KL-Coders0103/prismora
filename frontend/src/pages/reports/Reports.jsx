import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const Reports = () => {

  const [loading, setLoading] = useState(null);

  const downloadReport = async (type) => {

    setLoading(type);

    try {

      const res = await API.get(`/reports/${type}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        type === "sales"
          ? "sales_report.xlsx"
          : "sales_report.pdf"
      );

      document.body.appendChild(link);

      link.click();

    } catch (error) {

      console.error("Download error:", error);

    }

    setLoading(null);

  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">

        Reports

      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Excel Report */}

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

          <h3 className="text-lg font-semibold mb-2">

            Sales Excel Report

          </h3>

          <p className="text-sm text-gray-400 mb-4">

            Download complete sales dataset in Excel format.

          </p>

          <button
            onClick={() => downloadReport("sales")}
            className="bg-blue-500 px-4 py-2 rounded"
          >

            {loading === "sales"
              ? "Downloading..."
              : "Download Excel"}

          </button>

        </div>


        {/* PDF Report */}

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

          <h3 className="text-lg font-semibold mb-2">

            Sales PDF Report

          </h3>

          <p className="text-sm text-gray-400 mb-4">

            Export analytics summary in PDF format.

          </p>

          <button
            onClick={() => downloadReport("pdf")}
            className="bg-green-500 px-4 py-2 rounded"
          >

            {loading === "pdf"
              ? "Downloading..."
              : "Download PDF"}

          </button>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default Reports;