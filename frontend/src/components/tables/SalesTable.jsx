const data = [
  { product: "Laptop", sales: 120, revenue: "$24,000" },
  { product: "Phone", sales: 200, revenue: "$40,000" },
  { product: "Headphones", sales: 150, revenue: "$15,000" },
];

const SalesTable = () => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Sales</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <td>{item.product}</td>
            <td>{item.sales}</td>
            <td>{item.revenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles = {
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
};

export default SalesTable;
