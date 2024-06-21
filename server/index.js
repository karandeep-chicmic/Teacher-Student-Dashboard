const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expressMiddleware = require("./middlewares/expressMiddleware");

dotenv.config();

const app = express();
const PORT = 2020;

mongoose.connect("mongodb://localhost:27017/school", {});
mongoose.connection.on("connected", () => {
  console.log("MongoDb is successfully Connected!!");
});
mongoose.connection.on("error", (err) => {
  console.log(`mongoDb not connected due to error ${err}`);
});

const startNodeServer = async () => {
  await expressMiddleware(app);
};

startNodeServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Server starting failed:", e.message);
  });
