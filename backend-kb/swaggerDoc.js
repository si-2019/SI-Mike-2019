const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config();

const options = {
    swaggerDefinition: {
        info: {
            title: 'Dokumentacija tima MIKE za Backend dio kolaboracije.',
            version: '1.0.0', 
            description: 'Citav opis potreban za backend dio za tim MIKE koji se tiče opisa i testiranje metoda za API i SERVISE.',
        },
        host : `${process.env.HOST}:${process.env.PORT}`,
        basePath: '/',
        servers : [ {
            url : process.env.FRONTEND,
            description : "Frontend server koji koristi ovaj rest api."
        }]
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['./index.js', './api/asistants/*.js', './api/students/*.js', './routes/asistants/*.js', './routes/students/*.js'],
};


const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/swagger-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    })
    app.use('/', swaggerUi.serve, swaggerUi.setup(specs));
}
