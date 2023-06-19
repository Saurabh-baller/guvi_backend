// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const userRoutes = require("./routes/users");

// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// app.use("/api/users", userRoutes);

// mongoose.connect('mongodb+srv://msaurabh0007:ad1QUNeKMriNosqa@cluster0.cz3x9ad.mongodb.net/myDatabase?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
 
// });

// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("MongoDB database connection established successfully");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:["https://deploy-mern-1whq.app"],
  methods: ["POST", "GET"],
  credentials:true
}));
app.use(express.json());
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});