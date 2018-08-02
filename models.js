const mongoose = require("mongoose");

let connectionUrl = process.env.CONNECTION_URL

mongoose.connect(
  connectionUrl,
  {
    useNewUrlParser: true
  }
);

let notaScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

let userScheme = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  pswd: {
    type: String,
    required: true
  },
  notas: [notaScheme]
});

let Usuario = mongoose.model("Usuario", userScheme);

let Nota = mongoose.model("Nota", notaScheme);

module.exports = { Usuario, Nota };
