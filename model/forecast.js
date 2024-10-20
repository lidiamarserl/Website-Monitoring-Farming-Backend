const { Schema, model } = require("mongoose");

const forecastSchema = new Schema(
  {
    index_id: String,
    device_id: String,
    predicted_value: Number,
  },
  {
    timestamps: true,
  }
);

const forecast = model("nutrientforecasts", forecastSchema);

module.exports = forecast;
