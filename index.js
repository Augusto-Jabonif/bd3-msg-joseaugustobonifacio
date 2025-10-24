const express = require("express");
const ejs = require("ejs");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// 🔗 Conecta ao MongoDB Atlas
function connectDB() {
  const dbUrl = "mongodb+srv://jabonif:VYdgY9H4FoZqtsrT@cluster0.3e6pwdk.mongodb.net/test";
  mongoose.connect(dbUrl);

  mongoose.connection.on("error", console.error.bind(console, "Erro de conexão:"));
  mongoose.connection.once("open", () => {
    console.log("✅ Conectado ao MongoDB Atlas!");
  });
}

connectDB();

// 🧩 Define o modelo da mensagem
const Message = mongoose.model("Message", {
  usuario: String,
  dataHora: String,
  timestamp: Date, // usado para ordenação
  mensagem: String,
});

// 🖼️ Configura o servidor Express
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", ejs.renderFile);
app.use("/", (req, res) => {
  res.render("index.html");
});

// 🔌 Lógica do chat com Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Usuário conectado: " + socket.id);

  // Envia mensagens ordenadas ao conectar
  Message.find({}).sort({ timestamp: 1 })
    .then((document) => {
      socket.emit("previousMessage", document);
    })
    .catch((error) => {
      console.log("❌ Erro ao buscar mensagens: " + error);
    });

  // Recebe e salva nova mensagem
  socket.on("sendMessage", (data) => {
    const message = new Message(data);
    message
      .save()
      .then(() => {
        io.emit("receivedMessage", data); // envia para todos
      })
      .catch((error) => {
        console.log("❌ Erro ao salvar mensagem: " + error);
      });
  });
});

// 🚀 Inicia o servidor
server.listen(3000, () => {
  console.log("🟢 Servidor rodando em http://localhost:3000");
});