let db = require('../config/connection');
let collection = require('../config/collections');
const async = require('hbs/lib/async');
var objectId=require('mongodb').ObjectId

module.exports = {  
    addProduct: (product) => {
        return new Promise(async(resolve,reject)=>{
        try {
            
                db.get().collection('product').insertOne(product).then((data) => {
                    resolve()
                })
          
        } catch (error) {
            reject(error)
        }
    })
       
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
        try {
           
                let products=await db.get().collection('product').find().toArray()
                resolve(products)
           
        } catch (error) {
            reject(error)
        }
    })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
        try {
           
                db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                    resolve(response)
                })
          
        } catch (error) {
            reject(error)
        }
    })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
        try {
          
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                    resolve(product)
                })
            
        } catch (error) {
            reject(error)
        }
    })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
        try {
            
                db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                    $set:{
                        name:proDetails.name,
                        description:proDetails.description,
                        price:proDetails.price
                    }
    
                }).then((response)=>{
                    resolve()
                })
           
        } catch (error) {
            reject(error)
        }
    })
    },

    getProductData:(productid)=>{
        return new Promise(async(resolve, reject)=>{
        try {
           
                await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productid)}).then((productdata)=>{
                    resolve(productdata)
                })
    
    
    
           
        } catch (error) {
            reject(error)
        }
    })
    },
    catProMatch:(catId)=>{
        return new Promise ((resolve, reject)=>{
        try {
           
                let product=db.get().collection(collection.PRODUCT_COLLECTION).find({category:catId}).toArray()
                resolve(product)
        
        } catch (error) {
            reject(error)
        }
    })
    }
}