var express = require('express');
var router = express.Router();
const myToken = require('../../static/js/myToken')


router.post('/', async (req, res) => {
    let t = req.headers.authorization
    console.log(t)
    let jwt_ans = await myToken.verify(t)
    if (jwt_ans.ok) {
        console.log('jwt verify successful:@@!')
    }
    else {
        console.log('jwt verify failed:@@!')
    }
    res.send(jwt_ans)
})

module.exports = router
