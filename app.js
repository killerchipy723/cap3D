const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const puppeteer = require('puppeteer');
const fs = require('fs');
const pdf = require('pdfkit');
const PDFDocument = require('pdfkit');
const pdfmake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
pdfmake.vfs = vfsFonts.pdfMake.vfs; // Cargar fuentes

const port = 3000;

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Función para manejar la reconexión automática
let db;
function handleDisconnect() {
    db = mysql.createConnection({
        host: 'bmwwo4er4uuobzkpu4je-mysql.services.clever-cloud.com',
        user: 'ufsmclsjqpty0qxl',
        password: '921iPxSWMcmXCQdBww2c',  // Ajusta según tu configuración
        database: 'bmwwo4er4uuobzkpu4je'
    });

    db.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Reintentar conexión después de 2 segundos
        } else {
            console.log('Conectado a la base de datos.');
        }
    });

    // Manejar errores de conexión
    db.on('error', (err) => {
        console.error('Error en la conexión a la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Volver a conectar si se pierde la conexión
        } else {
            throw err;
        }
    });
}

// Iniciar el proceso de conexión
handleDisconnect();

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para servir la página de registro
app.get('/register-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Ruta para servir la página de asistencia
app.get('/attendance-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/asistencia.html'));
});



// Ruta para buscar alumno por DNI
app.post('/buscar-alumno', (req, res) => {
    const { dni } = req.body;
    const query = 'SELECT * FROM alumno WHERE dni = ?';

    db.query(query, [dni], (err, result) => {
        if (err) {
            res.send({ error: 'Error en la búsqueda' });
        } else if (result.length > 0) {
            res.send({ success: true, alumno: result[0] });
        } else {
            res.send({ success: false, message: 'Alumno no encontrado' });
        }
    });
});

app.post('/register', (req, res) => {
    const { apenomb, dni, carrera, anio } = req.body;

    // Verificar si el alumno ya está registrado por DNI
    const checkQuery = `SELECT * FROM alumno WHERE dni = ?`;
    db.query(checkQuery, [dni], (err, result) => {
        if (err) {
            console.log('Error al verificar alumno:', err);
            return res.json({ success: false, message: 'Error en la validación.' });
        }

        if (result.length > 0) {
            // Si ya existe un registro con ese DNI, devolver mensaje de alerta
            return res.json({ success: false, message: 'El alumno ya está registrado.' });
        }

        // Si el alumno no existe, proceder con el registro
        const query = `INSERT INTO alumno (apenomb, dni, carrera, año, fecha) VALUES (?, ?, ?, ?, ?)`;
        const fecha = new Date();

        db.query(query, [apenomb, dni, carrera, anio, fecha], (err, result) => {
            if (err) {
                console.log('Error al registrar alumno:', err);
                res.json({ success: false, message: 'Error al registrar alumno.' });
            } else {
                res.json({ success: true, message: 'Alumno registrado con éxito.' });
            }
        });
    });
});


app.post('/registrar-asistencia', (req, res) => {
    const { idalumno } = req.body;
    const fecha = new Date();
    const fechaFormatted = fecha.toISOString().split('T')[0]; // Obtener solo la parte de la fecha (YYYY-MM-DD)

    // Verificar si ya hay un registro de asistencia para el alumno en la fecha actual
    const checkQuery = `SELECT * FROM asistencia WHERE idalumno = ? AND DATE(fecha) = ?`;
    db.query(checkQuery, [idalumno, fechaFormatted], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Error al verificar asistencia.' });
        }

        if (result.length > 0) {
            // Si ya existe un registro de asistencia para hoy
            return res.json({ success: false, message: 'El alumno ya registró asistencia hoy.' });
        }

        // Registrar asistencia si no hay registro previo hoy
        const insertQuery = `INSERT INTO asistencia (idalumno, fecha, estado) VALUES (?, ?, ?)`;
        db.query(insertQuery, [idalumno, fecha, 'Presente'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Error al registrar asistencia.' });
            } else {
                return res.json({ success: true, message: 'Asistencia registrada con éxito.' });
            }
        });
    });
});
// Ruta para consultar asistencia
app.post('/consultar-asistencia', (req, res) => {
    const { dni } = req.body;
    const query = `
        SELECT a.idasistencia, al.apenomb, a.fecha, a.estado 
        FROM asistencia a
        JOIN alumno al ON a.idalumno = al.idalumno
        WHERE al.dni = ?
    `;

    db.query(query, [dni], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Error al consultar asistencia.' });
        }
        
        if (result.length > 0) {
            return res.json({ success: true, asistencias: result });
        } else {
            return res.json({ success: false, message: 'No se encontró asistencia para este alumno.' });
        }
    });
});
// Ruta para obtener las asistencias por fecha
app.get('/asistencia', (req, res) => {
    const { fecha } = req.query;
    if (!fecha) {
        return res.status(400).json({ error: 'Debe proporcionar una fecha' });
    }
    const sql = `SELECT a.idasistencia, al.apenomb, al.dni,al.carrera,a.fecha, a.estado 
                 FROM asistencia a 
                 JOIN alumno al ON a.idalumno = al.idalumno 
                 WHERE a.fecha = ?`;

    db.query(sql, [fecha], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }

        // Formatear las fechas
        results.forEach(row => {
            const date = new Date(row.fecha);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0-11
            const year = date.getFullYear();
            row.fecha = `${day}/${month}/${year}`;
        });

        res.json(results); // Devolver los resultados en formato JSON
    });
});


// Ruta para generar el PDF con los datos de asistencia
app.get('/asistencia/pdf', (req, res) => {
    const { fecha } = req.query;

    // Consulta actualizada para obtener los datos de asistencia
    const query = `
        SELECT a.idasistencia, al.apenomb, al.dni, al.carrera, a.fecha, a.estado 
        FROM asistencia a 
        JOIN alumno al ON a.idalumno = al.idalumno 
        WHERE a.fecha = ?
    `;

    db.query(query, [fecha], (error, results) => {
        if (error) {
            console.error('Error al generar el PDF:', error);
            return res.status(500).send('Error al generar el PDF');
        }

        // Definición de la estructura del PDF
        const docDefinition = {
            content: [
                {
                    text: 'Registro de Asistencias\nCapacitación de Impresión 3D\nI.E.S 6.021 Juan Carlos Dávalos',
                    style: 'header',
                    alignment: 'center'
                },
                { text: `Fecha: ${fecha}`, style: 'subheader', alignment: 'center' },
                { text: '\n' }, // Espacio
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'ID', style: 'tableHeader' },
                                { text: 'Alumno', style: 'tableHeader' },
                                { text: 'Documento', style: 'tableHeader' },
                                { text: 'Carrera', style: 'tableHeader' },
                                { text: 'Fecha', style: 'tableHeader' },
                                { text: 'Estado', style: 'tableHeader' }
                            ],
                            ...results.map(asistencia => [
                                asistencia.idasistencia,
                                asistencia.apenomb,
                                asistencia.dni,
                                asistencia.carrera,
                                asistencia.fecha, // Asegúrate de que este campo sea parte de la consulta y que se muestre aquí
                                asistencia.estado
                            ])
                        ]
                    },

                    layout: {
                        hLineWidth: (i) => (i === 0 ? 2 : 0.5),
                        vLineWidth: (i) => (i === 0 ? 2 : 0.5),
                        hLineColor: () => '#007BFF',
                        vLineColor: () => '#007BFF',
                        fillColor: (rowIndex) => (rowIndex === 0 ? '#007BFF' : null), // Color de fondo para el encabezado
                    },
                }
            ],
            styles: {
                header: {
                    fontSize: 15,
                    bold: true,
                    margin: [0, 20, 0, 10],
                    color: '#007BFF' // Color del título
                },
                subheader: {
                    fontSize: 12,
                    margin: [0, 0, 0, 20]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    color: 'white',
                    alignment: 'center'
                }
            }
        };

        // Generar el PDF
        const pdfDoc = pdfmake.createPdf(docDefinition);
        const filePath = path.join(__dirname, 'reporte.pdf');

        pdfDoc.getBuffer((buffer) => {
            fs.writeFileSync(filePath, buffer); // Guardar PDF en el sistema de archivos

            res.download(filePath, 'reporte.pdf', (err) => {
                if (err) {
                    console.error('Error al enviar el PDF:', err);
                    res.status(500).send('Error al enviar el PDF');
                }
            });
        });
    });
});

// Iniciar el servidor
app.listen(port, '0.0.0.0',() => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

