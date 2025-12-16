import { google } from 'googleapis';
import crypto from 'crypto';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = ["openid", "email", "profile"];

let state = '';

const loginWithGoogle = async (request, reply) => {
    state = crypto.randomBytes(16).toString('hex'); 
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: state
    });
    console.log("Redirecting to Google OAuth URL:", authUrl);
    return reply.redirect(authUrl);

};


const googleCallback = async (request, reply) => {
  const { code } = request.query;

  console.log("Authorization code received:", code);
  // Échanger le code d'autorisation contre des tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // verification de state peut être ajoutée ici pour plus de sécurité
  if (request.query.state !== state) {
    return reply.code(400).send({ error: "Invalid state parameter" });
  }
  // Récupérer les informations de l'utilisateur
  const oauth2 = google.oauth2({
    auth: oauth2Client, 
    version: 'v2'
  });

  const userInfo = await oauth2.userinfo.get();
  console.log("User info retrieved from Google:", userInfo.data);
  //  demander au service user de créer ou récupérer l'utilisateur
  const user = await request.server.axios.post('/users/google-login', {
    googleId: userInfo.data.id,
    email: userInfo.data.email,
    name: userInfo.data.name,
    username: userInfo.data.given_name
  });
  if (user.data.error){
    return reply.redirect('https://localhost:9443/login?oauth=error');
  }
  // Générer un token JWT pour l'utilisateur
  const token = request.server.jwt.sign({ username: user.data.username , id: user.data.id });
  // Envoyer le token au client via un cookie
  reply.setCookie("token" , token , {
      httpOnly : true,
      sameSite : "None",
      path : "/",
      secure : true
  });

  return reply.redirect(`https://localhost:9443/login?oauth=success&username=${encodeURIComponent(user.data.username)}`);
}

export { loginWithGoogle, googleCallback };