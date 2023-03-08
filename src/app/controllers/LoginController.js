const Account = require('../models/Account');
const User = require('../models/User');

const {convertToObject} = require('../../util/mongoose');
const {convertToArrayObjects} = require('../../util/mongoose');

const {hashPassword} = require('../../security/hash');
const {comparePassword} = require('../../security/hash');

var url = 'mongodb://127.0.0.1:27017';
var MongoClient = require('mongodb').MongoClient;

class LoginController {
    //[GET] /news
    login(req, res) {
        res.render('login');
    }
    checkLogin(req, res){
        const username = req.body.username;
        const password = req.body.password;

        Account.findOne({username: username})
        .then(account=>{
            console.log(account);
            if(account===null){
                res.render('login', {
                    message: 'User doesnt exist'
                })
                return;
            }else{
                const isPassword = comparePassword(password, account.password)
                if(!isPassword){
                    res.render('login', {
                        message: 'Password Wrong'
                    })
                    return;
                }else{
                    if(account.role === "USER"){
                        res.cookie('userId', account._id, {
                            signed: true
                        });
                        res.redirect('/');
                    }else{
                        res.cookie('adminId', account._id, {
                            signed: true
                        });
                        res.redirect('/admin/');
                    }
                }
            }
            
        })
        .catch(err=>console.log(err))
    }
    register(req, res){
        res.render('register', {register: true});
    }
    registerAction(req, res, next){
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.passwordConfirm;
        const acc = new Account();
        acc.role = "USER";
        acc.username = username;
        const hashPass = hashPassword(password);
        acc.password = hashPass;
        const us = new User();
        acc.save()
        .then(console.log("Create Account Successfully"))
        .catch(err=>console.log(err));
        var lastid = 0;
        Account.find({}).limit(1).sort({$natural:-1})
        .then(accounts=>{
        accounts.forEach(element => {
        us.account = element._id;
                        us.name = " ";
                        us.phonenumber = " ";
                        us.address = " ";
                        us.email= email;
                        us.save()
                        .then(()=>{console.log(us)
                        console.log('create user success')
                        })
                        .catch(err=>console.log(err));
        });
        }).catch(err=>console.log(err));
        res.redirect('/');
    }
}
//make object NewsController to use in another file
module.exports = new LoginController();
