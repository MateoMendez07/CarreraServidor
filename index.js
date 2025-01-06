const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let corredores = [];

app.post('/iniciar-carrera', (req, res) => {
    const { numeroCorredores, distancia } = req.body;
    corredores = Array.from({ length: numeroCorredores }, (_, i) => {
        return {
            id: i + 1,
            nombre: `Corredor ${i + 1}`,
            velocidad: Math.floor(Math.random() * 20) + 10, // Velocidad entre 10 y 30 km/h
            posicion: 0,
            distancia: distancia
        };
    });

    fs.writeFileSync('carrera.json', JSON.stringify(corredores, null, 2));
    res.json({ mensaje: 'Carrera iniciada', corredores });
});

app.get('/simular-avance', (req, res) => {
    let carrera = JSON.parse(fs.readFileSync('carrera.json'));
    let ganador = null;

    carrera.forEach(corredor => {
        corredor.posicion += corredor.velocidad;
        if (corredor.posicion >= corredor.distancia && !ganador) {
            ganador = corredor;
        }
    });

    fs.writeFileSync('carrera.json', JSON.stringify(carrera, null, 2));

    res.json({ mensaje: 'Simulación de avance completada', carrera, ganador });
});

app.get('/resultados', (req, res) => {
    const carrera = JSON.parse(fs.readFileSync('carrera.json'));
    res.json(carrera);
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});