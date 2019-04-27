# Port klasifikacija & Runtime/Testing & envoirment upute
- 3001 : Rest api node
- `npm install` uraditi unutar backend foldera
- `npm start` u backend folderu za pokreteanje servisa
- `npm run test-students` u backend folderu za rest api testove za studente (uslov: imati pokrenut server)
- `npm run test-asistants` u backend folderu za rest api testove za asistente (uslov: imati pokrenut server)
- pogledati .env fajl i koristiti ga

# Generisanje modela
- unutar foldera models su generisani svi potrebni modeli za nas servis!
- PRIJE GENERISANJA: IMATI GLOBALNO INSTALIRANO: MYSQL, SEQULIZE-AUTO
- ukoliko je potrebno generisati nove modele kucari `npm run generate`
- DODATI OBAVEZNO `autoIncrement: true` u MODELE KAD SE KREIRA
