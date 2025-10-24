const database = "test";
const collection = "messages";

// Seleciona o banco
use(database);

// 1️ - Listar todas as mensagens em ordem de envio;
//db.messages.find().sort({ _id: 1 })
//db.messages.find().sort({ timestamp: 1 })


// 2️ - Listar mensagens em ordem inversa;
//db.messages.find().sort({ _id: -1 })
//db.messages.find().sort({ timestamp: -1 })


// 3️ -  Procurar o trecho de uma conversa (exemplo: "imprevisto")
//db[collection].find({  mensagem: /tiozinho/i })
