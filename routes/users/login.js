var express = require('express');
var router = express.Router();
const { query: mysqlQ } = require('../../static/js/mymysql')
let sql0 = 'select password from users where uid=?'
const myToken = require('../../static/js/myToken')
router.post('/', async function (req, res, next) {
    console.log('this is login req:@@', req.body)
    let ret = {
        status: 0,
        token: null
    }
    let ans = await mysqlQ(sql0, [req.body.id])
    console.log(ans[0])
    if (!ans[0]) {
        console.log('用户不存在！')
        ret.status = 1
    }
    else if (ans[0].password !== req.body.password) {
        console.log('密码错误')
        ret.status = 2
    }
    else {
        console.log('密码正确')
        ret.token = myToken.create({
            id: req.body.id
        })
        let sql1 = 'select uname from users where uid = ?'
        let ans1 = await mysqlQ(sql1, [req.body.id])
        console.log(ans1[0].uname)
        ret.name = ans1[0].uname ? ans1[0].uname : req.body.id
    }
    res.send(ret);
});

module.exports = router
