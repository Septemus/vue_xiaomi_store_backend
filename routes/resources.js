var express = require('express');
var router = express.Router();
const mysql = require('mysql')
const { query: mysqlQ } = require('../static/js/mymysql')

/* GET home page. */
router.get('/product', function (req, res, next) {
  let product = require('../static/product.json')
  // res.send(JSON.stringify(product))
  res.json(product)
  res.end()
});

router.get('/category', function (req, res, next) {
  let category = require('../static/category.json')
  // res.send(JSON.stringify(product))
  res.json(category)
  res.end()
});

router.get('/nav', function (req, res, next) {
  let nav = require('../static/nav_childrens.json')
  // res.send(JSON.stringify(product))
  res.json(nav)
  res.end()
});
router.get('/slide', (req, res, next) => {
  let slide = require('../static/slide.json')
  res.json(slide)
  res.end()
})
router.get('/detail', async function (req, res, next) {
  console.log(req.query)
  let sqls = [
    `select description,min_price,min_old_price,desc_pre,pname from pages where pid = ?`,
    `select img_path from images where pid =?`,
    `select oid,option_name from options where pid=?`,
    `select options.oid,option_name,choice_name,price,old_price,cid from choices,options where pid=? and options.oid=choices.oid`
  ]
  let finished = 0
  let content = []
  console.log(sqls)
  for (let sql of sqls) {
    let data = await mysqlQ(sql, req.query.pid)
    console.log(data)
    content.push({ data })
  }
  res.json(content)
  console.log('!!!!!!!!!!')
})

module.exports = router;
