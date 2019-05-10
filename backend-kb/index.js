const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');  // definisanje env varijabli
dotenv.config();                   // postavljanje configa 

const app = express();
const PORT = process.env.PORT || 3001;
const db = require ('./models/db.js');

const swaggerDoc = require('./swaggerDoc.js');

// povezivanje sa bazom
db.sequelize.sync()
    .then(() => console.log("MIKE REST API: Uspjesno povezano sa peca bazom!"))
    .catch((err) => console.log("MIKE REST API: Nije uspjesno povezano sa peca bazom!", err));


// default parametars za rad sa slanjem podataka
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
// definisanje REST API calls / ruta
// asistenti rute
const projectsRouter = require('./routes/asistants/projectsRoute');
const bodovanjeRouter  = require('./routes/asistants/bodovanjeRoute');
const viewARouter  = require('./routes/asistants/viewARoute');
const generateRouter  = require('./routes/asistants/generateRoute');
// studenti rute
const groupRouter = require('./routes/students/groupRoute');
const workRouter = require('./routes/students/workRoute');
const viewSRouter = require('./routes/students/viewSRoute');
const progressRouter = require('./routes/students/progressRoute');

// postavljanje swaggera
swaggerDoc(app);

// postavljanje CORS-a za naš drugi server
// da samo on može kupiti podatke
app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// definisanje 4 rutera, za definisanje api calls za STUDENTA
// definisanje ruta za dio "Kreiranje projektne grupe"
app.use('/api/group', groupRouter); 
// definisanje ruta za dio "Pregled projekata"
app.use('/api/viewS', viewSRouter);
// definisanje ruta za dio "Rad na projektu"
app.use('/api/work', workRouter);
// definisanje ruta za dio "Praćenje progresa projekta"
app.use('/api/progress', progressRouter);


// definisanje 4 rutera, za definisanje api calls za ASISTENTA
// definisanje ruta za dio "Kreiranje projekata na nivou predmeta"
app.use('/api/projects', projectsRouter); 
// definisanje ruta za dio "Generisanje projektnih grupa"
app.use('/api/generate', generateRouter); 
// definisanje ruta za dio "Bodovanje projekata"
app.use('/api/bodovanjeprojekata', bodovanjeRouter); 
// definisanje ruta za dio "Pregled projekata"
app.use('/api/viewA', viewARouter);

app.listen(PORT, () => {
    console.log(`Rest-api service started on ${PORT} port!`);
});
