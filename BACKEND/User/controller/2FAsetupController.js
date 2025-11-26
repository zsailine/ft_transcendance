import speakeasy from "speakeasy";
import qrcode from "qrcode";
import axios from "axios";

const setup2FA = async (req, rep) => {
    console.log("+++++++++++++++++++++++++++++")
    console.log("2FA setup endpoint called");
    console.log(req.server.axios)
    console.log("+++++++++++++++++++++++++++++")
    const data = await req.server.axios.get('/users/all')
    console.log("--------------")

    // const secret = speakeasy.generateSecret(
    //     { name: `MyApp (${username})` }
    // );

    // qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    //     if (err) {
    //         return rep.code(500).send({ error: "Failed to generate QR code" });
    //     }

    //     return rep.send({
    //         secret: secret.base32,
    //         qrCode: data_url
    //     });
    // });
    return rep.send({ message: "2FA setup endpoint called" });
}

export { setup2FA };