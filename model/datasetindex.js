const { Schema, model } = require("mongoose");

const datasetIndexSchema = new Schema(
  {
    user_id: String,
    name: String,
    description: String,
    type: String,
  }
);

const datasetIndex = model("datasetindexes", datasetIndexSchema);

module.exports = datasetIndex;
