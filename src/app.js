import express from 'express';
import cors from 'cors';
import { logIn, registerUser } from './controlers/UsersController.js';
import {
  registerSignature,
  getSignature,
} from './controlers/SignaturesControler.js';
import validateSession from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// USERS
app.post('/register', registerUser);
app.post('/login', logIn);

// SIGNATURES
app.post('/signature', validateSession, registerSignature);
app.get('/signature', validateSession, getSignature);

export default app;
