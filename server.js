const app = require("./app");
const connection = require("./connection");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  try {
    const [result] = await connection.execute("SELECT 1");
    if (result) console.log("Conexão ao BD feita com sucesso!");
  } catch (err) {
    console.error("⚠️ Falha ao conectar no MySQL (não vou derrubar o servidor):");
    console.error(err.message);
  }
});
