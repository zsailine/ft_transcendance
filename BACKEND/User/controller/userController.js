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
        const { username, avatar, cover_image, nickname } = req.body;

        const usernameValue = username?.value || username;
        const nicknameValue = nickname?.value || nickname;

        let avatarBuffer = null;
        let coverImageBuffer = null;

        if (avatar && avatar.type === 'file') {
            try {
                avatarBuffer = await avatar.toBuffer();
            } catch (error) {
            }
        }

        if (cover_image && cover_image.type === 'file') {
            try {
                coverImageBuffer = await cover_image.toBuffer();
            } catch (error) {
            }
        }

        const stmt = db.prepare("UPDATE users SET avatar = ?, cover_image = ?, nickname = ? WHERE username = ?");
        const result = stmt.run(avatarBuffer, coverImageBuffer, nicknameValue, usernameValue);

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


const updateColor = async (req, rep) => {
    try {
        const { paddle1, paddle2, ball, boardBackground, boardBorder, score, paddleSpeed, slide} = req.body;
        const slideValueForDB = slide ? 1 : 0;
        const stmt = db.prepare(`
            UPDATE users SET 
                paddle1_color = ?, 
                paddle2_color = ?, 
                ball_color = ?, 
                board_background = ?, 
                board_border = ?, 
                score_color = ?,
                paddle_speed = ?,
                slide = ?

            WHERE username = ?
        `);
        const { username } = req.params;
        const result = stmt.run(
            paddle1,
            paddle2,
            ball,
            boardBackground,
            boardBorder,
            score,
            paddleSpeed,
            slideValueForDB,
            username,
        );
        if (result.changes === 0) {
            return rep.code(404).send({ error: "User not found" });
        }

        rep.send({ success: true, message: "Theme colors updated successfully" });

    } catch (error) {
        console.error("Error updating colors:", error);
        rep.code(500).send({
            error: "Error updating colors",
            details: error.message
        });
    }
}

const getAvatar = async (req, rep) => {
    const { username } = req.params;
    const avatar = db.prepare("SELECT avatar FROM users WHERE username = ?").get(username);
    return rep.status(200).send(avatar);
}

const getId = async (req, rep) => {
    const { username } = req.params;
    const id = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    return rep.status(200).send(id);
}

const verifyandCreateGoogleUser = async (req, rep) => {
    const { username, googleId, email } = req.body;
    const password = "GOOGLE_ACCOUNT";
    if (!googleId || !email || !username)
        return rep.code(400).send({ error: "googleId , email and username required" });
    const user = db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId);
    if (user) {
        return rep.code(200).send(user);
    }
    try {
        const stmt = db.prepare("INSERT INTO users (username, email, google_id, password) VALUES (?, ?, ?, ?)");
        const result = stmt.run(username, email, googleId, password);
        
        return rep.code(201).send({id: result.lastInsertRowid, username, email, googleId});
    }
    catch (e) {
        console.log("SQL ERROR:", e);
        rep.code(400).send({ error: "username and email must be unique" });
    }

}

export { createUser, getAllUsers, getUserByUsername, updateColor, updateUser, getAvatar, getId, verifyandCreateGoogleUser };