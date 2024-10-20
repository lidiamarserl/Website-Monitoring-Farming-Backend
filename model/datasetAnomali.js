const { Schema, model } = require("mongoose");


const anomalyDetectionSchema = new Schema(
  {
    sensor_name: String,
    anomaly: Number,
    value: Number,
    index_id: String,
    device_id: String,
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
    //ini kalau createdAt nyala
    // timestamps: false, 
  }
);

const AnomalyDetection = model("anomalydetections", anomalyDetectionSchema);

module.exports = AnomalyDetection;
