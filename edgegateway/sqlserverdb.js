(function (sqlserverdb) {

    const sql = require('mssql');
    var logger = require("./logger");
    const config = {
        user: process.env.sqlUser,
        password: process.env.sqlPassword,
        server: process.env.sqlServer,
        database: process.env.sqldb
    }
    var sqlQuery = "Set Transaction Isolation Level Read Uncommitted; ";
    sqlQuery += "<Select query here...>";

    sqlserverdb.getUpdatedSensorData = async function () {
        try {
            let pool = await new sql.connect(config);
            let dbResult = await pool.request().query(sqlQuery);
            if (dbResult.recordset && dbResult.recordset.length > 0) {
                return dbResult.recordset[0];
            }
            return null;
        } catch (err) {
            return { err: err };
        } finally {
            sql.close();
        }
    };
})(module.exports);