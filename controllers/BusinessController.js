const businessService = require("../services/businessService");

exports.getMyBusiness = async (req, res) => {
  try {

    const business =
      await businessService.getBusiness(
        req.user.businessId
      );

    res.json(business);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};

exports.updateMyBusiness = async (req, res) => {

  try {

    const updated =
      await businessService.updateBusiness(
        req.user.businessId,
        req.body
      );

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};