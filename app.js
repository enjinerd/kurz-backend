const express = require("express");
const helmet = require("helmet");
const { ErrorResponseObject } = require("./common/http");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 Minutes / 5 Request
  max: 5,
  message: 429,
});

//  apply to all requests
app.use(limiter);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use("/", routes);

// default catch all handler
app.all("*", (req, res) =>
  res.status(404).json(new ErrorResponseObject("route not defined"))
);

module.exports = app;
