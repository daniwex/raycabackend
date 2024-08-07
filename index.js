const path = require('path');
const yaml = require("yamljs");
const swaggerUI = require("swagger-ui-express");

const swaggerPath = path.join(__dirname, 'swagger.yaml');
const swagger = yaml.load(swaggerPath);
console.log(swagger)

const authRouter = require("./routes/ticket");
const loginAuthRouter = require("./routes/auth");
const connectMongoose = require("./db/connectDB");
const express = require("express");
const auth = require("./middleware/auth");
const createRouter = require("./routes/createusers");
const isAdmin = require("./middleware/admin");
const cors = require("cors");
const xss = require("xss-clean");
let PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(xss());


app.use(cors({
  origin: 'https://rayca-backend.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/api/tickets/", auth, authRouter);
app.use("/api/", loginAuthRouter);
app.use("/api/", auth, isAdmin, createRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));

const start = async () => {
  try {
    await connectMongoose(process.env.MONGODB_URI);
    app.listen(PORT);
  } catch (error) {
    console.log(error);
  }
};

start();
