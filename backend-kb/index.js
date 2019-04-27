const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // definisanje env varijabli
dotenv.config(); // postavljanje configa 

const app = express();
const PORT = process.env.PORT || 3001;
const db = require('./models/db.js');

// povezivanje sa bazom
db.sequelize.sync()
    .then(() => console.log("Uspjesno povezano sa peca bazom!"))
    .catch((err) => console.log("Nije uspjesno povezano sa peca bazom!", err));

// default parametars za rad sa slanjem podataka
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// definisanje REST API calls / ruta

const workRouter = require('./routes/students/workRoute')
const projectsRouter = require('./routes/asistants/projectsRoute');

// postavljanje CORS-a za naš drugi server
// da samo on može kupiti podatke
app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// definisanje 4 rutera, za definisanje api calls za studenta

// definisanje ruta za dio "Kreiranje projektne grupe"
// app.use('/group', projectRouter); 
// definisanje ruta za dio "Pregled projekata"
// app.use('/view', projectRouter);
// definisanje ruta za dio "Rad na projektu"
app.use('/api/work', workRouter);
// definisanje ruta za dio "Praćenje progresa projekta"
// app.use('/progress', projectRouter);

// definisanje 4 rutera, za definisanje api calls za asistenta

// definisanje ruta za dio "Kreiranje projekata na nivou predmeta"
app.use('/api/projects', projectsRouter);
// definisanje ruta za dio "Generisanje projektnih grupa"
// app.use('/group', projectRouter); 
// definisanje ruta za dio "Bodovanje projekata"
// app.use('/group', projectRouter); 
// definisanje ruta za dio "Pregled projekata"
// app.use('/group', projectRouter);

app.listen(PORT, () => {
    console.log(`Rest-api service started on ${PORT} port!`);
});