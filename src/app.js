import express from 'express';
import { conexion } from './db.js';
import { PORT } from './config.js';

const app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/', (req, res) => {
    res.json({ message: 'API' });
});

app.get('/tarea', async (req, res) => {
    try {
        const [rows, fields] = await conexion.execute('SELECT * FROM tareas;');
        const obj = {};
        if (rows.length > 0) {
            obj.listaTareas = rows;
            res.json(obj);
        } else {
            res.json({ message: 'No hay registros' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/tarea/add', async (req, res) => {
    const { titulo, descripcion } = req.body;

    try {
        const [result] = await conexion.execute('INSERT INTO tareas (titulo, descripcion) VALUES (?, ?);', [titulo, descripcion]);
        res.json(`Se insertó correctamente la tarea con ID: ${result.insertId}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.put('/tarea/update/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    try {
        const [result] = await conexion.execute('UPDATE tareas SET titulo=?, descripcion=? WHERE id=?;', [titulo, descripcion, id]);
        res.json(`Se actualizó correctamente la tarea`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.delete('/tarea/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await conexion.execute('DELETE FROM tareas WHERE id=?;', [id]);
        res.json(`Se eliminó correctamente la tarea`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
