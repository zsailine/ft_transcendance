import { google } from 'googleapis';
import crypto from 'crypto';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = ["openid", "email", "profile"];


const loginWithGoogle = async (request, reply) => {   
  console.log("Initiating Google OAuth2 login process");  
  const state = crypto.randomBytes(16).toString('hex');
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: state
    });
    
    return reply.redirect(authUrl);

};


const googleCallback = async (request, reply) => {
  const { code } = request.query;

  console.log("Authorization code received:", code);
  
}

export { loginWithGoogle, googleCallback };