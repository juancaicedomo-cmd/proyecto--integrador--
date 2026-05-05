// MODO DEMO: Base de datos en memoria (no requiere MySQL)

let vehiculos = [];

exports.registrarIngreso = async (req, res) => {
    try {
        const { placa, tipo, usuario_id } = req.body;

        if (!placa || !tipo) {
            return res.status(400).json({ message: 'Placa y tipo son obligatorios' });
        }

        // Check if vehicle is already in the parking
        const active = vehiculos.find(v => v.placa === placa && v.estado === 'activo');
        if (active) {
            return res.status(400).json({ message: 'El vehículo ya se encuentra en el parqueadero' });
        }

        const nuevoVehiculo = {
            id: vehiculos.length + 1,
            placa,
            tipo,
            hora_ingreso: new Date(),
            hora_salida: null,
            estado: 'activo',
            usuario_id: usuario_id || null
        };
        
        vehiculos.push(nuevoVehiculo);

        res.status(201).json({ message: 'Ingreso registrado con éxito (Modo Demo)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor demo' });
    }
};

exports.listarVehiculos = async (req, res) => {
    try {
        // Return sorted by date (newest first)
        const sorted = [...vehiculos].sort((a, b) => b.hora_ingreso - a.hora_ingreso);
        res.json(sorted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor demo' });
    }
};

exports.registrarSalida = async (req, res) => {
    try {
        const { id } = req.params;

        const index = vehiculos.findIndex(v => v.id == id);
        if (index === -1) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        if (vehiculos[index].estado === 'finalizado') {
            return res.status(400).json({ message: 'El vehículo ya registró salida' });
        }

        vehiculos[index].estado = 'finalizado';
        vehiculos[index].hora_salida = new Date();

        res.json({ message: 'Salida registrada con éxito (Modo Demo)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor demo' });
    }
};
