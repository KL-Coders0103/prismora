import DashboardLayout from "../../components/layout/DashboardLayout";

const Reports = () => {

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Reports
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <a
          href="http://localhost:5000/api/reports/sales"
          className="bg-blue-500 p-6 rounded-xl text-center"
        >
          Download Excel Report
        </a>

        <a
          href="http://localhost:5000/api/reports/pdf"
          className="bg-green-500 p-6 rounded-xl text-center"
        >
          Download PDF Report
        </a>

      </div>

    </DashboardLayout>

  );

};

export default Reports;