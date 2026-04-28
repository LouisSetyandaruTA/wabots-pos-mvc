const dashboardService = require("../services/dashboardService");

exports.getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData(req.user.businessId);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};