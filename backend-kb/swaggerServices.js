const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');  // definisanje env varijabli
dotenv.config();                   

const options = {
    swaggerDefinition: {
        info: {
            title: 'Dokumentacija za backend SERVICES za MIKE Kolaboraciju',
            version: '1.0.0', 
            description: 'Citav services opis potreban za backend dio za tim mike.',
        },
        host : `${process.env.HOST}:${process.env.PORT}`,
        basePath: '/',
        servers : [ {
            url : process.env.FRONTEND,
            description : "Frontend server koji koristi ovaj rest api."
        }]
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['./index.js', './routes/asistants/*.js', './routes/students/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/swagger-json-services', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    })
    app.use('/swgservices', swaggerUi.serve, swaggerUi.setup(specs));
}