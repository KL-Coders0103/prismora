import React from "react";

const CustomerTable = ({ data = [] }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer Name</th>
              <th className="px-6 py-4 font-semibold text-right">Purchases</th>
              <th className="px-6 py-4 font-semibold text-right">Total Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No customer data available.
                </td>
              </tr>
            ) : (
              data.map((customer, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {customer.name || customer._id}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {customer.purchases || 0}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">
                    {typeof customer.value === 'number' 
                      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(customer.value)
                      : customer.value || "₹0"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;