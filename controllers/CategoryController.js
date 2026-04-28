const { Category } = require("../models");

exports.getCategories = async (req, res) => {
  const data = await Category.findAll({
    where: { userId: req.user.id }
  });
  res.json(data);
};

exports.createCategory = async (req, res) => {
  const data = await Category.create({
    name: req.body.name,
    userId: req.user.id
  });
  res.json(data);
};

exports.deleteCategory = async (req, res) => {
  await Category.destroy({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });
  res.json({ success: true });
};