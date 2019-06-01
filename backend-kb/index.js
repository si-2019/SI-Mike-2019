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
  
// definisanje REST SERVICES calls / ruta
// asistenti servisi rute
const projectsRouter = require('./routes/asistants/projectsRoute');
const bodovanjeRouter  = require('./routes/asistants/bodovanjeRoute');
const viewARouter  = require('./routes/asistants/viewARoute');
const generateRouter  = require('./routes/asistants/generateRoute');
// studenti servisi rute
const groupRouter = require('./routes/students/groupRoute');
const workRouter = require('./routes/students/workRoute');
const viewSRouter = require('./routes/students/viewSRoute');
const progressRouter = require('./routes/students/progressRoute');

//servisi drugih grupa
const servisiRouter=require('./routes/outsourced/servisiRoute');

// definisanje REST API calls / ruta
// asistenti rute za api
const projectsapi = require('./api/asistants/projectsAPI');
const bodovanjeapi  = require('./api/asistants/bodovanjeAPI');
const viewAapi  = require('./api/asistants/viewAAPI');
const generateapi  = require('./api/asistants/generateAPI');
// studenti rute za api
const groupapi = require('./api/students/groupAPI');
const workapi = require('./api/students/workAPI');
const viewSapi = require('./api/students/viewSAPI');
const progressapi = require('./api/students/progressAPI');


// postavljanje CORS-a za naš drugi server
// da samo on može kupiti podatke
app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ----------------------------------------------------- SERVISI ----------------------------------------------
// definisanje ruta za dio "Kreiranje projektne grupe"
app.use('/services/group', groupRouter); 
// definisanje ruta za dio "Pregled projekata"
app.use('/services/viewS', viewSRouter);
// definisanje ruta za dio "Rad na projektu"
app.use('/services/work', workRouter);
// definisanje ruta za dio "Praćenje progresa projekta"
app.use('/services/progress', progressRouter);

// definisanje 4 rutera, za definisanje services calls za ASISTENTA
// definisanje ruta za dio "Kreiranje projekata na nivou predmeta"
app.use('/services/projects', projectsRouter); 
// definisanje ruta za dio "Generisanje projektnih grupa"
app.use('/services/generate', generateRouter); 
// definisanje ruta za dio "Bodovanje projekata"
app.use('/services/bodovanjeprojekata', bodovanjeRouter); 
// definisanje ruta za dio "Pregled projekata"
app.use('/services/viewA', viewARouter);

//servisi drugih grupa
app.use('/services/outsourced',servisiRouter);

// -------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------- API ---------------------------------------------------
// definisanje ruta za dio "Kreiranje projektne grupe"
app.use('/api/group', groupapi); 
// definisanje ruta za dio "Pregled projekata"
app.use('/api/viewS', viewSapi);
// definisanje ruta za dio "Rad na projektu"
app.use('/api/work', workapi);
// definisanje ruta za dio "Praćenje progresa projekta"
app.use('/api/progress', progressapi);


// definisanje 4 rutera, za definisanje services calls za ASISTENTA
// definisanje ruta za dio "Kreiranje projekata na nivou predmeta"
app.use('/api/projects', projectsapi); 
// definisanje ruta za dio "Generisanje projektnih grupa"
app.use('/api/generate', generateapi); 
// definisanje ruta za dio "Bodovanje projekata"
app.use('/api/bodovanjeprojekata', bodovanjeapi); 
// definisanje ruta za dio "Pregled projekata"
app.use('/api/viewA', viewAapi);
// -------------------------------------------------------------------------------------------------------------

// postavljanje swaggera
swaggerDoc(app);

app.listen(PORT, () => {
    console.log(`Rest-api service started on ${PORT} port!`);
});
