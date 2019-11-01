const dbPool = require('./db-pool');
//이름을 저장하는 캐시
const nameCache = new Map();

async function selectUsers() {
    return await dbPool.query("select * from users");
}

async function updateBotUserKey(pincode, bot_user_key) {
    let ret = await dbPool.query("update users set bot_user_key = ? where pincode = ?", [bot_user_key, pincode]);
    //업데이트된 행이 있다면 인증된 것임.
    return ret.affectedRows > 0;
}

module.exports = {
    poolShutdown: dbPool.poolShutdown,
};

