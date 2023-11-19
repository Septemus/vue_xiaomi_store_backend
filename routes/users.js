var express = require('express');
var router = express.Router();
// const { query: mysqlQ } = require('../static/js/mymysql')
// const myToken = require('../static/js/myToken')
// let sql0 = 'select password from users where uid=?'
const cart = require('./users/cart.js');
const order = require('./users/order.js');
const login = require('./users/login.js');
const register = require('./users/register.js');
const verify = require('./users/verify.js');
const info = require('./users/info.js');
const collection = require('./users/collection.js');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.use('/cart', cart)
router.use('/order', order)
router.use('/login', login)
router.use('/reg', register)
router.use('/verify', verify)
router.use('/info', info)
router.use('/collection', collection)
module.exports = router;
