// const mariadb = require('mariadb');
const mariadb = require('mysql2/promise');
const constant = require('./contant');
const pool = mariadb.createPool({
    host: constant.DB_HOST,
    user: constant.DB_USER,
    password: constant.DB_PASSWORD,
    database: constant.DB_SCHEMA,
    connectionLimit: constant.POOL_SIZE,
    charset : 'utf8'
});
console.log('Pool Created!')
console.log('DATABASE: ', constant.DB_HOST, constant.DB_USER)

/**
 * 반환결과
 * SELECT >> [ {val: 1}, meta: ... ]
 * INSERT >> { affectedRows: 1, insertId: 1, warningStatus: 0 }
 */
async function query(sql, values) {
    const [rows, fields] = await pool.query(sql, values);
    return rows;
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const res = await conn.query(sql, values);
//         return res;
//     } catch (err) {
//         throw err;
//     } finally {
//         if (conn) conn.release(); //release to pool
//     }
}

async function poolShutdown() {
    await pool.end()
    console.log('Pool Shutdown!')
}

module.exports = {
    query: query,
    poolShutdown: poolShutdown
};

// (async function() {
//  let res = await query("insert into users(name, pincode) values (?,?)", ['슈렉', 'g1234'])
//  console.log(res)
// })();