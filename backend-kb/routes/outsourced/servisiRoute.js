const express = require('express');
const servisiRouter = express.Router();
const db = require('../../models/db');

servisiRouter.post('/getPredmetiKorisnik',(req,res)=>{
    var korisnik=req.body.idKorisnik;
    var json=[];
    db.Predmet_Student.findAndCountAll({
        where:{
            idStudent:korisnik
        }
    }).then(rez=>{
        var predmeti=[];
        for(var i=0;i<rez.count;i++){
            predmeti.push({id:rez.rows[i].idPredmet});
        }
        db.Predmet.findAndCountAll().then(rez2=>{
            for(var j=0;j<rez2.count;j++){
                for(var k=0;k<predmeti.length;k++){
                    if(predmeti[k].id==rez2.rows[j].id){
                        json.push({idPredmet:rez2.rows[j].id,naziv:rez2.rows[j].naziv});
                    }
                }
            }
            var jsonString=JSON.stringify(json);
            res.writeHead(200,{'Content-Type':'application/json'});
            res.write(jsonString);
            res.end();
        })
    })
    .catch(err => res.send(JSON.stringify({ message: 'Doslo je do greske catch blok.' })));
});
servisiRouter.post('/getKorisniciPredmet',(req,res)=>{
    var predmet=req.body.idPredmet;
    var uloga=req.body.uloga;
    var json=[];
    db.Predmet_Student.findAndCountAll({
        where:{
            idPredmet:predmet
        }
    }).then(rez=>{
        var korisnici=[];
        for(var i=0;i<rez.count;i++){
            korisnici.push({id:rez.rows[i].idStudent});
        }
        db.Korisnik.findAndCountAll({
            where:{
                idUloga:uloga
            }
        }).then(rez2=>{
            for(var j=0;j<rez2.count;j++){
                for(var k=0;k<korisnici.length;k++){
                    if(korisnici[i].id==rez2.rows[j].id){
                        json.push({idKorisnik:rez2.rows[j].id,ime:rez2.rows[j].ime,prezime:rez2.rows[j].prezime});
                    }
                }
            }
            var jsonString=JSON.stringify(json);
            res.writeHead(200,{'Content-Type':'application/json'});
            res.write(jsonString);
            res.end();
        })
    })
    .catch(err => res.send(JSON.stringify({ message: 'Doslo je do greske catch blok.' })));
});

module.exports = servisiRouter;