let app = require("express")();
let schemas = require("./models");
let bodyParser = require("body-parser");
let Usuario = schemas.Usuario;
let Nota = schemas.Nota;

let port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.get("/", (req, res) => res.send("Hola desde backend para BUAP"));

app.post("/user", (req, res) => {
  let { user, pswd } = req.body;

  Usuario.findOne({ user }, (err, findUser) => {
    if (findUser) {
      res.send({ error: "Ya existe este usuario" });
      return;
    }

    let usuario = new Usuario({ user, pswd });
    usuario
      .save()
      .then(savedUser => res.send({ success: savedUser._id }))
      .catch(err =>
        res.send({ error: "Parámetros inválidos, checa tus llaves" })
      );
  });
});

app.post("/login", (req, res) => {
  let { user, pswd } = req.body;

  Usuario.findOne({ user, pswd }, (err, queryUser) => {
    if (err) {
      res.send({ error: "Error crítico" });
      return;
    }

    if (queryUser) res.send({ success: `Bienvenido ${queryUser.user}` });
    else res.send({ error: "Credenciales inválidas" });
  });
});

app.post("/notas/:id", (req, res) => {
  let id = req.params.id;

  let { title, description, date } = req.body;

  Usuario.findById(id, (err, user) => {
    if (err) {
      res.send({ error: "No existe el usuario :(" });
      return;
    }

    user.notas.push(new Nota({ title, description, date }));

    user
      .save()
      .then(updatedUser => res.send(updatedUser))
      .catch(err =>
        res.send({ error: "Parámetros inválidos, checa tus llaves" })
      );
  });
});

app.get("/notas/:id", (req, res) => {
  let id = req.params.id;

  Usuario.findById(id, (err, user) => {
    if (err) {
      res.send({ error: "No existe el usuario :(" });
      return;
    }

    res.send(user.notas);
  });
});

app.listen(port, () => console.log(`La magia está en el puerto ${port}`));
