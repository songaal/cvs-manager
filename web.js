const express = require('express');
const app = express();
const logger = require('morgan');
const dbService = require('./db-service');
const C = require('./contant');
const Josa = require('josa-js');
const utils = require('./utils');

const quickReplies = [
    {
        label: '재고확인',
        action: 'message',
        messageText: '재고확인'
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
    ,
    {
        label: '지점선택',
        action: 'message',
        messageText: '지점선택'
    }
];

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
        // let bot_user_key = body.userRequest.user.id;
        let branch = body.action.params.branch;
        // branchMap[bot_user_key] = branch;

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
                quickReplies: quickReplies
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
        // let branch = branchMap[bot_user_key];
        // let context = utils.getContext(req.body.contexts, 'global');
        let branch = req.body.action.params.branch;
        let item_name = req.body.action.params.item;
        let item_with_josa = Josa.r(item_name,'은/는');
        let ret = await dbService.check_stock(branch, item_name);
        let messageText;
        if (ret) {
            let amount = ret.amount;
            let depot = ret.depot;
            if (amount > 0) {
                messageText = `${branch}에 ${item_with_josa} ${amount}개의 재고가 ${depot}창고에 있습니다.`
            } else {
                messageText = `${branch}에 ${item_with_josa} 재고가 없습니다.`
            }

        } else {
            messageText = `${branch}에는 '${item_name}' 품목이 존재하지 않습니다.`;
        }

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": messageText
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        };
        res.status(200).send(responseBody);
    });

    /**
     * 납품일정
     * */
    app.post('/supply_schedule', async function(req, res) {
        let branch = req.body.action.params.branch;
        let item_name = req.body.action.params.item;
        let item_with_josa = Josa.r(item_name,'은/는');
        let ret = await dbService.supply_schedule(branch, item_name);
        let messageText;
        if (ret) {
            let amount = ret.amount;
            let dodate = ret.dodate;
            if (amount > 0) {
                messageText = `${dodate}에 ${amount}ea 예정입니다.`
            } else {
                messageText = `${branch}에 ${item_with_josa} 현재 납품일정이 없습니다.`
            }
        } else {
            messageText = `${branch}에는 '${item_name}' 품목이 존재하지 않습니다.`;
        }

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": messageText
                        }
                    }
                ],
                quickReplies: quickReplies
            }
        };
        res.status(200).send(responseBody);
    });

    /**
     * 재고부족
     * */
    app.post('/short_stock', async function(req, res) {
        let branch = req.body.action.params.branch;
        let ret = await dbService.short_stock(branch);
        let messageText;
        if (ret && ret.length > 0) {
            messageText = '';
            for(let i = 0;i < ret.length; i++) {
                messageText += ret[i].item_name + ' 재고가 없습니다.\n';
            }
        } else {
            messageText = `${branch}에는 모든 품목에 재고가 있습니다.`;
        }

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": messageText
                        }
                    }
                ],
                quickReplies: quickReplies
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