require("dotenv").config({
  path:
    process.env.NODE_ENV === "development"
      ? ".env.development"
      : "production.env",
});
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const cookieParser = require("cookie-parser");
require("express-async-errors");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const { APP_PORT } = require("./utils/ports");
const { handlerError } = require("./error/error.helper");
const { authRoute } = require("./routes/auth.route");
const { taskRoute } = require("./routes/task.route");
const { authorizedUser } = require("./middleware/auth.middleware");
const { listRoute } = require("./routes/list.route");
const { boardRoute } = require("./routes/board.route");
const app = express();

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3001", // or this could be a specific list or match patterns
  credentials: true, // Allow cookies and credentials to be sent along
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(cookieParser()); // This will parse cookies from incoming requests
app.use(morgan('dev'))
app.use("/auth", authRoute);
app.use("/users", authorizedUser, userRoute);
app.use("/list", authorizedUser, listRoute);
app.use("/board", authorizedUser, boardRoute);
app.use("/tasks", authorizedUser, taskRoute);
app.use(handlerError);

app.listen(APP_PORT, () => {
  console.log("CONNECTED ON PORT: ", APP_PORT);
});
