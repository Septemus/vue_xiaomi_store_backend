var express = require('express');
var router = express.Router();
const { query: mysqlQ } = require('../../static/js/mymysql')
let sql0 = 'select password from users where uid=?'
const myToken = require('../../static/js/myToken')
router.post('/', async function (req, res, next) {
    console.log('this is reg req:@@', req.body)
    let ans = await mysqlQ(sql0, [req.body.id])
    console.log(ans[0])
    let ret = {
        status: 0,
        token: null
    }
    if (ans[0]) {
        console.log('用户已经存在！@@')
        ret.status = 3
    }
    else {
        console.log('创建新用户中！@@')
        let sql1 = 'insert into users(uid,password) values(?,?)'
        let ans1 = await mysqlQ(sql1, [req.body.id, req.body.password])
        ret.token = myToken.create({ id: req.body.id })
        ret.name = req.body.id
        console.log('创建结果：@@', ans1)
    }
    res.send(ret);
});


module.exports = router
