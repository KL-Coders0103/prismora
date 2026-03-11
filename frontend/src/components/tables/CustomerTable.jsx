const customers = [
  { name: "John Doe", purchases: 12, value: "$1200" },
  { name: "Sarah Smith", purchases: 8, value: "$850" },
  { name: "Mike Johnson", purchases: 5, value: "$540" },
];

const CustomerTable = () => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Purchases</th>
          <th>Total Value</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((c, i) => (
          <tr key={i}>
            <td>{c.name}</td>
            <td>{c.purchases}</td>
            <td>{c.value}</td>
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

export default CustomerTable;
