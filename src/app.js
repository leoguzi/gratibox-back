import express from 'express';
import cors from 'cors';
import { logIn, registerUser } from './controlers/UsersController.js';
import { registerSignature } from './controlers/SignaturesControler.js';
import validateSession from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', registerUser);
app.post('/login', logIn);
app.post('/signature', validateSession, registerSignature);

export default app;
