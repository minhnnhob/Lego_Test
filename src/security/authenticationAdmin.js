const Account = require('../app/models/Account');

class auth{
    auth(req, res, next){
        if(!req.signedCookies.adminId){
            res.redirect('/auth/login');
            return;
        }else{
            Account.findOne({_id: req.signedCookies.adminId})
            .then(account=>{
                if(account===null){
                    
                    res.redirect('auth/login');
                    return;
                }else{
                    next();
                }
            })
        }
    }
}


module.exports = new auth();