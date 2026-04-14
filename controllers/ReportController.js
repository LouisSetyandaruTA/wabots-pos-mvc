const reportService = require("../services/reportService");

const getReport = async (req, res) => {
  try {
    let { startDate, endDate, groupBy } = req.query;

    // 🔥 DEFAULT DATE (WAJIB)
    if (!startDate || !endDate) {
      const today = new Date().toISOString().split("T")[0];
      startDate = today;
      endDate = today;
    }

    if (!groupBy) groupBy = "day";

    const data = await reportService.getSummaryReport({
      startDate,
      endDate,
      groupBy
    });

    res.json(data);
  } catch (error) {
    console.error("REPORT ERROR:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};

module.exports = { getReport };