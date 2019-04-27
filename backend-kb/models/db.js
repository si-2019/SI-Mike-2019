const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_IP,
    dialect: "mysql",
    logging: false,
    port: 3306,
    define: {
        timestamps: false
    }
});
const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importovanje modela
db.ClanGrupe = sequelize.import(__dirname + '/ClanGrupe.js');
db.GrupaProjekta = sequelize.import(__dirname + '/GrupaProjekta.js');
db.Korisnik = sequelize.import(__dirname + '/Korisnik.js');
db.Predmet = sequelize.import(__dirname + '/Predmet.js');
db.Projekat = sequelize.import(__dirname + '/Projekat.js');
db.ProjekniFile = sequelize.import(__dirname + '/ProjektniFile.js');
db.ProjektniZadatak_ClanGrupe = sequelize.import(__dirname + '/projektniZadatak_clanGrupe.js');
db.ProjektniZadatak = sequelize.import(__dirname + '/ProjektniZadatak.js');

module.exports = db;