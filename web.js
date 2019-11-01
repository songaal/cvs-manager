const express = require('express');
const app = express();
const logger = require('morgan');
const dbService = require('./db-service');
const C = require('./contant');

(async function() {
    app.use(express.json());
    app.use(logger('dev', {}));

    app.get('/', function(req, res) {
        const responseBody = {
           'message': '지니 스킬 API 입니다.'
        };
        res.status(200).send(responseBody);
    });


    /**
     * Server
     * */
    const server = app.listen(8002, function() {
        const host = server.address().address;
        const port = server.address().port;
        console.log('Kakao Chatbot API listening at http://%s:%s', host, port);
    });



})();;