const Designer = require("../models/designer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

// Display list of all designers
exports.designer_list = asyncHandler(async (req, res, next) => {
  const allDesigners = await Designer.find().sort({ last_name: 1 }).exec();
  res.render("designer_list", {
    title: "Designer List",
    designer_list: allDesigners,
  });
});

// Display detail page for a specific designer
exports.designer_detail = asyncHandler(async (req, res, next) => {
  const [designer, allGamesByDesigner] = await Promise.all([
    Designer.findById(req.params.id).exec(),
    Game.find({ designer: req.params.id }, "title description").find(),
  ]);

  if (designer === null) {
    const err = "Designer not found";
    err.status = 404;
    return next(err);
  }

  res.render("designer_detail", {
    designer: designer,
    designer_games: allGamesByDesigner,
  });
});

// Display Designer create form on GET
exports.designer_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Designer create GET");
});

// Handle Designer create on POST
exports.designer_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Designer create POST");
});

// Display Designer delete form on GET
exports.desiger_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Designer delete GET");
});

// Display Designer delete form on POST
exports.designer_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Designer delete POST");
});

// Display Designer update form on GET
exports.designer_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Designer ${req.params.id} update GET`);
});

// Display Designer update form on POST
exports.designer_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Designer ${req.params.id} update POST`);
});
