import request from 'supertest';
import express, { json } from 'express';
import { Router } from 'express';
import pkg from 'express-session';
import { expect } from 'chai';
import { UserModel } from '../db/Models.js'; // Mock do modelo de usuário do Mongoose
import { config } from 'dotenv';
import mongoose from 'mongoose';
config({ path: './backend/.env' });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mycluster.mx39qqa.mongodb.net/Conversor?retryWrites=true&w=majority&appName=MyCluster`;

mongoose.connect(uri)
    .then(() => console.log('Conectado ao banco de dados'))
    .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

const app = express();

// Mock dos controladores
const createUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = new UserModel({ name, email, password });
		await user.save();
		res.status(201).json({ message: 'Usuario registrado com sucesso', id: user._id });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao registrar usuario', error: error.message });
	}
};

const logIn = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await UserModel.findOne({ email, password });
		if (user) {
			req.session.userId = user._id;
			next();
		} else {
			res.status(401).json({ message: 'Email ou senha invalidos' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Erro ao autenticar usuario', error: error.message });
	}
};

const createSession = (req, res) => {
	if (req.session.userId) {
		res.status(200).json({ message: 'Login efetuado com sucesso' });
	} else {
		res.status(401).json({ message: 'Falha na autenticacao' });
	}
};

const findUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: 'Usuario nao encontrado' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar usuario', error: error.message });
	}
};

const getAllUsers = async (_req, res) => {
	try {
		const users = await UserModel.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar usuarios', error: error.message });
	}
};

// Configuração do Express
app.use(json());
app.use(
	pkg({
		secret: process.env.SECRET || 'um_segredo_muito_melhor_que_o_anterior',
		saveUninitialized: true,
		resave: false,
		cookie: {},
	})
);

// Rotas
const router = Router();
router.post('/', createUser);
router.post('/login', logIn, createSession);
router.get('/', getAllUsers);
router.get('/:id', findUser);

app.use('/api/users', router);

// Testes
describe('User API Routes', () => {
	before(async () => {
		// Configuração antes de todos os testes
		await UserModel.deleteMany({});
	});

	after(async () => {
		// Limpeza após todos os testes
		await UserModel.deleteMany({});
	});

	let userId = null;

	it('should create a user', async () => {
		const response = await request(app).post('/api/users').send({
			name: 'Gabriel',
			email: 'gabriel@example.com',
			password: '123456',
		});

		expect(response.status).to.equal(201);
		expect(response.body.message).to.equal('Usuario registrado com sucesso');
		userId = response.body.id;
	});

	it('should login the user successfully', async () => {
		const response = await request(app)
			.post('/api/users/login')
			.send({ email: 'gabriel@example.com', password: '123456' });

		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal('Login efetuado com sucesso');
	});

	it('should get all users', async () => {
		const response = await request(app).get('/api/users');
		expect(response.status).to.equal(200);
		expect(response.body).to.have.lengthOf(1);
	});

	it('should get a user by id', async () => {
		const response = await request(app).get(`/api/users/${userId}`);
		expect(response.status).to.equal(200);
		expect(response.body.name).to.equal('Gabriel');
		expect(response.body.email).to.equal('gabriel@example.com');
	});

	it('should return 404 when user not found by id', async () => {
		const response = await request(app).get('/api/users/64b5e82f8f1c00001ecf05f4');
		expect(response.status).to.equal(404);
		expect(response.body.message).to.equal('Usuario nao encontrado');
	});
});
