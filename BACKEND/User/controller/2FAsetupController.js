import speakeasy from "speakeasy";
import qrcode from "qrcode";
import db from "../migration.js";

const setup2FA = async (req, rep) => {
    const token = req.cookies?.token;
    if (!token) {
        return rep.code(401).send({ error: "No token" });
    }

    const decodedToken = req.server.jwt.decode(token);
    const username = decodedToken.username;

    const user = db.prepare("SELECT secret2FA FROM users WHERE username = ?").get(username);

    let secret;
    if (!user?.secret2FA) {
        const newSecret = speakeasy.generateSecret({
            length: 32,  
            name: `MyApp (${username})`
        });
        secret = newSecret.base32;

        console.log("Generated secret:", secret);
        console.log("Secret length:", secret.length);

        db.prepare("UPDATE users SET secret2FA = ? WHERE username = ?").run(secret, username);
    } else {
        secret = user.secret2FA;
    }

    const otpauth_url = `otpauth://totp/MyApp:${username}?secret=${secret}&issuer=MyApp`;

    return rep.send({
        qrCode: otpauth_url,
    });
};

const verify2FA = async (req, rep) => {
    const { token: userToken } = req.body;
    const tokenCookie = req.cookies?.token;

    if (!tokenCookie) {
        return rep.code(401).send({ error: "No user token" });
    }

    const decodedToken = req.server.jwt.decode(tokenCookie);
    const username = decodedToken.username;

    const user = db.prepare("SELECT secret2FA, enabled2FA FROM users WHERE username = ?").get(username);

    if (!user?.secret2FA) {
        return rep.code(400).send({ error: "No 2FA secret found" });
    }

    const verified = speakeasy.totp.verify({
        secret: user.secret2FA,
        encoding: "base32",
        token: userToken,
        window: 2,
    });

    if (verified) {
        db.prepare("UPDATE users SET enabled2FA = 1 WHERE username = ?").run(username);
        return rep.send({ success: true, message: "2FA verified and enabled successfully" });
    } else {
        return rep.code(400).send({ success: false, error: "Invalid 2FA token" });
    }
};

const disable2FA = async (req, rep) => {
    const token = req.cookies?.token;
    if (!token) {
        return rep.code(401).send({ error: "No token" });
    }

    const decodedToken = req.server.jwt.decode(token);
    const username = decodedToken.username;

    db.prepare("UPDATE users SET enabled2FA = 0, secret2FA = NULL WHERE username = ?").run(username);

    return rep.send({ success: true, message: "2FA disabled successfully" });
};

export { setup2FA, verify2FA , disable2FA};
