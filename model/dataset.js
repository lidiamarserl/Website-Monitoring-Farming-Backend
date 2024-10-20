const { Schema, model } = require("mongoose");

const datasetSchema = new Schema(
  {
    index_id: String,
    device_id: String,
    value: Number,
  },
  {
    timestamps: true,
  }
);

const dataset = model("datasets", datasetSchema);

// const anomalyDetectionSchema = new Schema(
//   {
//     sensor_name: String,
//     anomaly: Number,
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//     //ini kalau createdAt nyala
//     // timestamps: false, 
//   }
// );

// const AnomalyDetection = model("anomalydetecion", anomaliSchema);

// module.exports = {
//   dataset,
//   AnomalyDetection
// };

module.exports = dataset;
