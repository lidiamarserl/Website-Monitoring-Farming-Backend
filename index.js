const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

mongoose.Promise = global.Promise;

const app = express();

const dataset =require('./model/dataset.js')
const AnomalyDetection = require('./model/datasetAnomali.js')
const plant = require('./model/plant.js')
const forecast = require('./model/forecast.js')
const Device = require('./model/devices.js');
const datasetIndex = require('./model/datasetindex.js');

// Koneksi ke database MongoDB
mongoose.connect("mongodb+srv://smartfarmingunpad:Zg2btY2zwNddpNsvLrYGNGtgTSZS6xxX@smartfarmingunpad.usves.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "smartfarmingunpad",
})
.then(() => {
    console.log("Database successfully connected!");
})
.catch(error => {
    console.log("Could not connect to database: " + error);
});

// Middleware
app.use(cors({
    origin: "*",
}));
app.use(express.json());

// Endpoint untuk login
app.post("/user/login", (req, res) => {
    console.log(req.body);
    axios.post("https://api.smartfarmingunpad.com/user/login", {
        email: req.body.email,
        password: req.body.password,
    })
    .then((response) => {
        console.log(response.data);
        res.send(response.data); // Respond to the client
    })
    .catch((error) => {
        res.send(error);
    });
});

// Endpoint datalist buat 200 data.
app.get("/datalist", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query
    dataset
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({ createdAt: -1 })
    .limit(200)
    .then((data) => {
        const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
        const retrievalLatency = dbRetrievalEndTime - startTime;
        console.log(`Retrieval Latency for /datalist: ${retrievalLatency} ms`);

        // Sekarang kirim respons ke frontend
        res.json(data);

        const responseEndTime = Date.now(); // Waktu setelah respons dikirim
        const responseLatency = responseEndTime - dbRetrievalEndTime;
        console.log(`Response Transmission Latency for /datalist: ${responseLatency} ms`);
    })
    .catch(err => {
        return res.json(err);
    });
});

// Endpoint untuk 100 data
app.get("/dataBanyak", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query
    dataset
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({ createdAt: -1 })
    .limit(100)
    .then((data) => {
        const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
        const retrievalLatency = dbRetrievalEndTime - startTime;
        console.log(`Retrieval Latency for /dataBanyak: ${retrievalLatency} ms`);

        res.json(data);

        const responseEndTime = Date.now(); // Waktu setelah respons dikirim
        const responseLatency = responseEndTime - dbRetrievalEndTime;
        console.log(`Response Transmission Latency for /dataBanyak: ${responseLatency} ms`);
    })
    .catch(err => {
        return res.json(err);
    });
});

// Endpoint anomaly detection
app.get("/anomalyDetection", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query
    AnomalyDetection
    .find({
        sensor_name: req.query.sensor_name
    })
    .sort({ createdAt: -1 })
    .limit(100)
    .then((data) => {
        const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
        const retrievalLatency = dbRetrievalEndTime - startTime;
        console.log(`Retrieval Latency for /anomalyDetection: ${retrievalLatency} ms`);

        res.json(data);

        const responseEndTime = Date.now(); // Waktu setelah respons dikirim
        const responseLatency = responseEndTime - dbRetrievalEndTime;
        console.log(`Response Transmission Latency for /anomalyDetection: ${responseLatency} ms`);
    })
    .catch(err => {
        console.error('Query Error:', err);
        return res.json(err);
    });
});

// Endpoint anomaly detection 2
// app.get("/anomalyDetection2", (req, res) => {
//     console.log("req", req.query);
//     const startTime = Date.now(); // Catat waktu mulai sebelum query
//     AnomalyDetection
//     .find({
//         device_id: req.query.device_id,
//         index_id: req.query.index_id
//     })
//     .sort({ createdAt: -1 })
//     .limit(100)
//     .then((data) => {
//         const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
//         const retrievalLatency = dbRetrievalEndTime - startTime;
//         console.log(`Retrieval Latency for /anomalyDetection: ${retrievalLatency} ms`);

//         res.json(data);

//         const responseEndTime = Date.now(); // Waktu setelah respons dikirim
//         const responseLatency = responseEndTime - dbRetrievalEndTime;
//         console.log(`Response Transmission Latency for /anomalyDetection: ${responseLatency} ms`);
//     })
//     .catch(err => {
//         console.error('Query Error:', err);
//         return res.json(err);
//     });
// });

// Endpoint untuk post data anomali
app.post("/anomalyDetection", (req, res) => {
    const { sensor_name, value, anomaly } = req.body; // Menggunakan destructuring assignment

    const newAnomaly = new AnomalyDetection({
        index_id,
        device_id,
        sensor_name,
        value,
        anomaly,
        createdAt: new Date().toISOString()  // Set to current date/time
    });

    newAnomaly.save()
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });
});



// Endpoint forecasting
app.get("/forecast", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query
    forecast
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({ createdAt: -1 })
    .limit(90)
    .then((data) => {
        const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
        const retrievalLatency = dbRetrievalEndTime - startTime;
        console.log(`Retrieval Latency for /forecast: ${retrievalLatency} ms`);

        res.json(data);

        const responseEndTime = Date.now(); // Waktu setelah respons dikirim
        const responseLatency = responseEndTime - dbRetrievalEndTime;
        console.log(`Response Transmission Latency for /forecast: ${responseLatency} ms`);
    })
    .catch(err => {
        return res.json(err);
    });
});

// Endpoint data pertumbuhan tanaman
app.get("/plant", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query
    plant
    .find({
        name: req.query.name
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .then((data) => {
        const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
        const retrievalLatency = dbRetrievalEndTime - startTime;
        console.log(`Retrieval Latency for /plant: ${retrievalLatency} ms`);

        res.json(data);

        const responseEndTime = Date.now(); // Waktu setelah respons dikirim
        const responseLatency = responseEndTime - dbRetrievalEndTime;
        console.log(`Response Transmission Latency for /plant: ${responseLatency} ms`);
    })
    .catch(err => {
        return res.json(err);
    });
});


// Middleware untuk validasi ObjectId
function validateObjectId(req, res, next) {
    const { id } = req.query;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    req.objectId = new ObjectId(id); // Simpan ObjectId yang valid dalam request
    next();
}

// endpoin device
// app.get("/device", validateObjectId, (req, res) => {
//     const startTime = Date.now();

//     Device
//     .findOne({
//         _id: req.objectId // Gunakan ObjectId yang sudah divalidasi dan disimpan di request
//     })
//     .then((data) => {
//         const dbRetrievalEndTime = Date.now();
//         const retrievalLatency = dbRetrievalEndTime - startTime;
//         console.log(`Retrieval Latency for /deviceById: ${retrievalLatency} ms`);

//         if (!data) {
//             return res.status(404).json({ error: "Device not found" });
//         }

//         res.json(data);

//         const responseEndTime = Date.now();
//         const responseLatency = responseEndTime - dbRetrievalEndTime;
//         console.log(`Response Transmission Latency for /deviceById: ${responseLatency} ms`);
//     })
//     .catch(err => {
//         console.error('Query Error:', err);
//         return res.status(500).json(err);
//     });
// });

// endpoint datasetindexes
// app.get("/datasetindex", validateObjectId, (req, res) => {
//     const startTime = Date.now();

//     datasetIndex
//     .findOne({
//         _id: req.objectId // Gunakan ObjectId yang sudah divalidasi dan disimpan di request
//     })
//     .then((data) => {
//         const dbRetrievalEndTime = Date.now();
//         const retrievalLatency = dbRetrievalEndTime - startTime;
//         console.log(`Retrieval Latency for /deviceById: ${retrievalLatency} ms`);

//         if (!data) {
//             return res.status(404).json({ error: "Device not found" });
//         }

//         res.json(data);

//         const responseEndTime = Date.now();
//         const responseLatency = responseEndTime - dbRetrievalEndTime;
//         console.log(`Response Transmission Latency for /deviceById: ${responseLatency} ms`);
//     })
//     .catch(err => {
//         console.error('Query Error:', err);
//         return res.status(500).json(err);
//     });
// });


///blok percobaan
// Endpoint untuk /datalist
app.get("/datalist2", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query

    let query = {};
    if (req.query.device_id) query.device_id = req.query.device_id;
    if (req.query.index_id) query.index_id = req.query.index_id;

    dataset
        .find(query) // Gunakan query dinamis
        .sort({ createdAt: -1 })
        .limit(2000)
        .then((data) => {
            const dbRetrievalEndTime = Date.now();
            const retrievalLatency = dbRetrievalEndTime - startTime;
            console.log(`Retrieval Latency for /datalist: ${retrievalLatency} ms`);

            res.json(data);

            const responseEndTime = Date.now();
            const responseLatency = responseEndTime - dbRetrievalEndTime;
            console.log(`Response Transmission Latency for /datalist: ${responseLatency} ms`);
        })
        .catch(err => {
            console.error('Query Error:', err);
            return res.json(err);
        });
});

// Endpoint untuk /anomalyDetection2
app.get("/anomalyDetection2", (req, res) => {
    console.log("req", req.query);
    const startTime = Date.now(); // Catat waktu mulai sebelum query

    // Pipeline agregasi untuk mendapatkan dokumen terakhir dari setiap kombinasi index_id dan device_id
    AnomalyDetection.aggregate([
        {
            // Group berdasarkan device_id dan index_id
            $group: {
                _id: { device_id: "$device_id", index_id: "$index_id" },
                latestEntry: { $last: "$$ROOT" } // Mengambil dokumen terakhir
            }
        },
        {
            // Menyesuaikan hasil agar hanya menampilkan dokumen yang relevan
            $replaceRoot: { newRoot: "$latestEntry" }
        },
        {
            // Mengurutkan hasil berdasarkan waktu pembuatan
            $sort: { createdAt: -1 }
        }
    ])
    .then((data) => {
        const dbRetrievalEndTime = Date.now();
        const retrievalLatency = dbRetrievalEndTime - startTime;
        console.log(`Retrieval Latency for /anomalyDetection2: ${retrievalLatency} ms`);

        res.json(data);

        const responseEndTime = Date.now();
        const responseLatency = responseEndTime - dbRetrievalEndTime;
        console.log(`Response Transmission Latency for /anomalyDetection2: ${responseLatency} ms`);
    })
    .catch(err => {
        console.error('Query Error:', err);
        return res.status(500).json(err);
    });
});


// Endpoint untuk /datasetindex
app.get("/datasetindex", (req, res) => {
    const startTime = Date.now();

    if (req.query.id) {
        // Jika ID diberikan, cari berdasarkan ID
        const objectId = mongoose.Types.ObjectId(req.query.id);
        datasetIndex
            .findOne({
                _id: objectId
            })
            .then((data) => {
                const dbRetrievalEndTime = Date.now();
                const retrievalLatency = dbRetrievalEndTime - startTime;
                console.log(`Retrieval Latency for /datasetindex: ${retrievalLatency} ms`);

                if (!data) {
                    return res.status(404).json({ error: "Device not found" });
                }

                res.json(data);

                const responseEndTime = Date.now();
                const responseLatency = responseEndTime - dbRetrievalEndTime;
                console.log(`Response Transmission Latency for /datasetindex: ${responseLatency} ms`);
            })
            .catch(err => {
                console.error('Query Error:', err);
                return res.status(500).json(err);
            });
    } else {
        // Jika ID tidak diberikan, ambil semua dokumen
        datasetIndex
            .find() // Menampilkan semua dokumen
            .sort({ createdAt: -1 })
            .then((data) => {
                const dbRetrievalEndTime = Date.now();
                const retrievalLatency = dbRetrievalEndTime - startTime;
                console.log(`Retrieval Latency for /datasetindex: ${retrievalLatency} ms`);

                res.json(data);

                const responseEndTime = Date.now();
                const responseLatency = responseEndTime - dbRetrievalEndTime;
                console.log(`Response Transmission Latency for /datasetindex: ${responseLatency} ms`);
            })
            .catch(err => {
                console.error('Query Error:', err);
                return res.status(500).json(err);
            });
    }
});

// Endpoint untuk menampilkan semua dokumen dalam koleksi devices
app.get("/devices", (req, res) => {
    console.log("Fetching all devices...");
    const startTime = Date.now(); // Catat waktu mulai sebelum query

    Device.find() // Tanpa parameter untuk mendapatkan semua dokumen
        .then((data) => {
            const dbRetrievalEndTime = Date.now(); // Waktu setelah data diambil dari database
            const retrievalLatency = dbRetrievalEndTime - startTime;
            console.log(`Retrieval Latency for /devices: ${retrievalLatency} ms`);

            res.json(data); // Mengirimkan semua data yang ditemukan

            const responseEndTime = Date.now(); // Waktu setelah respons dikirim
            const responseLatency = responseEndTime - dbRetrievalEndTime;
            console.log(`Response Transmission Latency for /devices: ${responseLatency} ms`);
        })
        .catch(err => {
            console.error('Query Error:', err);
            return res.status(500).json(err); // Mengembalikan error jika ada
        });
});




// Endpoint root
app.get("/", (req, res) => {
    res.send({ message: "Halooo" });
});

// Menjalankan server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
