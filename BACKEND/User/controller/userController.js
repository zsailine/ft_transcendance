import bcrypt from "bcrypt";
import  db  from "../migration.js";

const createUser = async (req, rep) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) 
        return rep.code(400).send({ error: "username , email and password required" });
    const hashedPassword = await bcrypt.hash(password, 10);
    try 
    {
        const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        const result = stmt.run(username, email, hashedPassword);
        rep.code(201).send({ id: result.lastInsertRowid, username, email, password: hashedPassword });
    } 
    catch (e) 
    {
        rep.code(400).send({ error: "username and email must be unique" });
    }
}

const getAllUsers = (req, rep) => {
    const users = db.prepare("SELECT * FROM users").all();
    rep.send(users);
}

const getUserByUsername = (req, rep) => {
    const { username } = req.params;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) 
      return rep.code(404).send({ error: "User not found" });
    rep.send(user);
}

export { createUser , getAllUsers , getUserByUsername };