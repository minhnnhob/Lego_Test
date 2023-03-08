const Account = require('../models/Account');
const User = require('../models/User');

const {convertToObject} = require('../../util/mongoose');
const {convertToArrayObjects} = require('../../util/mongoose');
const {hashPassword} = require('../../security/hash');
const {comparePassword} = require('../../security/hash');
const { ObjectId } = require('mongodb');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderDetails = require('../models/OrderDetails');
const { product } = require('./HomeController');
const { signedCookies } = require('cookie-parser');
const { findOne } = require('../models/Account');
var url = 'mongodb://127.0.0.1:27017';
var MongoClient = require('mongodb').MongoClient;

class UserDetailController {
    //[GET] /news
    detail(req, res) {
        User.findOne({account: new ObjectId(req.signedCookies.userId)}).populate('account').then(user=>{
           User.find({}).then(users=>{
            // console.log({user: convertToObject(user),users});
            res.render('user/detail',{user:convertToObject(user),users:convertToArrayObjects(users)})
           })
        })
        .catch(err=>console.log(err))
    }

    logout(req,res,next){
        res.clearCookie('userId');
        res.clearCookie('adminId');
        // REDIRECT OT HOME
        res.redirect('/');
    }

    changePassword(req,res){
       res.render('user/changePassword') ;
    }

    changePasswordSave(req,res){
        Account.findOne({
            _id:req.signedCookies.userId
        }).then(account=>{
            const isPassword = comparePassword(req.body.currentPassword,account.password) 
            if(isPassword){
                const newPassword = hashPassword(req.body.newPassword) ;
                Account.updateOne({_id:req.signedCookies.userId},{password:newPassword}).then(
                    res.render('user/changePassword')
                )
            }else{
                res.render('user/changePassword', {
                    message: 'Password Wrong'
                })
                
            }
        })
    }

    editIn4(req,res){
        User.findOne({account :new ObjectId(req.signedCookies.userId)}).populate('account')
        .then(user=>{
            User.find({}).then(
                res.render('user/editInformation',{user:convertToObject(user)})
            )
        })
               
    }

    editIn4Save(req,res){
        const form = req.body
        const userID = {account :new ObjectId(req.signedCookies.userId)};
        
        User.findOne(userID)
        .then(user =>{
            
            console.log(user.name)
            // ,{phonenumber: form.phone},{email:form.email},{dob:form.dob},{address: form.country}
            User.updateOne({account: req.signedCookies.userId},{name: form.name, 
                                                                email:form.email,
                                                                phonenumber: form.phone,
                                                                dob:form.dob,
                                                                address: form.country
                                                            })
            .then(res.redirect('/detail'))
        })

    }

    orderDetail(req,res){
      
            Order.find({user:(req.signedCookies.userId)}).populate('user').then(
                orders=>{
                                       
                    User.findOne({account: req.signedCookies.userId}).then(
                        users=>{
                            // console.log(total)
                            res.render('user/orderDetail',{orders:convertToArrayObjects(orders),users:users})
                        }
                    )
                    
                }
            )}
    // res.render('user/orderDetail',{orderdetails:convertToArrayObjects(orderdetails)})

    order(req,res){
        OrderDetails.find({order:req.params.id}).populate('product').populate('order')
        .then(
                orderdetails=>{
                    var total=0;
                    orderdetails.forEach(element=>
                        total = total + element.product.price*element.quantity)
                console.log(convertToArrayObjects(orderdetails)),
                res.render('user/order',{orderdetails:convertToArrayObjects(orderdetails),total:total})
            }
        )
    }
}
//make object NewsController to use in another file
module.exports = new UserDetailController();