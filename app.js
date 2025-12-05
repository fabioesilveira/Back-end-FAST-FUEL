// Importacoes
const express = require("express");
const cors = require("cors");
// const templateRoutes = require("./routes/templateRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const salesRoutes = require("./routes/salesRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");

// Iniciando aplicacao
const app = express();
// Config da aplicacao
app.use(express.json()); // Dizendo que vai ser api a base de json
app.use(cors()); // Seguranca dos dados - ignora e simples  mente faz -

app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);
app.use("/contact-us", contactUsRoutes);

module.exports = app;