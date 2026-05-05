// MODO DEMO: Base de datos en memoria (no requiere MySQL)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Datos temporales en memoria
let usuarios = [];

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Check if user exists
        const existingUser = usuarios.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = {
            id: usuarios.length + 1,
            nombre,
            email,
            password: hashedPassword
        };
        usuarios.push(newUser);

        console.log('Demo: Usuario registrado:', email);
        res.status(201).json({ message: 'Usuario registrado con éxito (Modo Demo)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor demo' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Find user
        const user = usuarios.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Inicio de sesión exitoso (Modo Demo)',
            token,
            user: { id: user.id, nombre: user.nombre, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor demo' });
    }
};

exports.listarUsuarios = async (req, res) => {
    res.json(usuarios.map(u => ({ id: u.id, nombre: u.nombre, email: u.email })));
};
