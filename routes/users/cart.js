var express = require('express');
var router = express.Router();
const { query: mysqlQ } = require('../../static/js/mymysql')
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')
const moment = require('moment/moment');
// const md5=crypto.createHash('md5')
router.post('/query', async (req, res) => {
    let id = req.body.id
    let cart_sql = 'select * from cart where uid=?'
    let ans = await mysqlQ(cart_sql, [id])
    let ret = []
    console.log('cart post received,this is the id:@@', id)
    console.log('this is the cart query ans@@:', ans)
    for (let item of ans) {
        let detail = (await mysqlQ('select min_price,pname from pages where pid=?', [item.pid]))[0]
        let img_cover = (await mysqlQ('select img_path from images where pid=?', [item.pid]))[0].img_path
        let cart_id = item.cart_id;
        console.log('this is cart_id:@@', cart_id)
        let choices = await mysqlQ('select choice_name,price from action_choices,choices where action_id=? and action_choices.cid=choices.cid', [cart_id])
        // let choices=await mysqlQ(`select * from action_choices`,[])
        console.log('this is choices:@@', choices)
        let price = detail.min_price
        console.log('this is min_price:@@', price)
        choices.forEach(element => {
            price += element.price
        })

        ret.push({
            detail,
            choices,
            price,
            quantity: item.quantity,
            img_cover,
            pid: item.pid,
            cart_id
        })
    }
    res.send(ret)
})

router.post('/add', async (req, res) => {
    console.log('add request received!')
    console.log('this is req:@@', req.body)
    let myhash = crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex')
    console.log('this is the hash code of body:@@', myhash)
    let checksql = `select cart_id from cart where myhash = ?`
    let checkAns = await mysqlQ(checksql, [myhash])
    if (checkAns.length) {
        let p1sql =
            `update cart set quantity = quantity + 1 where cart_id= ?`
        await mysqlQ(p1sql, [checkAns[0].cart_id])
    }
    else {
        let cartid = uuidv4()
        let choice_name_full = ``
        for (let c in req.body.mychoices) {
            let action_id = cartid
            let choice_id = req.body.mychoices[c].cid
            choice_name_full += ` ${req.body.mychoices[c].choice_name}`
            let insAc = await mysqlQ(`insert into action_choices(cid,action_id) values(?,?) `, [
                choice_id,
                action_id
            ])
            console.log('insAc:@@', insAc)
        }
        // console.log(`this is choice name full:@@`,choice_name_full)
        let insCart = await mysqlQ(`insert into cart(cart_id,uid,pid,quantity,cart_full_name,myhash) values(?,?,?,?,?,?) `, [
            cartid,
            req.body.id,
            req.body.pid,
            req.body.quantity,
            req.body.pname + choice_name_full,
            myhash
        ])
        console.log('insCart:@@', insCart)

    }
    res.send({
        ok: true
    })
})

router.post('/remove', async (req, res) => {

    let rmSql = `delete  cart,action_choices from cart left join action_choices on cart.cart_id = action_choices.action_id where cart.cart_id = ?`


    try {

        let rmAc = await mysqlQ(rmSql, [req.body.cart_id])

        console.log(rmAc)

        res.send({
            ok: true
        })

    } catch (err) {

        console.log(err)

        res.send({
            ok: false
        })

    }

})

router.post(`/modifyQuantity`, async (req, res) => {
    let modSql = `update cart set quantity=? where cart_id=?`
    try {

        let modAc = await mysqlQ(modSql, [req.body.quantity, req.body.cart_id])
        console.log('modified quantity!@@', modAc)
        res.send({
            ok: true
        })

    } catch (e) {
        console.log(e)
        res.send({
            ok: false
        })
    }
})

router.post(`/purchase`, async (req, res) => {
    let step1 = `select * from cart where cart_id=?`
    let newid = uuidv4()
    try {
        let step3 = `insert into myorder (order_id,order_time,order_overhead,order_client,phonenum,addr,order_client_realname) values(?,?,?,?,?,?,?)`
        let ac3 = await mysqlQ(step3, [
            newid,
            moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            req.body.order_overhead,
            req.body.order_client,
            req.body.phonenum,
            req.body.addr,
            req.body.order_client_realname
        ])
        console.log('this is ac3:@@', ac3)
        req.body.cid_list.forEach(async c => {
            let ac1 = await mysqlQ(step1, [c.cid])
            // console.log('checking every cartid of the order:@@',ac1[0])
            let step2 = `insert into myorder_detail(order_id,uid,pid,quantity,action_id,order_full_name,price) values(?,?,?,?,?,?,?)`
            let ac2 = await mysqlQ(step2, [
                newid,
                ac1[0].uid,
                ac1[0].pid,
                ac1[0].quantity,
                c.cid,
                ac1[0].cart_full_name,
                c.price
            ])
            console.log('inserting order detail:@@', ac2)
            let step2_1 = `delete from cart where cart_id=?`
            let ac2_1 = await mysqlQ(step2_1, [c.cid])
            console.log('deleted old cart record:@@', ac2_1)
        })

        res.send({
            ok: true,
            order_id: newid
        })
    } catch (err) {
        res.send({
            ok: false
        })
    }
})

module.exports = router