const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const designer = require("../models/designer");

// Display list of all Genre
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  });
});

// Display detail list for a specific genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, gamesInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, "title description")
      .sort({ title: 1 })
      .exec(),
  ]);

  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_games: gamesInGenre,
  });
});

// Handle Genre create on GET
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
});

// Display Genre create form on POST
exports.genre_create_post = [
  // validate and sanitize the name field
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // process request after validation and sanitation
  asyncHandler(async (req, res, next) => {
    // Extract the validation erros from a request
    const errors = validationResult(req);

    // create a genre object with the escaped and trimmed data
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values & error message
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Date from the form is valid
      // Check if Genre with same name already exists
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exista, redirect to its detail page
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allGamesInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, "title description"),
  ]);

  if (genre === null) {
    // No results so render genre list
    res.render("/inventory/genres");
  }

  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    genre_games: allGamesInGenre,
  });
});

// Handle Genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of the genre and all its games
  const [genre, allGamesInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, "title description").exec(),
  ]);

  if (allGamesInGenre.length > 0) {
    // Genre has games. Render same as GET route
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      genre_games: allGamesInGenre,
    });
    return;
  } else {
    // Genre has no books. Delete object and redirect to the list of genres
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/inventory/genres");
  }
});

// Display Genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
