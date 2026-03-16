import API from "./api";

export const downloadReportFile = async (type) => {

  const res = await API.get(`/reports/${type}`, {
    responseType:"blob"
  });

  const url = window.URL.createObjectURL(
    new Blob([res.data])
  );

  const link = document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    type === "excel"
      ? "sales_report.xlsx"
      : "sales_report.pdf"
  );

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);

};