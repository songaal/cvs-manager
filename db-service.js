const dbPool = require('./db-pool');
//이름을 저장하는 캐시
const nameCache = new Map();

async function selectUsers() {
    return await dbPool.query("select * from users");
}

/***
 * 재고확인
 */
async function check_stock(branch, item_name) {
    let ret = await dbPool.query("select amount, depot from stock where item_name = ? and branch = ?", [item_name, branch]);
    return ret[0];
}

/***
 * 납품일정
 */
async function supply_schedule(branch, item_name) {
    let ret = await dbPool.query("select amount, dodate from supply where item_name = ? and branch = ?", [item_name, branch]);
    return ret[0];
}


/***
 * 재고부족
 */
async function short_stock(branch) {
    let ret = await dbPool.query('select item_name from stock where amount < 1 and branch = ?', [branch]);
    return ret;
}

module.exports = {
    check_stock: check_stock,
    supply_schedule: supply_schedule,
    short_stock: short_stock,
    poolShutdown: dbPool.poolShutdown,
};

