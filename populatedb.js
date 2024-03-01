#! /usr/bin/env node

console.log(
  'This script populates some test games, designers, genres and gameinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/board_game_inventory?retryWrites=true&w=majority"'
);

const Game = require("./models/game");
const Designer = require("./models/designer");
const Genre = require("./models/genre");
const GameInstance = require("./models/gameinstance");

const genres = [];
const designers = [];
const games = [];
const gameinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDesigners();
  await createGames();
  await createGameInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

main().catch((err) => console.log(err));

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function designerCreate(index, first_name, last_name) {
  const designerdetail = { first_name: first_name, last_name: last_name };

  const designer = new Designer(designerdetail);

  await designer.save();
  designers[index] = designer;
  console.log(`Added designer: ${first_name} ${last_name}`);
}

async function gameCreate(index, title, designer, description, image, genre) {
  const gamedetail = {
    title: title,
    designer: designer,
    description: description,
    image: image,
  };
  if (genre != false) gamedetail.genre = genre;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function gameInstanceCreate(index, game, publisher, price, status) {
  const gameinstancedetail = {
    game: game,
    publisher: publisher,
    price: price,
  };
  if (status != false) gameinstancedetail.status = status;

  const gameinstance = new GameInstance(gameinstancedetail);
  await gameinstance.save();
  gameinstances[index] = gameinstance;
  console.log(`Added gameinstance: ${publisher}`);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Strategy"),
    genreCreate(1, "Co-Op"),
    genreCreate(2, "Thematic"),
  ]);
}

async function createDesigners() {
  console.log("Adding designers");
  await Promise.all([
    designerCreate(0, "Martin", "Wallace"),
    designerCreate(1, "Rob", "Daviau"),
    designerCreate(2, "Matt", "Leacock"),
    designerCreate(3, "Isaac", "Childress"),
    designerCreate(4, "Matthias", "Wigge"),
    designerCreate(5, "Paul", "Dennen"),
  ]);
}

async function createGames() {
  console.log("Adding Games");
  await Promise.all([
    gameCreate(
      0,
      "Brass: Lancashire",
      [designers[0]],
      "Brass: Lancashire — first published as Brass — is an economic strategy game that tells the story of competing cotton entrepreneurs in Lancashire during the industrial revolution. You must develop, build, and establish your industries and network so that you can capitalize demand for iron, coal and cotton..",
      "https://cf.geekdo-images.com/tHVtPzu82mBpeQbbZkV6EA__itemrep/img/A9DQBjrHvs1YlYCWMD0mtp-jnNc=/fit-in/246x300/filters:strip_icc()/pic3469216.jpg",
      [genres[0]]
    ),
    gameCreate(
      1,
      "Pandemic Legacy: Season 1",
      [designers[1], designers[2]],
      "Pandemic Legacy is a co-operative campaign game, with an overarching story-arc played through 12-24 sessions, depending on how well your group does at the game. At the beginning, the game starts very similar to basic Pandemic, in which your team of disease-fighting specialists races against the clock to travel around the world, treating disease hotspots while researching cures for each of four plagues before they get out of hand.",
      "https://cf.geekdo-images.com/-Qer2BBPG7qGGDu6KcVDIw__itemrep/img/Wxe36yaTzpiIVhEefHOYzFv7Ucc=/fit-in/246x300/filters:strip_icc()/pic2452831.png",
      [genres[1], genres[2]]
    ),
    gameCreate(
      2,
      "Gloomhaven",
      [designers[3]],
      "Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and their own reasons for traveling to this dark corner of the world. Players must work together out of necessity to clear out menacing dungeons and forgotten ruins. In the process, they will enhance their abilities with experience and loot, discover new locations to explore and plunder, and expand an ever-branching story fueled by the decisions they make.",
      "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__itemrep/img/0IdBRA_G-ZdrNaxI4Z1LPQMZD0I=/fit-in/246x300/filters:strip_icc()/pic2437871.jpg",
      [genres[0], genres[2]]
    ),
    gameCreate(
      3,
      "Ark Nova",
      [designers[4]],
      "In Ark Nova, you will plan and design a modern, scientifically managed zoo. With the ultimate goal of owning the most successful zoological establishment, you will build enclosures, accommodate animals, and support conservation projects all over the world. Specialists and unique buildings will help you in achieving this goal.",
      "https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__itemrep/img/IRqrT7kOqPQilogauyQkOnLx-HU=/fit-in/246x300/filters:strip_icc()/pic6293412.jpg",
      [genres[0]]
    ),
    gameCreate(
      4,
      "Dune: Imperium",
      [designers[5]],
      "Dune: Imperium is a game that uses deck-building to add a hidden-information angle to traditional worker placement. It finds inspiration in elements and characters from the Dune legacy, both the new film from Legendary Pictures and the seminal literary series from Frank Herbert, Brian Herbert, and Kevin J. Anderson.",
      "https://cf.geekdo-images.com/PhjygpWSo-0labGrPBMyyg__itemrep/img/3_xJ0tO5L62bUp2oRfjeVS0DHX0=/fit-in/246x300/filters:strip_icc()/pic5666597.jpg",
      [genres[0]]
    ),
  ]);
}

async function createGameInstances() {
  console.log("Adding instances");
  await Promise.all([
    gameInstanceCreate(0, games[0], "Roxley", "64.99", "In Stock"),
    gameInstanceCreate(1, games[0], "Roxley", "64.99", "Ordered"),
    gameInstanceCreate(2, games[0], "Warfrog Games", "24.99", "In Stock"),
    gameInstanceCreate(3, games[1], "Z-Man Games", "59.99", "In Stock"),
    gameInstanceCreate(4, games[1], "Z-Man Games", "39.99", "Damaged"),
    gameInstanceCreate(5, games[2], "Cephalofair Games", "99.99", "Ordered"),
    gameInstanceCreate(6, games[2], "Cephalofair Games", "99.99", "Ordered"),
    gameInstanceCreate(7, games[3], "Capstone Games", "59.99", "In Stock"),
    gameInstanceCreate(8, games[3], "Capstone Games", "49.99", "Damaged"),
    gameInstanceCreate(9, games[4], "Dire Wolf", "39.99", "In Stock"),
    gameInstanceCreate(10, games[4], "Dire Wolf", "39.99", "Ordered"),
  ]);
}
