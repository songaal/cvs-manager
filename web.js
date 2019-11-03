const express = require('express');
const app = express();
const logger = require('morgan');
const dbService = require('./db-service');
const C = require('./contant');
const Josa = require('josa-js');
const utils = require('./utils');
const branchMap = {};

(async function() {
    app.use(express.json());
    app.use(logger('dev', {}));

    app.get('/', function(req, res) {
        const responseBody = {
           'message': '지니 스킬 API 입니다.'
        };
        res.status(200).send(responseBody);
    });

    app.post('/select_branch', function(req, res) {
        let body = req.body;
        let bot_user_key = body.userRequest.user.id;
        let branch = body.userRequest.utterance;
        branchMap[bot_user_key] = branch;

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": `${branch}으로 설정되었습니다.(굿)`
                        }
                    }
                ],
                quickReplies: [
                    {
                        label: '재고확인',
                        action: 'block',
                        blockId: '5dbdab1292690d0001e87a26'
                    },
                    {
                        label: '납품일정',
                        action: 'message',
                        messageText: '납품일정'
                    },
                    {
                        label: '재고부족',
                        action: 'message',
                        messageText: '재고부족'
                    }
                ]
            }
        };
        res.status(200).send(responseBody);

    });
    /**
     * 재고확인
     * */
    app.post('/check_stock', async function(req, res) {
        let body = req.body;
        let bot_user_key = body.userRequest.user.id;
        let branch = branchMap[bot_user_key];
        // let context = utils.getContext(req.body.contexts, 'global');
        let item_name = req.body.action.params.item;
        let item_with_josa = Josa.r(item_name,'은/는');
        let ret = await dbService.check_stock(branch, item_name);
        //TODO branch 나 품목이 없을 경우  undefined...처리..
        if (ret == undefined) {
            const responseBody = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": `에러발생.`
                            }
                        }
                    ]
                }
            };
            res.status(200).send(responseBody);
        }
        let amount = ret.amount;
        let depot = ret.depot;

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": `${item_with_josa} ${amount}개의 재고가 ${depot}창고에 있습니다.`
                        }
                    }
                ]
            }
        };
        res.status(200).send(responseBody);
    });

    /**
     * 납품일정
     * */
    app.post('/supply_schedule', function(req, res) {
        let dodate = '';
        let amount = 0;
        let item_with_josa = '';

        let message = `${dodate}에 ${amount}ea 예정입니다.`
        let message2 = `${item_with_josa} 현재 납품일정이 없습니다.`
        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": message2
                        }
                    }
                ]
            }
        };
        res.status(200).send(responseBody);
    });

    /**
     * 재고부족
     * */
    app.post('/short_stock', function(req, res) {
        let sql = 'select * from stock where amount = 0'
        let message = `${yyyymmdd}에 ${amount}ea 예정입니다.`;

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": message
                        }
                    }
                ]
            }
        };
        res.status(200).send(responseBody);
    });

    /**
     * Server
     * */
    const server = app.listen(C.HTTP_PORT, function() {
        const host = server.address().address;
        const port = server.address().port;
        console.log('Kakao Chatbot API listening at http://%s:%s', host, port);
    });



})();;