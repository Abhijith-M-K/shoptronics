let db = require('../config/connection');
let collection = require('../config/collections');
const async = require('hbs/lib/async');
var objectId=require('mongodb').ObjectId

module.exports = {  
    addCategory: (category, callback) => {
        try {
            db.get().collection('category').insertOne(category).then((data) => {
                callback(data.insertedId)
            })
        } catch (error) {
            reject(error)
        }
       
    },
    getAllCategory:()=>{
        return new Promise(async(resolve,reject)=>{
        try {
           
                let category=await db.get().collection('category').find().toArray()
                resolve(category)
            
        } catch (error) {
            reject(error)
        }
    })
        
    },
    deleteCategory:(catId)=>{
        return new Promise((resolve,reject)=>{
        try {
           
                db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objectId(catId)}).then((response)=>{
                    resolve(response)
                })
          
        } catch (error) {
            reject(error)
        }
    })
    },
    getCategoryDetails:(catId)=>{
        return new Promise((resolve,reject)=>{
        try {
           
                db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:objectId(catId)}).then((category)=>{
                    resolve(category)
                })
          
        } catch (error) {
            reject(error)
        }
    })
    },
}