const { query: mysqlQ } = require('./mymysql')
module.exports = async function(pid) {
    let psql=`select img_path from images where pid =?`
    let ans=await mysqlQ(psql,[pid])
    return ans
}