# READ READ READ READ!
Čitaj redom sve.

## Port klasifikacija & Runtime/Testing & envoirment upute
- 31913 : Rest api node
- `npm install` uraditi unutar backend foldera
- `npm start` u backend folderu za pokreteanje servisa
- `npm run test-students` u backend folderu za rest api testove za studente (uslov: imati pokrenut server)
- `npm run test-asistants` u backend folderu za rest api testove za asistente (uslov: imati pokrenut server)
- pogledati .env fajl i koristiti ga

## Generisanje modela
- unutar foldera models su generisani svi potrebni modeli za nas servis!
- PRIJE GENERISANJA: IMATI GLOBALNO INSTALIRANO: MYSQL, SEQULIZE-AUTO
- ukoliko je potrebno generisati nove modele kucari `npm run generate`
- DODATI OBAVEZNO `autoIncrement: true` u primary key atribute KAD SE KREIRA, jer sam sequlize-auto ne doda (radi auto increment opcije)!
- dodati i id remover za `projektniZadatak_clanGrupe` model!

## Korištenje swaggera
- Prije/tokom/na kraju pisanja api call metode, OBAVEZNO definisati i swagger objekat prije njenog poziva
- Primjer kako se to radi može se naći `./api/students/workAPI.js`
- Unutar toga treba se definisati ŠTA ta metoda radi, KOJI su OBAVEZNI ulazni parametri, KOJI su OBAVEZNI izlazni parametri i KO JE uradio tu metodu unutar deskripcije! 
- http://localhost:31913/ - za dobijanje swagger-ui
- http://localhost:31913/swagger-json - za dobijanje json fajla swaggera

## Korištenje gita timovi
- https://bit.ly/2HUuaAH
