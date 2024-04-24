require("dotenv").config();
const mongoose = require("mongoose");


// local database connection
// mongoose.connect('mongodb://localhost:27017/usersdb',

// mongdb atlass connection
url = process.env.DATABASE_CONNECTION_URI;
db_username = process.env.DATABASE_USERNAME;
db_password = process.env.DATABASE_PASSWORD;



const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set('strictQuery', false);
mongoose
  // .connect(url, connectionParams)
  .connect(
    // `mongodb+srv://${db_username}:${db_password}@argon-pay.hptaa.mongodb.net/pencentralWebsiteDB`,
    // connectionParams
    `mongodb+srv://${db_username}:${db_password}@cluster0.tse4bwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });