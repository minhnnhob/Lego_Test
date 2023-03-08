const Product = require('../models/Product');
const Category = require('../models/Category');
const Theme = require('../models/Theme');
const Account = require('../models/Account');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetails');


const {convertToObject} = require('../../util/mongoose');
const {convertToArrayObjects} = require('../../util/mongoose');

const {hashPassword} = require('../../security/hash');
const {comparePassword} = require('../../security/hash');
const OrderDetails = require('../models/OrderDetails');
const { ObjectId } = require('mongodb');

var url = 'mongodb+srv://lego:lego@cluster0.3no8d6y.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;

class NewsController {
    //render all products to homepage with two ways - NQT 27/2/2023
    index(req, res) {
        Product.find({}).populate('category').populate('theme')
        .then(products=>{
            res.render('home', {products: convertToArrayObjects(products)})
        }).catch(err=>console.log(err));
    }
    indexTheme(req, res, next) {
     
        Product.find({}).populate('category').populate('theme')
        .then(products=>{
            res.render('user/theme', {products: convertToArrayObjects(products)})
        }).catch(next)
    }

    product(req, res){
        Product.findOne({
            slug: req.params.slug
        }).populate('theme').populate('category')
        .then(product=>{
            Product.find({})
            .then(products=>{
                return products;
            })
            .then((products)=>{
                console.log({product: convertToObject(product), products});
                res.render('user/viewProduct', {product: convertToObject(product), products: convertToArrayObjects(products)})
            }
            )
        })
        .catch(err=>console.log(err)); 
    }

    addToBag(req, res){
        if(!req.signedCookies.userId){
            res.redirect('/auth/login');
            return;
        }else{
            console.log(req.signedCookies.userId)
            const form = req.body;
            const newCartItem = new Cart();
            newCartItem.product = form.product;
            newCartItem.quantity = form.quantity;
            newCartItem.user = req.signedCookies.userId;
            console.log(newCartItem);
            Cart.findOne({user: req.signedCookies.userId, product: form.product})
            .then(cartItem=>{
                if(cartItem !== null){
                    console.log('Existed'+cartItem);
                    res.redirect('/product/'+form.slug);
                }else{
                    if(form.quantity>form.currentQuantity){
                        res.redirect('/product/'+form.slug);
                    }else if(form.quantity<1){
                        res.redirect('/product/'+form.slug);
                    }
                        newCartItem.save()
                        .then(()=>res.redirect('/product/'+form.slug))
                        .catch(err=>console.log(err));
                }
            })
        }
    }

    cart(req, res){
        Cart.find({user: req.signedCookies.userId}).populate('product')
        .then(carts=>{
            var total = 0;
            carts.forEach(element => {
                total = total + element.product.price * element.quantity;
            });
            res.render('user/cart', {carts: convertToArrayObjects(carts), total: total});
        }).catch(err=>console.log(err));
        
    }

    updateItem(req, res){
        const form = req.body;
        Product.findOne({_id: form.product})
        .then(product=>{
            if(product.quantity<form.quantity){
                res.redirect('/cart');
            }else if(form.quantity<0){
                res.redirect('/cart');
            }
            else{
                Cart.updateOne({_id: form._id}, {quantity: form.quantity})
                .then(res.redirect('/cart'))
                .catch(err=>console.log(err));
            }
        })
    }

    deleteItem(req, res){
        const form = req.body;
        Cart.deleteOne({_id: form._id})
        .then(res.redirect('/cart'))
        .catch(err=>console.log(err));
    }


    payment(req, res){
        Cart.find({user: req.signedCookies.userId}).populate('product')
        .then(carts=>{
            var total = 0;
            carts.forEach(element => {
                total = total + element.product.price * element.quantity;
            });
            res.render('user/payment', {carts: convertToArrayObjects(carts), total: total});
        }).catch(err=>console.log(err));
    }

    acceptPayment(req, res){
        var oid = 0;
        Order.find({}).limit(1).sort({$natural:-1})
        .then(orders=>{
            orders.forEach(element=>{
                console.log(element._id);
                oid = element.oid+1;
                console.log(oid);
                const orderInfor = req.body;
                const order = new Order();
                order.customerName = orderInfor.customername;
                order.address = orderInfor.address;
                order.paymentmethod = 'Only Payment By Cash';
                order.phonenumber = orderInfor.phonenumber;
                order.email = orderInfor.email;
                order.status = 'Waiting';
                order.oid = oid;
                order.user = req.signedCookies.userId;
                //create Order
                order.save()
                .then(()=>{
                    console.log('Create Order Successfull');
                })
                .catch(err=>console.log(err))
                //get last order _id
                var lastId = 0;
                Order.find({}).limit(1).sort({$natural:-1})
                .then(orders=>{
                    orders.forEach(element => {
                        lastId = element._id;
                        console.log(lastId);
                    });
                })
                .catch(err=>console.log(err));
                //create OrderDetail
                Cart.find({}).populate('product').select('product quantity')
                .then(carts=>{
                    carts.forEach(element => {
                        const orderDetail = new OrderDetail();
                        orderDetail.order = lastId;
                        orderDetail.product = element.product._id;
                        orderDetail.quantity = element.quantity;
                        console.log(orderDetail);
                        orderDetail.save()
                        .then(console.log('OrderDetail Created Successfully'))
                        .catch(err=>console.log(err));
                    });
                }).then(
                    ()=>{
                        Cart.deleteMany({})
                        .then(()=>{
                            console.log('All Item In Cart is DELETED SUCCESSFULLY')
                            res.redirect('/');    
                        })
                        .catch(err=>console.log(err))
                    }
                )
                .catch(err=>console.log(err));
            })
        })
        .catch(err=>console.log(err));
        //Delete All Item In cart
    }







    insertAdminAccount(req, res){
        // const email = req.body.email;
        // const username = req.body.username;
        // const password = req.body.password;
        // const confirmPassword = req.body.passwordConfirm;
        var password = '123';
        var email = 'bigAdmin@gmail.como'
        const acc = new Account();
        acc.role = "ADMIN";
        acc.username = 'admin';
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




    // Insert db
    insertTheme(req, res, next){
        const cate = new Theme();
        cate.name = "DC";
        cate.description = "hahaha";
        cate.img = "1";

        cate.save().then(()=>{
            console.log('Insert Success');
            res.redirect('/');
        }).catch(err=>console.log(err));
    }

    insertCategory(req, res, next){
        const cate = new Category();
        cate.name = "Do Choi";
        cate.description = "hahaha";
        cate.img = "1";

        cate.save().then(()=>{
            console.log('Insert Success');
            res.redirect('/');
        }).catch(err=>console.log(err));
    }

    insert(req, res, next){
        const prod = new Product();
        prod.name = "2 Fast 2 Furious Nissan";
        prod.age = 2;
        prod.price = 24;
        prod.quantity = 30;
        prod.img1 = "1";
        prod.img2 = "2";
        prod.img3 = "3";
        prod.description = "hahaha";
        prod.status = "EXIST";
        prod.ratting = 5;
        prod.theme = "6402cea52895e6bf97ca25d3";
        prod.category = "6402c84bd8503ea7c6fd76fc"
        prod.save().then(()=>{
            console.log('Insert Success');
            res.redirect('/');
        }).catch(err=>console.log(err));
    }

    insertAccount(req, res, next){
        const acc = new Account();
        acc.role = "USER";
        acc.password = "123";
        acc.username = "hehe";

        acc.save().then(()=>{
            console.log('Insert Success');
            res.redirect('/');
        }).catch(err=>console.log(err));
    }

    insertUser(req, res, next){
        const us = new User();
        us.name = "Nice";
        us.phonenumber = "0123456789";
        us.email = "alo@gmail.com";
        us.address = "alo - alo - alo - HN";
        us.account = "63fd7352bcd449ebcef10058";


        us.save().then(()=>{
            console.log('Insert Success');
            res.redirect('/');
        }).catch(err=>console.log(err));
    }

    testCookie(req, res, next){
        res.cookie('user', "1234");
        res.send('HI');
        console.log(req.cookies);
    }


    


}


   
//make object NewsController to use in another file
module.exports = new NewsController();
