import bcrypt from "bcrypt";

const loggedUser = async (req , rep) => {
    const { username , password } = req.body;
    if (!username || !password)
        return rep.code(400).send({ error: "username and password are required" });
    const user = await req.server.axios.get(`/users/${username}`)
    if (!user.data)
        return rep.code(404).send({ error: "user not found" });
    const validMdp = await bcrypt.compare(password , user.data.password);
    if (!validMdp)
        return rep.code(401).send({ error: "invalid password" });

    const token = req.server.jwt.sign({ username: user.data.username , id: user.data.id });
    rep.header("Authorization" , `Bearer ${token}`);

    return rep.send({
        token : token,
        user  : user.data 
    });
}

const verify = async (req , rep) => {
    const token = req.headers.authorization?.replace("Bearer " , "")
    if (!token)
        rep.code(401).send({error: "No token"})
    try{
        const decodedToken = req.server.jwt.decode(token)
        const username = decodedToken.username
        const user = await req.server.axios.get(`users/${username}`)
        if (!user.data)
            rep.code(404).send({error : "User not found"})
        rep.code(200).send({user : user.data})
    }
    catch(e){
        console.log(e)
    }
}

export { loggedUser , verify};