require('dotenv').config()
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);  
const serviceSid =process.env.SERVICE_SID   

module.exports={
   
    doSms:(userData)=>{
        let res={}
        return new Promise(async(resolve,reject)=>{
        try {
           
       
            await client.verify.services(serviceSid).verifications.create({
                to :`+91${userData.mobile}`,
                channel:"sms"
            }).then((res)=>{
                res.valid=true;
                resolve(res)
               
            })
       
        } catch (error) {
            reject(error)
        }
    })
    },
   
    otpVerify:(otpData,userData)=>{
        let resp={}

        return new Promise(async(resolve,reject)=>{
        try {
            
            await client.verify.services(serviceSid).verificationChecks.create({
                to:   `+91${userData.mobile}`,
                code:otpData.otp
            }).then((resp)=>{
                 console.log("verification success");
                resolve(resp)
            })
       
        } catch (error) {
            reject(error)
        }
    })
    }

   

 }
 