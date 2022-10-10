var db = require('../config/connection')
const bcrypt = require('bcryptjs');



const collection = require('../config/collections')



module.exports ={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
        try {
           
                var loginStatus=false
                let response={}
                var admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:adminData.email})
                console.log('aaaakkkk');
                console.log(adminData.password);
               
    
                if(admin){
                    bcrypt.compare(adminData.password,admin.password).then((status)=>{
    
                      
                        
                     
                        if(status){
                           
                            response.admin=admin
                            response.status=true
                            resolve(response)
                        }else{
                            
                            resolve({status:false})
                        }
                    })
                }else{
                    
                    resolve({status:false})
                }
       
        } catch (error) {
            reject(error)
        }
    })
    },

}