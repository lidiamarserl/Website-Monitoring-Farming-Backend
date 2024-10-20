const { Schema, model } = require("mongoose");

const deviceSchema = new Schema(
  {
    user_id: String,
    name: String,
    description: String,
    token: String,
  }
);

const Device = model("devices", deviceSchema);

module.exports = Device;
