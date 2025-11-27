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

    const user = db.prepare("SELECT secret2fa FROM users WHERE username = ?").get(username);

    let secret;
    if (!user?.secret2fa) {
        const newSecret = speakeasy.generateSecret({ name: `MyApp (${username})` });
        secret = newSecret.base32;

        db.prepare("UPDATE users SET secret2fa = ? WHERE username = ?").run(secret, username);
    } else {
        secret = user.secret2fa;
    }

    const otpauth_url = speakeasy.otpauthURL({
        secret,
        label: `MyApp (${username})`,
        encoding: "base32",
    });

    const data_url = await qrcode.toDataURL(otpauth_url);

    return rep.send({
        qrCode: data_url,
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

    const user = db.prepare("SELECT secret2fa, enabled2FA FROM users WHERE username = ?").get(username);

    if (!user?.secret2fa) {
        return rep.code(400).send({ error: "No 2FA secret found" });
    }

    const verified = speakeasy.totp.verify({
        secret: user.secret2fa,
        encoding: "base32",
        token: userToken,
        window: 1,
    });

    if (verified) {
        db.prepare("UPDATE users SET enabled2FA = 1 WHERE username = ?").run(username);
        return rep.send({ success: true, message: "2FA verified and enabled successfully" });
    } else {
        return rep.code(400).send({ success: false, error: "Invalid 2FA token" });
    }
};

export { setup2FA, verify2FA };
