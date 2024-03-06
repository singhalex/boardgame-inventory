const GameInstance = require("../models/gameinstance");
const asyncHandler = require("express-async-handler");

// Display list of all GameInstances
exports.gameinstance_list = asyncHandler(async (req, res, next) => {
  const allGameInstances = await GameInstance.find()
    .populate("game")
    .sort({ game: 1 })
    .exec();

  res.render("gameinstance_list", {
    title: "Game Instance List",
    gameinstance_list: allGameInstances,
  });
});

// Display detail page for a specific GameInstance
exports.gameinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
});

// Display GameInstance create form on GET
exports.gameinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GameInstance create GET");
});

// Handle BookInstance create on POST
exports.gameinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GameInstance create POST");
});

// Display GameInstance delete form on GET
exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GameInstance delete GET");
});

// Handle GameInstance detel on POST
exports.gameinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GameInstance delete POST");
});

// Display GameInstance update form on GET
exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GameInstance update GET");
});

// Handle GameInstance update on POST
exports.gameinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GameInstance update POST");
});
