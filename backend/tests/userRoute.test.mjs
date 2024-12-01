import request from 'supertest';
import express, { json } from 'express';
import { Router } from 'express';
import pkg from 'express-session';
const app = express();
import { expect } from 'chai'; // Importing expect from Chai

// Mock of the controllers
import {
	createUser,
	logIn,
	createSession,
	findUser,
	getAllUsers,
} from '../controllers/UserCotroller.js';

// Middleware for parsing JSON requests
app.use(json());
app.use(
	pkg({
		secret: process.env.SECRET || 'um_segredo_muito_melhor_que_o_anterior',
		saveUninitialized: true,
		resave: false,
		cookie: {},
	})
);

// Create the routes based on your router
const router = Router();
router.post('/', createUser, (req, res) =>
	res.status(201).json({ message: 'Usuario registrado com sucesso' })
);
router.post('/login', logIn, (req, res) => createSession(req, res));
router.get('/', (req, res) => res.json(getAllUsers()));
router.get('/:id', (req, res) => res.json(findUser(req, res)));

// Use the router in the app
app.use('/api/users', router);

// Tests
describe('User API Routes', () => {
	let userId = null;

	it('should create a user', async () => {
		const response = await request(app).post('/api/users').send({
			name: 'Gabriel',
			email: 'gabriel@example.com',
			password: '123456',
		});

		// Corrected assertions with Chai's expect
		expect(response.status).to.equal(201); // Use .equal() instead of .toBe()
		expect(response.body.message).to.equal(
			'Usuario registrado com sucesso'
		); // Use .equal() here too
		userId = response.body.id;
	});

	it('should login the user successfully', async () => {
		const response = await request(app)
			.post('/api/users/login')
			.send({ email: 'gabriel@example.com', password: '123456' });

		expect(response.status).to.equal(200); // .equal() for Chai
		expect(response.body.message).to.equal('Login efetuado com sucesso');
	});

	it('should get all users', async () => {
		const response = await request(app).get('/api/users');
		expect(response.status).to.equal(200);
		expect(response.body).to.have.lengthOf(1); // Chai method for length check
	});

	it('should get a user by id', async () => {
		const response = await request(app).get(`/api/users/${1}`);
		expect(response.status).to.equal(200);
		expect(response.body.name).to.equal('Gabriel');
		expect(response.body.email).to.equal('gabriel@example.com');
	});

	it('should return 404 when user not found by id', async () => {
		const response = await request(app).get('/api/users/999');
		expect(response.status).to.equal(404);
		expect(response.body.message).to.equal('Usuario nao encontrado');
	});
});
