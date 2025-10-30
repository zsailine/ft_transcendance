import bcrypt from "bcrypt";
import db from "../migration.js";

const createUser = async (req, rep) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return rep.code(400).send({ error: "username , email and password required" });
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        const result = stmt.run(username, email, hashedPassword);
        rep.code(201).send({ id: result.lastInsertRowid, username, email, password: hashedPassword });
    }
    catch (e) {
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

const updateUser = async (req, rep) => {
    try {
        console.log("Received data:", req.body);
        const { username, avatar, cover_image, nickname } = req.body;

        const usernameValue = username?.value || username;
        const nicknameValue = nickname?.value || nickname;

        console.log("Username:", usernameValue);
        console.log("Nickname:", nicknameValue);
        console.log("Avatar type:", avatar?.type);
        console.log("Cover image type:", cover_image?.type);

        let avatarBuffer = null;
        let coverImageBuffer = null;

        if (avatar && avatar.type === 'file') {
            try {
                avatarBuffer = await avatar.toBuffer();
                console.log("Avatar buffer size:", avatarBuffer.length);
            } catch (error) {
                console.error("Error converting avatar to buffer:", error);
            }
        }

        if (cover_image && cover_image.type === 'file') {
            try {
                coverImageBuffer = await cover_image.toBuffer();
                console.log("Cover image buffer size:", coverImageBuffer.length);
            } catch (error) {
                console.error("Error converting cover image to buffer:", error);
            }
        }

        console.log("Final avatar buffer:", avatarBuffer ? avatarBuffer.length : "null");
        console.log("Final cover buffer:", coverImageBuffer ? coverImageBuffer.length : "null");

        const stmt = db.prepare("UPDATE users SET avatar = ?, cover_image = ?, nickname = ? WHERE username = ?");
        const result = stmt.run(avatarBuffer, coverImageBuffer, nicknameValue, usernameValue);
        
        console.log("Update result:", result);

        if (result.changes === 0) {
            return rep.code(404).send({ error: "User not found" });
        }

        rep.code(200).send({ 
            message: "Success", 
            changes: result.changes,
            avatarUpdated: !!avatarBuffer,
            coverImageUpdated: !!coverImageBuffer
        });

    } catch (error) {
        console.error("Error processing files:", error);
        rep.code(500).send({ 
            error: "Error processing upload",
            details: error.message 
        });
    }
}
export { createUser, getAllUsers, getUserByUsername, updateUser };