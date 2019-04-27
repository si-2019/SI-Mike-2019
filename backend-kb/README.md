# READ READ READ READ!
Čitaj redom sve.

## Port klasifikacija & Runtime/Testing & envoirment upute
- 3001 : Rest api node
- `npm install` uraditi unutar backend foldera
- `npm start` u backend folderu za pokreteanje servisa
- `npm run test-students` u backend folderu za rest api testove za studente (uslov: imati pokrenut server)
- `npm run test-asistants` u backend folderu za rest api testove za asistente (uslov: imati pokrenut server)
- pogledati .env fajl i koristiti ga

## Generisanje modela
- unutar foldera models su generisani svi potrebni modeli za nas servis!
- PRIJE GENERISANJA: IMATI GLOBALNO INSTALIRANO: MYSQL, SEQULIZE-AUTO
- AKKO UKOLIKO je potrebno generisati nove modele kucati `npm run generate`
- PRI TOM dodati OBAVEZNO `autoIncrement: true` u primary key atribute KAD SE KREIRA, jer sam sequlize-auto ne doda (radi auto increment opcije)!
