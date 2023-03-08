const Account = require('../models/Account');
const User = require('../models/User');
const Category = require('../models/Category');
const Theme = require('../models/Theme');

const express = require('express');
const router = express.Router();
const product = require('../models/Product');
const Order = require('../models/Order')
const mongoose = require('mongoose')



const {convertToObject} = require('../../util/mongoose');
const {convertToArrayObjects} = require('../../util/mongoose');

const {hashPassword} = require('../../security/hash');
const {comparePassword} = require('../../security/hash');

const { ObjectId } = require('mongodb');

const { response } = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const OrderDetails = require('../models/OrderDetails');

var url = 'mongodb+srv://lego:lego@cluster0.3no8d6y.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;


class AdminController {
    detail(req, res) {
        User.findOne({account: new ObjectId(req.signedCookies.adminId)}).populate('account').then(user=>{
           User.find({}).then(users=>{
            // console.log({user: convertToObject(user),users});
            res.render('admin/detail',{admin: true,user:convertToObject(user),users:convertToArrayObjects(users)})
           })
        })
        .catch(err=>console.log(err))
    }

  


    //[GET] /news
    index(req, res) {
        res.render('admin/homeAdmin', {admin: true});
    }   
    
    
    productManager(req, res, next) {
        // User.find((err, users) => {
        //     if (err) return res.status(500).send(err);
        //     res.send(users);
        //   });
        const search = {
            s: (Boolean(req.query.s)) ? req.query.s : null
        }
        const where = (Boolean(search.s)) ? {"name": new RegExp(search.s, 'i')} : {}
        //View all products
        product.find(where, (error, data)=>{
            //console.log('danh sach product', data);
            res.render('admin/products', {admin:true, products: convertToArrayObjects(data), search: search});
        });
       
        // router.get('/',async (req,res)=>{
        //     let client = await MongoClient.connect(url)
        //     let dbo = client.db("lego_shopping")
        //     let productList = await dbo.collection("products").find().toArray()
        //     res.render('admin/products',{'productList':productList})
        // })
        
        // Product.find({})
        // .then(Products => res.render('admin/products', {
        //     Products : Products.map(Produc   ts => Products.toObject())
        // }))
    }

    async goTheme(req, res){
        
        const search = {
            s: (Boolean(req.query.s)) ? req.query.s : null
        }
        const where = (Boolean(search.s)) ? {"name": new RegExp(search.s, 'i')} : {}

        const themes = await Theme.find(where);
        res.render("admin/theme/index", {admin: true, themes: convertToArrayObjects(themes), search: search})
    }
    async goThemeUpdate(req, res){
        const theme = await Theme.findById(req.params.id);
        const themes = await Theme.findById();
        res.render("admin/theme/update", {admin: true, theme: convertToObject(theme)})
    }
    async doThemeUpdate(req, res){
        var theme = new Theme({
            _id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            img: req.body.img
        })
        var upsetData = theme.toObject()
        delete upsetData._id
        await Theme.update({_id: req.params.id}, upsetData, {upsert: true})
        res.redirect("/admin/theme")
    }
    async goThemeAdd(req, res){
        res.render("admin/theme/add", {admin: true})
    }
    async doThemeAdd(req, res){
        const theme = new Theme()
        theme.name = req.body.name
        theme.description = req.body.description
        theme.img = req.body.img
        await theme.save()
        res.redirect("/admin/theme")
    }
    async doThemeDelete(req, res){
        await Theme.remove({_id: req.params.id})
        res.redirect("/admin/theme")
    }


    //add product
    addProduct(req, res, next) {
        Theme.find({}, (error, theme)=>{
        Category.find({}, (error, category)=>{

        //product.create(req.body);
        res.render('admin/addProduct', {admin:true, themes: convertToArrayObjects(theme), categories: convertToArrayObjects(category)})
        })
        //res.redirect('admin/products');
    }
)}
    SubmitProduct(req, res, next) {
        product.create(req.body);
        res.redirect('/admin/products');
        // const form = req.body;
        // const newProduct = new product();
        // newProduct.name = form.name;
        // newProduct.age = form.age;
        // newProduct.price = form.price;
        // newProduct.quantity = form.quantity;
        // newProduct.description = form.description;
        // newProduct.ratting = form.ratting;
        // newProduct.img1 = form.img1;
        // newProduct.save().then(res.redirect('/admin/products'))
    }

    //update product
    updateProduct(req, res, next) {
        
        product.findById(req.params.id, (error, data) => {
            res.render('admin/updateProduct', {admin:true, Product:convertToObject(data)})
        })
    }
    update(req, res, next) {
        console.log('demo',req.body);
        product.findByIdAndUpdate(req.body.id, req.body, (error, data) =>{
            res.redirect('/admin/products');
        })
    }

    //delete product
    deleteProduct(req, res, next) {
        product.findByIdAndDelete(req.params.id, (error, data) => {
            res.redirect('/admin/products');
        })
    }

    //search product
    searchProduct(req, res, next) {
        
        product.find({name: req.body.searchName}, (error, data)=>{
                console.log(data);
        res.render('admin/searchProduct', {admin:true, products: convertToArrayObjects(data)});
        });
        
    }




    // Change Password Admin
    changePassword(req,res){
        res.render('admin/changePassword',{admin:true}) ;
     }
 
     changePasswordSave(req,res){
         Account.findOne({
             _id:req.signedCookies.adminId
         }).then(account=>{
             const isPassword = comparePassword(req.body.currentPassword,account.password) 
             if(isPassword){
                 const newPassword = hashPassword(req.body.newPassword) ;
                 Account.updateOne({_id:req.signedCookies.adminId},{password:newPassword}).then(
                     res.render('admin/changePassword',)
                 )
             }else{
                 res.render('admin/changePassword',{admin:true}, {
                     message: 'Password Wrong'
                 })
             }
         })
     }

     dashboard(req, res){
            Order.find({})
            .then(orders=>{
                var waiting = 0;
                var confirmed = 0;
                var delivery = 0;
                var canceled = 0;
    
                orders.forEach(element => {
                    if(element.status == "Waiting"){
                        waiting = waiting + 1;
                    }else if(element.status == "Delivery"){
                        delivery = delivery + 1;
                    }else if(element.status = "Confirmed"){
                        confirmed = confirmed + 1;
                    }else if(element.status == "Canceled"){
                        canceled = canceled + 1;
                    }
                });
    
                Product.find({})
                .then(products=>{
    
                    Order.find({})
                    .then(order=>{
    
                        var totalOrder = 0;
                        order.forEach(element => {
                            totalOrder = totalOrder+1;
                        });
                        
                        var confirmedOrderRating = 0;
                        order.forEach(element=>{
                            if(element.status == "Completed"){
                                confirmedOrderRating++;
                            }
                        })
                        confirmedOrderRating = confirmedOrderRating /  totalOrder * 100;
                        confirmedOrderRating = Math.round(confirmedOrderRating);
                        Account.find({})
                        .then(user=>{
                            var totalUser = 0;
                            var totalAdmin = 0;
                            user.forEach(element => {
                                if(element.role == "USER")
                                    totalUser = totalUser+1;
                                else
                                    totalAdmin = totalAdmin+1;
                            });
                            res.render('admin/dashboard',{
                                admin: true, 
                                waiting: waiting, 
                                confirmed: confirmed, 
                                delivery: delivery, 
                                canceled: canceled, 
                                products: convertToArrayObjects(products),
                                order: totalOrder,
                                user: totalUser,
                                admin: totalAdmin,
                                orderratting: confirmedOrderRating
                            })
                        })
    
                    })
                    
                })
                
            })    
     }


     editIn4(req,res){
        User.findOne({account :new ObjectId(req.signedCookies.adminId)}).populate('account')
        .then(user=>{
            User.find({}).then(
                res.render('admin/editInformation',{user:convertToObject(user)})
            )
        })
               
    }

    editIn4Save(req,res){
        const form = req.body
        const userID = {account :new ObjectId(req.signedCookies.adminId)};
        
        User.findOne(userID)
        .then(user =>{
            
            console.log(user.name)
            // ,{phonenumber: form.phone},{email:form.email},{dob:form.dob},{address: form.country}
            User.updateOne({account: req.signedCookies.adminId},{name: form.name, 
                                                                email:form.email,
                                                                phonenumber: form.phone,
                                                                dob:form.dob,
                                                                address: form.country
                                                            })
            .then(res.redirect('/admin/account'))
        })

    }

    orderManager(req,res){
        Order.find({}).then(
            orders=>{
                // console.log(orderdetails)
                res.render('admin/orderAD',{admin:true,orders:convertToArrayObjects(orders)})
            }
        )
    }

    orderstatus(req,res){
        Order.updateOne({_id: req.params.id },{status: "Completed"})
        .then(
            res.redirect('/admin/order/')
        )
    
    
    }
    
    orderstatusD(req,res){
        console.log(req.params.id)
        // console.log("hsgfhn dfhfssssgsssssssssdfh")
        Order.updateOne({_id: req.params.id },{status: "Delivery"})
        .then(
            res.redirect('/admin/order/')
        )
    }

}

//make object NewsController to use in another file
module.exports = new AdminController();
