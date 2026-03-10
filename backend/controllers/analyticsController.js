exports.getDashboardStats = async (req, res) => {

try {

const stats = {

revenue: 120000,

customers: 2450,

salesGrowth: 18,

profitMargin: 32

};

res.json(stats);

} catch (error) {

res.status(500).json({ error: error.message });

}

};