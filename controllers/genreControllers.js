const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

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

  console.log(gamesInGenre);

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

// Display Genre create form on GET
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

// Handle Genre create on POST
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

// Display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
