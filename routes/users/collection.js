var express = require('express');
var router = express.Router();
const { query: mysqlQ } = require('../../static/js/mymysql')
const { v4: uuidv4 } = require('uuid');
const getPhoto = require('../../static/js/getPhoto')

router.post('/',async (req,res)=>{
    try {
        console.log(`this is collect:@@`,req.body)
        let check=await mysqlQ(`select 1 from collection where uid=? and pid=?`,[req.body.uid,req.body.pid])
        if(!check.length) {
            let addSql=`insert into collection (collection_id,uid,pid) values(?,?,?)`
            await mysqlQ(addSql,[uuidv4(),req.body.uid,req.body.pid])
            
        }
        else {
            console.log(`already exist!@@`)
        }
        res.send({
            ok:true
        })
    }catch(err) {
        res.send({
            ok:false
        })
    }
})
router.get(`/`,async(req,res)=>{
    let uid=req.query.uid
    let ret=await mysqlQ(`select collection.*,pname,min_price from collection left join pages on collection.pid= pages.pid where collection.uid =? `,[uid])
    for(let element of ret) {
        element.img_path=await getPhoto(element.pid)
        element.img_path=element.img_path[0].img_path
    }
    // ret.forEach(async element => {
    // });
    res.send(ret)
})





router.post('/rm',async (req,res)=>{
    try {
        console.log(`this is collect:@@`,req.body)
        await mysqlQ(`delete  from collection where uid=? and pid=?`,[req.body.uid,req.body.pid])
        res.send({
            ok:true
        })
    }catch(err) {
        res.send({
            ok:false
        })
    }
})

module.exports = router