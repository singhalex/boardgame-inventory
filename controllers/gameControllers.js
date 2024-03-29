const Game = require("../models/game");
const Designer = require("../models/designer");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");
const game = require("../models/game");
const genre = require("../models/genre");

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
  const [game, gameInstances] = await Promise.all([
    Game.findById(req.params.id).populate("designer").populate("genre").exec(),
    GameInstance.find({ game: req.params.id }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: game.title,
    game: game,
    game_instances: gameInstances,
  });
});

// Display game create form on GET
exports.game_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres to add to book
  const [allDesigners, allGenres] = await Promise.all([
    Designer.find().sort({ last_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("game_form", {
    title: "Create Game",
    designers: allDesigners,
    genres: allGenres,
  });
});

// Handle game create form on POST
exports.game_create_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  // Convert designers to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.designer)) {
      req.body.designer =
        typeof req.body.designer === "undefined" ? [] : [req.body.designer];
    }
    next();
  },

  // Validate and sanitize the fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("URL must not be empty")
    .isURL()
    .withMessage("Must enter valid URL"),
  body("designer.*").escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  //Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);
    if (req.body.genre.length == 0) {
      errors.errors.push({
        type: "field",
        value: "",
        msg: "Must select at least one genre.",
        path: "genre",
        location: "body",
      });
    }
    if (req.body.designer.length == 0) {
      errors.errors.push({
        type: "field",
        value: "",
        msg: "Must select at least one designer.",
        path: "designer",
        location: "body",
      });
    }

    // Create a game object with the escaped and trimmed data
    const game = new Game({
      title: req.body.title,
      designer: req.body.designer,
      description: req.body.description,
      image: req.body.image,
      genre: req.body.genre,
    });

    if (
      !errors.isEmpty() ||
      req.body.genre.length === 0 ||
      req.body.designer.length === 0
    ) {
      // There are errors. Render form again with sanitized values and error msgs

      // Get all the designers and genres for form
      const [allDesigners, allGenres] = await Promise.all([
        Designer.find().sort({ last_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      // Mark selected designers as checked
      for (const designer of allDesigners) {
        if (game.designer.includes(designer._id)) {
          designer.checked = "true";
        }
      }

      // Mark selected genres as checked
      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render("game_form", {
        title: "Create Game",
        designers: allDesigners,
        genres: allGenres,
        game: game,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save game
      await game.save();
      res.redirect(game.url);
    }
  }),
];

// Display game delete form on GET
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const [game, allInstancesOfGame] = await Promise.all([
    Game.findById(req.params.id).exec(),
    GameInstance.find({ game: req.params.id }).exec(),
  ]);

  res.render("game_delete", {
    title: "Delete Game",
    game: game,
    game_instances: allInstancesOfGame,
  });
});

// Handle game delete on POST
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of the game and all its instances
  const [game, allInstancesOfGame] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Genre.find({ game: req.params.id }).exec(),
  ]);

  if (allInstancesOfGame.length > 0) {
    // Game has game instances. Render same as GET route
    res.render("game_delete", {
      title: "Delete Game",
      game: game,
      game_instances: allInstancesOfGame,
    });
    return;
  } else {
    // Game has no instances. Delete object and redirect to the list of games
    await Game.findByIdAndDelete(req.body.gameid);
    res.redirect("/inventory/games");
  }
});

// Display game update form on GET
exports.game_update_get = asyncHandler(async (req, res, next) => {
  // Get game, designers, and genres for form
  const [game, allDesigners, allGenres] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Designer.find().sort({ last_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    // No results
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  // Mark selected designers as checked
  allDesigners.forEach((designer) => {
    if (game.designer.includes(designer._id)) designer.checked = "true";
  });

  // Mark selected genres as checked
  allGenres.forEach((genre) => {
    if (game.genre.includes(genre._id)) genre.checked = "true";
  });

  res.render("game_form", {
    title: "Update Game",
    designers: allDesigners,
    genres: allGenres,
    game: game,
  });
});

// Handle game update on POST
exports.game_update_post = [
  // Convert the designers to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.designer)) {
      typeof req.body.designer === "undefined" ? [] : [req.body.designer];
    }
    next();
  },
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("URL must not be empty")
    .isURL()
    .withMessage("Must enter a valid URL."),
  body("designer.*").escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);
    if (req.body.genre.length == 0) {
      errors.errors.push({
        type: "field",
        value: "",
        msg: "Must select at least one genre",
        path: "genre",
        location: "body",
      });
    }
    if (req.body.length == 0) {
      errors.erros.push({
        type: "field",
        value: "",
        msg: "Must select at least one designer.",
        path: "designer",
        location: "body",
      });
    }

    // Create a game object with the escaped and trimmed data
    const game = new Game({
      title: req.body.title,
      designer: req.body.designer,
      description: req.body.description,
      image: req.body.image,
      genre: req.body.genre,
      _id: req.params.id,
    });

    if (
      !errors.isEmpty() ||
      req.body.genre.length === 0 ||
      req.body.designer.length === 0
    ) {
      // There are errors. Render form again with the sanitized values and error msgs

      // Get all designers and genres for form
      const [allDesigners, allGenres] = await Promise.all([
        Designer.find().sort({ last_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      // Mark selected designers as checked
      for (const designer of allDesigners) {
        if (game.designer.includes(designer._id)) {
          designer.checked = "true";
        }
      }

      // Mark selected genres as checked
      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render("game_form", {
        title: "Update Game",
        designers: allDesigners,
        genres: allGenres,
        game: game,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update game
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});

      // Redirect to updated game detail page
      res.redirect(updatedGame.url);
    }
  }),
];
