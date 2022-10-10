let db = require('../config/connection');
let collection = require('../config/collections');
const async = require('hbs/lib/async');
var objectId=require('mongodb').ObjectId

module.exports = {  
    addBanner: (banner) => {
        return new Promise(async(resolve,reject)=>{
        try {
           
                db.get().collection('banner').insertOne(banner).then((data) => {
                    resolve()
                })

           
        } catch (error) {
            reject(error)
        }
    })
       
    },
    getAllBanner:()=>{
        return new Promise(async(resolve,reject)=>{
        try {
           
                let banners=await db.get().collection('banner').find().toArray()
                resolve(banners)
           
        } catch (error) {
            reject(error)
        }
    })
    },
    deleteBanner:(bannerId)=>{
        return new Promise((resolve,reject)=>{
        try {
           
                db.get().collection(collection.BANNER_COLLECTION).deleteOne({_id:objectId(bannerId)}).then((response)=>{
                    resolve(response)
                })
           
        } catch (error) {
            reject(error)
        }
    })
    },
    getBannerDetails:(bannerId)=>{
        return new Promise((resolve,reject)=>{
        try {
           
                db.get().collection(collection.BANNER_COLLECTION).findOne({_id:objectId(bannerId)}).then((banner)=>{
                    resolve(banner)
                })
            
        } catch (error) {
            reject(error)
        }
    })
       
    },
    
}