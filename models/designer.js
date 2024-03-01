const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DesignerSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
});

DesignerSchema.virtual("name").get(function () {
  let fullname = "";
  // returns empty string if no first or last name
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }

  return fullname;
});

DesignerSchema.virtual("url").get(function () {
  return `/inventory/designer/${this._id}`;
});

module.exports = mongoose.model("Designer", DesignerSchema);
