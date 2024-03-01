const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true },
  designer: [{ type: Schema.Types.ObjectId, ref: "Designer", required: true }],
  description: { type: String, required: true },
  image: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

GameSchema.virtual("url").get(function () {
  return `/inventory/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);
