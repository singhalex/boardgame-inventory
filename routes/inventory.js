const express = require("express");
const router = express.Router();

// Require controller modules
const game_controller = require("../controllers/gameControllers");
const designer_controller = require("../controllers/designerController");
const genre_controller = require("../controllers/genreControllers");
const game_instance_controller = require("../controllers/gameinstanceControllers");

/// GAME ROUTES ///

// GET inventory home page
router.get("/", game_controller.index);

// GET request for creating a Game. Must come before routes that display Game (uses id)
router.get("/game/create", game_controller.game_create_get);

// POST request for creating a Game
router.post("/game/create", game_controller.game_create_post);

// GET request to delete Game
router.get("/game/:id/delete", game_controller.game_delete_get);

// POST request to delete Game
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET request to update Game
router.get("/game/:id/update", game_controller.game_update_get);

// POST request to update Game
router.post("/game/:id/update", game_controller.game_update_post);

// GET request for specific Game
router.get("/game/:id", game_controller.game_detail);

// GET request for all Game items
router.get("/games", game_controller.game_list);

/// DESIGNER ROUTER ///

// GET request for creating Designer. Must come before route for specific Designer (uses id)
router.get("/designer/create", designer_controller.designer_create_get);

// POST request for creating Designer
router.post("/designer/create", designer_controller.designer_create_post);

// GET request to delete Designer
router.get("/designer/:id/delete", designer_controller.desiger_delete_get);

// POST request to delete Designer
router.post("/designer/:id/delete", designer_controller.designer_delete_post);

// GET request to update Designer
router.get("/designer/:id/update", designer_controller.designer_update_get);

// POST request to update Designer
router.post("/designer/:id/update", designer_controller.designer_update_post);

// GET request for specifit Designer
router.get("/designer/:id", designer_controller.designer_detail);

// GET request for all Designer items
router.get("/designers", designer_controller.designer_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. Must come before router specific Genre (uses id)
router.get("/genre/create", genre_controller.genre_create_get);

// POST request for creating Genre
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for specific Genre
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for all Genre items
router.get("/genres", genre_controller.genre_list);

/// GAME INSTANCES ///

// GET request for creating a Game Instance. Must come before router for specific Game Instance (uses id)
router.get(
  "/gameinstance/create",
  game_instance_controller.gameinstance_create_get
);

// POST request for creating a Game Instance
router.post(
  "/gameinstance/create",
  game_instance_controller.gameinstance_create_post
);

// GET request to delete Game Instance
router.get(
  "/gameinstance/:id/delete",
  game_instance_controller.gameinstance_delete_get
);

// POST request to delete Game Instance
router.post(
  "/gameinstance/:id/delete",
  game_instance_controller.gameinstance_delete_post
);

//GET request to update Game Instance
router.get(
  "/gameinstance/:id/update",
  game_instance_controller.gameinstance_update_get
);

// POST request to update Game Instance
router.post(
  "/gameinstance/:id/update",
  game_instance_controller.gameinstance_update_post
);

// GET request for a specific Game Instance
router.get("/gameinstance/:id", game_instance_controller.gameinstance_detail);

// POST request for all Game Instance items
router.get("/gameinstances", game_instance_controller.gameinstance_list);

module.exports = router;
