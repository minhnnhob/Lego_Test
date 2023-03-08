const Account = require('../app/models/Account');
const User = require('../app/models/User');

class Validation{
    register(req, res, next){
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.passwordConfirm;
        if(confirmPassword != password){
            console.log('confirmPassword and password does not match');
            res.render('register', {register: true, message: 'confirmPassword and password does not match'});
        }
        else{
            next();
        }
    }
    isEmailExisted(req, res, next){
        const email = req.body.email;
        User.findOne({email: email})
        .then(user=>{
            if(user!=null){
                console.log(user)
                res.render('register', {register: true, message: 'Email is existed'});
            }else{
                next();
            }
        })
    }

    isUserNameExisted(req, res, next){
        const username = req.body.username;
        Account.findOne({username: username})
        .then(account=>{
            if(account!=null){
                console.log(account)
                res.render('register', {register: true, message: 'Username is existed'});
            }else{
                next();
            }
        }).catch(err=>console.log(err))
    }
}


module.exports = new Validation();