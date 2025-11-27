import {loginWithGoogle, googleCallback} from '../controller/authGoogleController.js';

export default async function authGoogleRoutes(fastify){
    fastify.get('/auth/google', { handler: loginWithGoogle });
    fastify.get('/auth/google/callback', { handler: googleCallback });
}