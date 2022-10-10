let db = require("../config/connection");
let collection = require("../config/collections");
const async = require("hbs/lib/async");
var objectId = require("mongodb").ObjectId;

module.exports = {
  addCoupon: (coupon, callback) => {
    try {
      db.get()
        .collection("coupon")
        .insertOne(coupon)
        .then((data) => {
          callback(data.insertedId);
        });
    } catch (error) {
      reject(error)
    }
  },
  getCoupon: () => {
    return new Promise(async (resolve, reject) => {
    try {
     
        let coupon = await db.get().collection("coupon").find().toArray();
        resolve(coupon)
     
    } catch (error) {
      reject(error)
    }
  })
  },
  deleteCoupon: (couponId) => {
    return new Promise((resolve, reject) => {
    try {
    
        db.get()
          .collection(collection.COUPON_COLLECTION)
          .deleteOne({ _id: objectId(couponId) })
          .then((response) => {
            resolve(response);
          });
     
    } catch (error) {
      reject(error)
    }
  });
  },

  getAllCoupon: (coupUSer) => {
    let couponNew = coupUSer.coupon;

    let userId = coupUSer.userId;
    
    return new Promise(async (resolve, reject) => {
    try {
       
   
      let couponDetails = await db
        .get()
        .collection(collection.COUPON_COLLECTION)
        .findOne({ coupon: couponNew });

      if (couponDetails) {
       
        var d = new Date();
        
        let str = d.toJSON().slice(0, 10);

       

        if (str > couponDetails.date) {
          resolve({ expirry: true });
        } else {
          
          let users = await db
            .get()
            .collection(collection.COUPON_COLLECTION)
            .findOne({ coupon: couponNew, users: { $in: [objectId(userId)] } });
          
          if (users) {
            
            resolve({ used: true });
          } else {
            resolve(couponDetails);
          }
        }
      } else {
        
        resolve({ unAvailable: true });
      }
   
    } catch (error) {
      reject(error)
    }
  })

  },

  viewCoupon: () => {
    return new Promise(async (resolve, reject) => {
    try {
       
            let viewCoupon = await db
              .get()
              .collection(collection.COUPON_COLLECTION)
              .find()
              .toArray();
            resolve(viewCoupon);
        
    } catch (error) {
        
    }
  })
  }
};
