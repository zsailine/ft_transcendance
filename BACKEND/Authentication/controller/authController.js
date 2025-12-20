import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

const loggedUser = async (req, rep) => {
    const { username, password, totpCode } = req.body;

    if (!username || !password)
        return rep.code(400).send({ error: "username and password are required" });

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

    let user;
    try 
    {
        if (isEmail) {
            user = await req.server.axios.get(`/users/email/${username}`);
        } else {
            user = await req.server.axios.get(`/users/${username}`);
        }
    }
    catch (e) {
        return rep.code(404).send({ error: "user not found" });
    }

    if (!user.data)
        return rep.code(404).send({ error: "user not found" });

    if (!user.data)
        return rep.code(404).send({ error: "user not found" });

    const validMdp = await bcrypt.compare(password, user.data.password);

    if (!validMdp)
        return rep.code(401).send({ error: "invalid password" });

    if (user.data.enabled2FA === 1) {
        if (!totpCode) {
            return rep.code(403).send({
                requires2FA: true,
                message: "2FA code required"
            });
        }

        const verified = speakeasy.totp.verify({
            secret: user.data.secret2FA,
            encoding: "base32",
            token: totpCode,
            window: 2,
        });

        if (!verified) {
            return rep.code(401).send({
                error: "Invalid 2FA code",
                requires2FA: true
            });
        }
    }
    const token = req.server.jwt.sign({ username: user.data.username, id: user.data.id });

    rep.setCookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    return rep.send({
        username: username
    });
}

const logout = async (req, rep) => {
    rep.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });
    return rep.send({ message: "logged out successfully" });
}

const verify = async (req, rep) => {
    const token = req.cookies?.token;
    if (!token) {
        rep.code(401).send({ error: "No token" })
    }
    try {
        const decodedToken = req.server.jwt.decode(token);
        const username = decodedToken.username
        const user = await req.server.axios.get(`users/${username}`)
        if (!user.data)
            rep.code(404).send({ error: "User not found" })
        rep.code(200).send({ user: user.data.username, enabled2FA: user.data.enabled2FA });
    }
    catch (e) {
        console.log(e)
    }
}

export { loggedUser, verify, logout };