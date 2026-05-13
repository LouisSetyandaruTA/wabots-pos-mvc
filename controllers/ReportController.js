const reportService = require("../services/reportService");

const getReport = async (req, res) => {
  try {
    let { startDate, endDate, groupBy } = req.query;

    // 🔥 DEFAULT DATE (WAJIB)
   if (!startDate || !endDate) {

  const today = new Date();

  const last30Days = new Date();

  last30Days.setDate(today.getDate() - 30);

  startDate = last30Days.toISOString().split("T")[0];

  endDate = today.toISOString().split("T")[0];
}

    if (!groupBy) groupBy = "day";

    const data = await reportService.getSummaryReport({
      startDate,
      endDate,
      groupBy,
      businessId: req.user.businessId
    });

    res.json(data);
  } catch (error) {
    console.error("REPORT ERROR:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};

module.exports = { getReport };