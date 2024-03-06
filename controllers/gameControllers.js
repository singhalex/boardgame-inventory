const Game = require("../models/game");
const Designer = require("../models/designer");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numGames,
    numGameInstances,
    numInStockGameInstances,
    numDesigners,
    numGenres,
  ] = await Promise.all([
    Game.countDocuments({}).exec(),
    GameInstance.countDocuments({}).exec(),
    GameInstance.countDocuments({ status: "In Stock" }).exec(),
    Designer.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Board Game Inventory",
    game_count: numGames,
    game_instance_count: numGameInstances,
    game_instance_in_stock_count: numInStockGameInstances,
    designer_count: numDesigners,
    genre_count: numGenres,
  });
});

// Display list of all game
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "title designer")
    .sort({ title: 1 })
    .populate("designer")
    .exec();

  res.render("game_list", { title: "Game List", game_list: allGames });
});

// Display detail page for a specific game
exports.game_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Game detail: ${req.params.id}`);
  const game_detail = await Game.find({ _id: req.params.id }).exec();
  res.send(game_detail[0].title);
});

// Display game create form on GET
exports.game_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create form GET");
});

// Handle game create form on POST
exports.game_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create POST");
});

// Display game delete form on GET
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete GET");
});

// Handle game delete on POST
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete POST");
});

// Display game update form on GET
exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update GET");
});

// Handle game update on POST
exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update POST");
});
