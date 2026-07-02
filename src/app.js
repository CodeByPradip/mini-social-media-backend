const express = require("express");
const dns = require("dns");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const friendRoutes = require("./routes/friend.routes");


dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRutes);
app.use("/api/user", userRoutes);
app.use("/api/friends",friendRoutes)

module.exports = app;
