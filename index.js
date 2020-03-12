
const express = require('express');
const app = express();
const PORT = 5001;
app.use(express.static('Public'));
app.use(express.json({limit: '1mb'}));
const necessaryFunctions = require("./functions1.js");
const { oneShortenedWordSearch, authorChecking, authorsNotFound, infraSpecNameCheck, genusSpeciesNameSearch, genusSpeciesNotFound, exactNameFind } = necessaryFunctions;




app.use('/secondTry', (request, response, next) => {
    console.log(`${request.method} Request Received`);
    response.results = {};
    oneShortenedWordSearch(request, response, next);
});

app.use('/secondTry', (request, response, next) => {
    authorChecking(request, response, next);
});

app.use('/secondTry', (request, response, next) => {
    authorsNotFound(request, response, next);
});

app.use('/secondTry', (request, response, next) => {
    infraSpecNameCheck(request, response, next);
});

app.use('/secondTry', (request, response, next) => {
    genusSpeciesNameSearch(request, response, next);
});

app.use('/secondTry', (request, response, next) => {
    genusSpeciesNotFound(request, response, next);
});


app.post('/namesFromFile', (request, response) => {
    console.log(`${request.method} Request Received`);
    if(!request.body.bot_names) {
        response.send({
            result: 'request did not contain any botanic names for unknown reason'
        });
    } else {
        exactNameFind(request, response);
    }
});

app.post('/secondTry', (request, response) => {
    response.send(response.results);
});
 
app.listen(PORT, () => console.log(`Server is listening on port 5001`));