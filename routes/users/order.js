var express = require('express');
var router = express.Router();
const { query: mysqlQ } = require('../../static/js/mymysql')
const { v4: uuidv4 } = require('uuid');

async function findByOid(id) {
    let order_sql = 'select * from myorder where order_id=?'
    let ans = await mysqlQ(order_sql, [id])
    let ret = {
        list: [],
        order_info: ans[0]
    }
    console.log('order post received,this is the id:@@', id)
    console.log('this is the order query ans@@:', ans)
    let detail = (
        await mysqlQ(
            'select * from myorder_detail where order_id=?',
            [ans[0].order_id]
        )
    )
    ret.list=detail
    return ret
}

async function findByUid(id) {
    let ret = {
        ok:true,
        list:[],
    }
    let order_sql=`select * from myorder where order_client=? order by order_time desc`
    let ans = await mysqlQ(order_sql, [id])
    console.log(ans)
    for(let element of ans) {
        let detail_sql=`select * from myorder_detail where order_id=?`
        let curd=await mysqlQ(detail_sql,[element.order_id]) 
        // console.log(`one of the order from ${id}:@@`,curd)
        ret.list.push({
            order_info:element,
            darr:curd
        })
    }
    return ret 
}

router.get('/',async(req,res)=>{
    let uid=req.query.uid
    let ret=await findByUid(uid)
    res.send(ret)
})


router.post('/query', async (req, res) => {
    let id = req.body.id
    let ret = await findByOid(id)
    res.send(ret)
})

router.post('/remove',async(req,res)=>{
    let rmsql=`delete from myorder where order_id=?`
    try {
        await mysqlQ(rmsql,[req.body.order_id])
        res.send({
            ok:true
        })
    }catch(err){
        res.send({
            ok:false
        })
    }
})


module.exports = router