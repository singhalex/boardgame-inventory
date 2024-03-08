const Designer = require("../models/designer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("designer_form", { title: "Create Designer" });
});

// Handle Designer create on POST
exports.designer_create_post = [
  // Validate and sanitize fields
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlpha()
    .withMessage("First name has non-alpha characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified")
    .isAlpha()
    .withMessage("Last name has non-alpha characters."),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors and sanitation
    const errors = validationResult(req);

    // create Designer object with escaped and trimmed data
    const designer = new Designer({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized & error msgs
      res.render("designer_form", {
        title: "Create Designer",
        designer: designer,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid

      //Save designer
      await designer.save();
      // Redirect to new designer detail
      res.redirect(designer.url);
    }
  }),
];

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
