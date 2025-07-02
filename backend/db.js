const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to mongoose succesfully"))
    .catch((e) => console.log(e.message));
};

module.exports = connectToMongo;