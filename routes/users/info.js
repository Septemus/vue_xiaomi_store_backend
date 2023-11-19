var express = require('express');
var fs = require('fs');
var router = express.Router();
const { query: mysqlQ } = require('../../static/js/mymysql')
const path = require('path');
// const projectRoot = path.resolve(__dirname, '..');
async function getInfo (id) {
    let info_sql = `select uid,uname,default_addr,default_phone,gender,avatar_path,realname from users where uid = ?`
    let ans = await mysqlQ(info_sql, [id])
    console.log(ans[0])
    return ans[0]
    // res.send(ans[0])
}

router.get('/',async function  (req, res, next) {
    console.log('this is info query req:@@', req.query)
    let ret=await getInfo(req.query.id)
    console.log('this is the ret of info query:@@',ret)
    res.send(ret)
})

router.post('/', async function (req, res, next) {
    console.log('this is info update req:@@', req.body)
    let info_sql = `update users set uname=?,default_addr=?,default_phone=?,gender=?,avatar_path=?,realname=?  where uid = ?`
    let imgData=req.body.avatar_path
    let imgPath=imgData
    if(imgData&&imgData.length>200) {
      imgData=imgData.replace(/^data:image\/\w+;base64,/,"")
      let buffer= Buffer.from(imgData,'base64')
      imgPath = `/images/users/${req.body.id+Date.now()}.jpeg`
      console.log('this is the dirname:@@',__dirname)
      fs.writeFileSync(path.resolve( __dirname , '../../static'+imgPath ),buffer)
    }
    let ans = await mysqlQ(info_sql, [
        req.body.uname,
        req.body.default_addr,
        req.body.default_phone,
        req.body.gender,
        imgPath,
        req.body.realname,
        req.body.id
    ])
    console.log(ans)
    let ret=await getInfo(req.body.id)
    res.send({
      body:ret,
      ok:ans?true:false
    })
})


module.exports = router
