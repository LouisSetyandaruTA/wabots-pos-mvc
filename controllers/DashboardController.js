const dashboardService = require("../services/dashboardService");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // JWT

    const data = await dashboardService.getDashboardData(userId);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};