const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  publisher: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["In Stock", "Ordered", "Damaged"],
    default: "In Stock",
  },
});

GameInstanceSchema.virtual("url").get(function () {
  return `/inventory/gameinstance/${this._id}`;
});

module.exports = mongoose.model("GameInstance", GameInstanceSchema);
