const { Router } = require("express");

/**
 * Tipo usuario
 * 
 * @typedef {Object} User
 * @property {string} name - Nome do usuario
 * @property {string} email - E-mail do usuario
 * @property {string} password - Senha do usuario
 * @property {string} id - Identificador unico do usuario
 */

const router = Router();

const users = [];
router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    const user = { id: users.length + 1, name, email, password };
    users.push(user);
    res.status(201).json({ message: "Usuario registrado com sucesso" });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: "Login efetuado com sucesso" });
    } else {
        res.status(401).json({ message: "Email ou senha invalidos" });
    }
});

router.get("/", (req, res) => {
    res.json(users);
});

router.get("/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Usuario nao encontrado" });
    }
});

module.exports = router;