var express = require('express');
const getPhoto = require('../static/js/getPhoto')
var router = express.Router();
const { query: mysqlQ } = require('../static/js/mymysql')

router.get('/',async(req,res)=>{
    let step1=`select pid,pname,min_price from pages`
    let ans1=await mysqlQ(step1,[])
    let record=new Set()
    let ret=[]
    for(let i=0;i<12;++i) {
        let n
        do{
            n=Math.floor(Math.random() * (ans1.length))
        }while(record.has(n))
        console.log(n)
        let img_path=await getPhoto(ans1[n].pid)
        img_path=img_path[0].img_path
        ret.push({
            ...ans1[n],
            img_path
        })
    }
    res.send(ret)



})

module.exports = router;
