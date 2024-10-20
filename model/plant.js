const { Schema, model } = require("mongoose");

const plantSchema = new Schema(
  {
    name: String,
    leaf: Number,
    height: Number,
    flower: Number,
    buah: Number,
  },
  {
    timestamps: true,
  }
);

const plant = model("plantgrowths", plantSchema);


module.exports = plant;
