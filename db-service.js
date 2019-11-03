const dbPool = require('./db-pool');
//이름을 저장하는 캐시
const nameCache = new Map();

async function selectUsers() {
    return await dbPool.query("select * from users");
}

/***
 * CHECK_STOCK
 */
async function check_stock(branch, item_name) {
    let ret = await dbPool.query("select amount, depot from stock where item_name = ? and branch = ?", [item_name, branch]);
    //업데이트된 행이 있다면 인증된 것임.
    return ret[0];
}

async function updateBotUserKey(pincode, bot_user_key) {
    let ret = await dbPool.query("update users set bot_user_key = ? where pincode = ?", [bot_user_key, pincode]);
    //업데이트된 행이 있다면 인증된 것임.
    return ret.affectedRows > 0;
}

module.exports = {
    check_stock: check_stock,
    poolShutdown: dbPool.poolShutdown,
};

