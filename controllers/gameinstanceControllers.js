const GameInstance = require("../models/gameinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Game = require("../models/game");
const game = require("../models/game");

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
  const gameInstance = await GameInstance.findById(req.params.id)
    .populate("game")
    .exec();

  if (gameInstance === null) {
    const err = new Error("Game copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance_detail", {
    title: "Game",
    gameInstance: gameInstance,
  });
});

// Display GameInstance create form on GET
exports.gameinstance_create_get = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "title").sort({ title: 1 }).exec();

  res.render("gameinstance_form", {
    title: "Create Game Instance",
    game_list: allGames,
  });
});

// Handle BookInstance create on POST
exports.gameinstance_create_post = [
  // Validate and sanitize fields
  body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),

  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price must be specified.")
    .isCurrency({
      require_symbol: false,
      allow_negatives: false,
      decimal_separator: ".",
      require_decimal: true,
      digits_after_decimal: [2],
    })
    .withMessage("Price must be a positive number in this format: 0.00"),
  body("publisher", "Publisher must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status", "Status must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from request
    const errors = validationResult(req);

    // Create GameInstance object with the escaped and trimmed data
    const gameInstance = new GameInstance({
      game: req.body.game,
      publisher: req.body.publisher,
      price: req.body.price,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Render form again with sanitized values and error msgs
      const allGames = await Game.find({}, "title").sort({ title: 1 }).exec();

      res.render("gameinstance_form", {
        title: "Create Game Instance",
        game_list: allGames,
        selected_game: gameInstance.game._id,
        errors: errors.array(),
        gameinstance: gameInstance,
      });
      return;
    } else {
      // Data from form is valid
      await gameInstance.save();
      res.redirect(gameInstance.url);
    }
  }),
];

// Display GameInstance delete form on GET
exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  const gameInstance = await GameInstance.findById(req.params.id).populate(
    "game"
  );

  if (gameInstance === null) {
    // No results
    res.redirect("/inventory/gameinstances");
  }

  res.render("gameinstance_delete", {
    title: "Delete Game Instance",
    gameInstance: gameInstance,
  });
});

// Handle GameInstance detel on POST
exports.gameinstance_delete_post = asyncHandler(async (req, res, next) => {
  const gameInstance = await GameInstance.findById(req.params.id).populate(
    "game"
  );
  // Delete instance and redirect to game detail page
  await GameInstance.findByIdAndDelete(req.body.gameInstanceid);
  res.redirect(gameInstance.game.url);
});

// Display GameInstance update form on GET
exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  //
  const [gameInstance, allGames] = await Promise.all([
    GameInstance.findById(req.params.id),
    Game.find({}, "title").sort({ title: 1 }).exec(),
  ]);

  if (gameInstance === null) {
    const err = new Error("Game instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance_form", {
    title: "Update Game Instance",
    gameinstance: gameInstance,
    game_list: allGames,
  });
});

// Handle GameInstance update on POST
exports.gameinstance_update_post = [
  // Validate and sanitize the form data
  body("game", "Game must be specified.").trim().isLength({ min: 1 }).escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price must be specified.")
    .isCurrency({
      require_symbol: false,
      allow_negatives: false,
      decimal_separator: ".",
      require_decimal: true,
      digits_after_decimal: [2],
    })
    .withMessage("Price must be a positive number in this format: 0.00"),
  body("publisher", "Publisher must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status", "Status must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from request
    const errors = validationResult(req);

    // Create Gameinstance object with the escaped and trimmed data
    const gameInstance = new GameInstance({
      game: req.body.game,
      publisher: req.body.publisher,
      price: req.body.price,
      status: req.body.status,
      _id: req.params.id,
    });

    const allGames = await Game.find({}, "title").sort({ title: 1 }).exec();

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with the sanitized values and error msgs
      res.render("gameinstance_form", {
        title: "Update Game Instance",
        gameinstance: gameInstance,
        game_list: allGames,
        errors: errors.array(),
      });
    } else {
      const updatedGameInstance = await GameInstance.findByIdAndUpdate(
        req.params.id,
        gameInstance,
        {}
      );

      res.redirect(updatedGameInstance.url);
    }
  }),
];
