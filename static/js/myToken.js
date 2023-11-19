const jwt = require('jsonwebtoken')
const secret = 'xiaomi_store'
const expire_time = '7 days'
const algorithm='HS256'
const mysqlQ = require('./mymysql')
function create(value) {
    return jwt.sign(value, secret, 
        {
            algorithm,
            expiresIn: expire_time 
        }
    )
}
async function verify(token) {
    let ans= await jwt.verify(token, secret, {algorithm}, (err, data) => {
        if (err) {
            console.log('jwt verified failed,this is err message:@@',err);
            return {
                ok:false,
                err
            }
        }
        else {
            console.log('this is the data from jwt verify:@@',data);
            return {
                ok:true,
                data
            }
        }
    });
    if(ans.ok) {
        let uid=ans.data.id
        let uname=await mysqlQ.query('select uname from users where uid = ?',[uid])
        uname=uname[0].uname
        console.log('this is uname:@@',uname)
        ans.data.name=uname?uname:uid
    }
    console.log(ans)
    return ans
}
module.exports = { create,verify }

