require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { dbConnection } = require('../database/config');

dbConnection();



if (process.env.NODE_ENV === 'development') {
    const users = [
        { name: 'Juan Pérez', email: 'juan.perez@example.com', password: 'password123', isActive: true },
        { name: 'María Gómez', email: 'maria.gomez@example.com', password: 'password456', isActive: true },
        { name: 'Carlos López', email: 'carlos.lopez@example.com', password: 'password789', isActive: true },
        { name: 'Ana Torres', email: 'ana.torres@example.com', password: 'password101', isActive: true },
        { name: 'Luis Fernández', email: 'luis.fernandez@example.com', password: 'password102', isActive: true },
        { name: 'Sofía Martínez', email: 'sofia.martinez@example.com', password: 'password103', isActive: true },
        { name: 'David Pérez', email: 'david.perez@example.com', password: 'password104', isActive: true },
        { name: 'Isabel Sánchez', email: 'isabel.sanchez@example.com', password: 'password105', isActive: true },
        { name: 'Pedro Gómez', email: 'pedro.gomez@example.com', password: 'password106', isActive: true },
        { name: 'Marta Rodríguez', email: 'marta.rodriguez@example.com', password: 'password107', isActive: true }
    ];

    const seedUsers = async () => {
        try {

            const userCount = await User.countDocuments();
            if (userCount > 0) {
                console.log('Usuarios ya existen en la base de datos.');
                return;
            }

            for (let user of users) {
                user.password = await bcrypt.hash(user.password, 10);
            }

            await User.insertMany(users);

            console.log('Usuarios de prueba insertados correctamente.');
            process.exit(0); 
        } catch (error) {
            console.error('Error al insertar usuarios de prueba:', error);
            process.exit(1); 
        }
    };

    seedUsers();

} else {
    console.log('La seed solo se ejecuta en el entorno de desarrollo.');
}