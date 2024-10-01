require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// express
const express = require("express");
const app = express();

// packages
const { StatusCodes } = require("http-status-codes");
const morgan = require("morgan");

// dataBase
const connDb = require("./db/connect");


// routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRote");
const productRoute = require("./routes/productRoute");
const assignedProductRoute = require("./routes/assignedProductRoute");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// const req = require("express/lib/request");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(xss());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send('<h1>Support Team api</h1><a href="/apiDocs">Documentation</a>');
});

app.get("/test", (req, res) => res.send("Test Route Response"));

app.use("/apiDocs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/st/auth", authRoute);
app.use("/api/st/user", userRoute);
app.use("/api/st/product", productRoute);
app.use("/api/st/assignedProduct", assignedProductRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
console.log(port, "port url");
const start = async () => {
  try {
    await connDb(process.env.MONGO_URL);
    app.listen(port, () => console.log("SortedRack Backend Service is Runnning.."));
  } catch (error) {
    console.log(error, "MongoDB URL is invalid.");
  }
};

start();