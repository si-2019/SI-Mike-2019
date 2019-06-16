const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');  // definisanje env varijabli
dotenv.config();                   // postavljanje configa 

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const PORT = process.env.PORT || 3001;
const db = require ('./models/db.js');
const axios = require('axios');

const swaggerDoc = require('./swaggerDoc.js');
const cors = require('cors');

// povezivanje sa bazom
db.sequelize.sync()
    .then(() => console.log("MIKE REST API: Uspjesno povezano sa peca bazom!"))
    .catch((err) => console.log("MIKE REST API: Nije uspjesno povezano sa peca bazom!", err));

// cors
app.use(cors());

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
/* app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Authorization');
    next();
}); */

// AUTORIZACIJA ZA SVE METODE
// UKOLIKO SERVISI NE RADE SAMO ZAKOMENTARISATI !!!  
/*
app.use('/*', (req, res, next) => {
    if(req.originalUrl == '/' || req.originalUrl == '/swagger-ui.css' ||
       req.originalUrl == '/swagger-ui-bundle.js' || req.originalUrl == '/swagger-ui-standalone-preset.js' ||
       req.originalUrl == '/swagger-ui-init.js') { next(); return; }
    let username = null;
    // kupljenje token i username
    let token = req.get('Authorization');
    if(req.query.username) {
        // GET
        // console.log('GET ZAHTJEV');
        username = req.query.username;
    } else if(req.body.username) {
        // POST url-encoded
        // console.log('POST URL ENCODED ZAHTJEV');
        username = req.body.username;
    } else if(req.body['username']){
        // POST json
        // console.log('POST JSON ZAHTJEV');
        username = req.body['username'];
    }
    if(token && username){
        // ukoliko imamo token i username zovemo kolege koje kasne pofino sa autorizacijom i autentifikacijom !!!!
        axios.get(`https://si2019oscar.herokuapp.com/pretragaUsername/${username}/dajUlogu`)
        .then(
            (odgovor)=>{
                if(!odgovor || !odgovor.data) res.status(403).send('Username nije autorizovan!');
                else {
                    const config = {
                        method: 'get',
                        url: `https://si2019romeo.herokuapp.com/users/validate?username=${username}`,
                        headers: { 'Authorization': token }
                    };                        
                    axios(config)
                    .then((odgovorToken) => {
                        if(odgovorToken.status == 403) res.status(403).send('Token i username nisu ispravni!');
                        else {
                            // logika za studente i asistente 
                            if(odgovor.data == 'STUDENT'){
                                let studentiRute = ['group', 'viewS', 'work', 'progress'];
                                let URL = req.originalUrl; 
                                // ako je asistent mora mu zahtjev biti medju ovih gore 4
                                // isto vazi i za studenta!!
                                let bool = false;
                                for(let i = 0; i < studentiRute.length; ++i) if(URL.includes(studentiRute[i])) {
                                    bool = true; break;
                                }
                                if(bool) next();
                                else res.status(403).send('Ovoj ruti moze samo asistent pristupiti!!!');
                            } else if (odgovor.data == 'ASISTENT'){
                                let URL = req.originalUrl;
                                let asistentiRute = ['projects', 'generate', 'bodovanjeprojekata', 'viewA'];
                                let bool = false;
                                for(let i = 0; i < asistentiRute.length; ++i) if(URL.includes(asistentiRute[i])) {
                                    bool = true; break;
                                }
                                if(bool) next();
                                else res.status(403).send('Ovoj ruti moze samo student pristupiti!!!');
                            } else res.status(403).send('Kolaboraciji mogu prisupiti samo asistenti ili studenti!!!');
                        }
                    })
                    .catch(err => res.status(403).send('AUTENTIFIKACIJA SERVIS ne radi ili je forbidden!'))
                } 
            })
            .catch(err => res.status(403).send('AUTORIZACIJA SERVIS ne radi!!'));
    } else res.status(403).send('Nisu poslani token i username!');
}); */

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

app.use('/', swaggerUi.serve, swaggerUi.setup(require('./fullSwagger.json')));
// postavljanje swaggera
swaggerDoc(app);

app.listen(PORT, () => {
    console.log(`Rest-api service started on ${PORT} port!`);
});
