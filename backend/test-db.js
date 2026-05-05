const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function testConnection() {
    console.log('--- Iniciando Diagnóstico de Base de Datos ---');
    console.log('Intentando conectar con:');
    console.log(`- Host: ${process.env.DB_HOST}`);
    console.log(`- Usuario: ${process.env.DB_USER}`);
    console.log(`- Base de datos: ${process.env.DB_NAME}`);
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        
        console.log('✅ ¡CONEXIÓN EXITOSA!');
        
        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tablas encontradas:', tables.map(t => Object.values(t)[0]).join(', ') || 'Ninguna');
        
        await connection.end();
    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: No se pudo conectar al servidor. ¿Está encendido MySQL (XAMPP/Wamp)?');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Error: La base de datos "parqueadero_db" no existe. Debes crearla.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Error: Usuario o contraseña incorrectos en el archivo .env');
        } else {
            console.error(error.message);
        }
    }
    console.log('-------------------------------------------');
}

testConnection();
