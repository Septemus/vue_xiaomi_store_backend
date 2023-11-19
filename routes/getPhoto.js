var express = require('express');
var router = express.Router();
const { query: mysqlQ } = require('../static/js/mymysql')
const getPhoto = require('../static/js/getPhoto')
router.get('/', async function (req, res, next) {
    let pid = req.query.pid

    // let psql=`select img_path from images where pid =?`
    let ans=await getPhoto(pid)
    res.send(ans)

});
module.exports=router