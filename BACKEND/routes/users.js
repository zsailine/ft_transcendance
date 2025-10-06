export default async function userRoutes(fastify) {
  const db = fastify.db;

  fastify.get("/users", (req, rep) => {
    const users = db.prepare("SELECT * FROM users").all();
    rep.send(users);
  });

  fastify.post("/users", (req, rep) => {
    const { name, email } = req.body;
    if (!name || !email) return rep.code(400).send({ error: "name et email requis" });

    try {
      const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
      const result = stmt.run(name, email);
      rep.code(201).send({ id: result.lastInsertRowid, name, email });
    } catch (e) {
      rep.code(400).send({ error: "email déjà utilisé" });
    }
  });
}
