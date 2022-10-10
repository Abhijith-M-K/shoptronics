var express = require('express');
const { request, response, routes } = require('../app');
const productHelpers = require('../helpers/product-helpers');
const router = express.Router();
const productHelper =require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');
const adminHelpers = require('../helpers/admin-helpers');
const couponHelpers = require('../helpers/coupon-helpers');
const bannerHelpers = require('../helpers/banner-helpers');
const multer = require('multer');
const async = require('hbs/lib/async');
const { changeStatusShipped, changeStatusDelivered } = require('../helpers/user-helpers');

const fileStorageEngine=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/product-images')

  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+'--'+file.originalname);
  },
});
const upload=multer({storage:fileStorageEngine})

/* GET users listing. */
router.get('/', function(req, res, next){
  if(req.session.adminloggedIn){
    res.redirect('/admin/index') 
  }else{
   
    res.render('admin/login',{admin:true});
  }

  
    // res.render('admin/login',{admin:true});
  
});

router.get('/index', async(req, res, next) =>{

  try {
    let userCount = await userHelpers.getUserCount()
    let orderCount = await userHelpers.getOrderCount()
    let codCount = await userHelpers.totalCOD()
    let totalDelivered = await userHelpers.totalDelivered()
    let cancelled = await userHelpers.cancelled()
    let monthamount = await userHelpers.totalMonthAmount()
       
          let ONLINECount = await userHelpers.totalONLINE()
    res.render('admin/index',{ admin: true ,layout:'admin-layout',userCount,orderCount,codCount,ONLINECount,totalDelivered,cancelled,monthamount})
    
  } catch (error) {
    
  }
 
})


router.get('/view-product',(req,res,next)=>{
  try {
     // res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  productHelper.getAllProducts().then((products)=>{
    // if (req.session.adminLoggedIn){
    res.render('admin/view-product',{admin:true,layout:'admin-layout',products})
    // }else {
    //   res.redirect('/admin')
    // }
  })
    
  } catch (error) {
    next(error)
  }
 
  
})
router.get('/add-product', function (req, res, next) {

  try {
     // res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  // if (req.session.adminLoggedIn) {
    categoryHelpers.getAllCategory().then((categorydetails) =>{
  
  
      res.render('admin/add-product', {admin:true,layout:'admin-layout',categorydetails});
      })
    // }else {
    //   res.redirect('/admin');
    // }
    
  } catch (error) {
    next(error)
  }
 
 
});

router.post('/add-product',upload.array('Image',3),(req, res,next) => {
  

  try {
    const images=req.files;
    let array=[];
    array = images.map((value)=>value.filename);
    req.body.Image=array;
  
    productHelper.addProduct(req.body).then((response) =>{
      res.redirect('/admin/add-product')
    })
    
  } catch (error) {
    next(error)
  }
 
  
});

router.get('/delete-product/:id',(req,res,next)=>{
  try {
    let proId=req.params.id
  console.log(proId);
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/view-product')
  })

    
  } catch (error) {
    next(error)
  }
  
})

router.get('/edit-product/:id',async(req,res,next)=>{
  try {
    let product=await productHelper.getProductDetails(req.params.id)
  let categorydetails=await categoryHelpers.getAllCategory()
  res.render('admin/edit-product',{product,categorydetails,layout:'admin-layout'})
    
  } catch (error) {
    next(error)
  }
  
})

router.post('/edit-product/:id',(req,res,next)=>{
  try {
    productHelper.updateProduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin/view-product')
      if(req.files.Image){
        let image=req.files.Image
        let id = req.params.id
        image.mv('./public/product-images/' + id + '.jpg')
         
        
  
      }
    })
    
  } catch (error) {
    next(error)
  }
  
})

router.get('/view-users', function (req, res, next) {
  try {
    userHelpers.getAllUsers().then((userdetails) => {
   
    
      res.render('admin/view-users', { userdetails, admin: true,layout:'admin-layout'});
   
   
})
    
  } catch (error) {
    next(error)
  }
  
  
 
})

router.get('/view-category', function (req, res, next) {
  try {
    categoryHelpers.getAllCategory().then((categorydetails) => {
 
    
      res.render('admin/view-category', { categorydetails, admin: true,layout:'admin-layout'});
    
   
})
    
  } catch (error) {
    next(error)
  }
  
  
 
})

router.get('/add-category', function (req, res, next) {
  try {
    res.render('admin/add-category', { admin: true ,layout:'admin-layout'});
    
  } catch (error) {
    next(error)
  }
  
   
  
  
});

router.post('/add-category', (req, res,next) => {
  try {
    categoryHelpers.addCategory(req.body,(id) =>{
      res.redirect('/admin/view-category')
    })
    
  } catch (error) {
    next(error)
  }
    });

router.get('/delete-category/:id',(req,res,next)=>{
  try {
    let catId=req.params.id
 
    categoryHelpers.deleteCategory(catId).then((response)=>{
      res.redirect('/admin/view-category')
    })
    
  } catch (error) {
    next(error)
  }
 

})



router.get('/block/:id', (req, res,next) => {
  try {
    let usrId = req.params.id;
    userHelpers.blockUser(usrId).then((response) => {
      res.redirect('/admin/view-users')
    })
    
  } catch (error) {
    next(error)
  }
 
})


router.get('/unblock/:id',(req,res,next)=>{
  try {
    userHelpers.unblockUser(req.params.id).then(()=>{
      res.redirect('/admin/view-users')
    })
    
  } catch (error) {
    next(error)
  }
  
})

router.post('/admin-login',(req,res,next)=>{
  try {
    adminHelpers.doLogin(req.body).then((response)=>{
    
      if(response.status){
        console.log(response.status);
        req.session.adminloggedIn=true;
        req.session.admin=response.admin
        res.redirect('/admin/index')
      }else{
        res.redirect('/')
      }
  
    })
    
  } catch (error) {
    next(error)
  }

  
})

router.get('/order',async(req,res,next)=>{
  try {
    order=await userHelpers.adminOrders()
 

    res.render('admin/order', { admin: true ,layout:'admin-layout',order})
    
  } catch (error) {
    next(error)
  }
 
  })

  router.get('/view-orderproduct/:id',async(req,res,next)=>{
    try {
      singleId = req.params.id
      let products=await userHelpers.getOrderProduct(req.params.id)
      buttonchange = await userHelpers.btnChange(singleId)
     
      res.render('admin/view-orderproduct',{products,singleId,admin: true ,layout:'admin-layout',buttonchange})
      
    } catch (error) {
      next(error)
    }
   
  })

  router.get('/item-packed/:id',async(req,res,next)=>{
    try {
      orderId = req.params.id
      // let products=await userHelpers.getOrderProduct(req.params.id)
      // buttonchange = await userHelpers.btnChange(singleId)
      let changeStatusPacked = userHelpers.changeStatus(orderId)
     
      // res.render('admin/view-orderproduct',{products,singleId,admin: true ,layout:'admin-layout',buttonchange})
      res.redirect('/admin/order')
    } catch (error) {
      next(error)
    }
   
    
  
  })

  router.get('/item-shipped/:id',async(req,res,next)=>{
    try {
      orderId = req.params.id

    let changeStatusShipped = userHelpers.changeStatusShipped(orderId)
    res.redirect('/admin/order')
      
    } catch (error) {
      next(error)
    }
    
    
  
  })

  router.get('/item-delivered/:id',async(req,res,next)=>{
    try {
      orderId = req.params.id

    let changeStatusDelivered =await userHelpers.changeStatusDelivered(orderId)
    res.redirect('/admin/order')
      
    } catch (error) {
      next(error)
    }
    
    
  
  })

  



  router.get('/view-coupon', function (req, res, next) {
    try {
      couponHelpers.getCoupon().then((coupondetails) => {
  
      
        res.render('admin/view-coupon', { coupondetails, admin: true,layout:'admin-layout'});
      
     
  })
      
    } catch (error) {
      next(error)
    }
  
  
   
  })
  
  router.get('/add-coupon', function (req, res, next) {
    try {
      res.render('admin/add-coupon', { admin: true ,layout:'admin-layout'});
      
    } catch (error) {
      next(error)
    }
    
     
    
    
  });
  
  router.post('/add-coupon', (req, res,next) => {
    try {
      couponHelpers.addCoupon(req.body,(id) =>{
        res.redirect('/admin/view-coupon')
      }) 
      
    } catch (error) {
      next(error)
    }
   
     });
  
  router.get('/delete-coupon/:id',(req,res,next)=>{
    try {
      let couponId=req.params.id
    
      couponHelpers.deleteCoupon(couponId).then((response)=>{
        res.redirect('/admin/view-coupon')
      })
      
    } catch (error) {
      next(error)
    }
   
  
  })


  router.get('/logout', function(req, res, next) {
    try {
      req.session.destroy();
    res.redirect('/admin')
      
    } catch (error) {
      next(error)
    }
    
  });



  router.get('/view-banner',(req,res,next)=>{
    try {
      bannerHelpers.getAllBanner().then((banners)=>{
      
        res.render('admin/view-banner',{admin:true,layout:'admin-layout',banners})
        
      })
      
    } catch (error) {
      next(error)
    }
   
   
    
  })
  router.get('/add-banner', function (req, res, next) {
    try {
      res.render('admin/add-banner', {admin:true,layout:'admin-layout'});
    } catch (error) {
      next(error)
    }
    
     
    
    
      
      })
   
   
 
  
  router.post('/add-banner',upload.array('Image',3),(req, res,next) => {
    try {
      const images=req.files;
    let array=[];
    array = images.map((value)=>value.filename);
    req.body.Image=array;
  
    bannerHelpers.addBanner(req.body).then((response) =>{
      res.redirect('/admin/add-banner')
    })
      
    } catch (error) {
      next(error)
    }
    
    
  });
  
  router.get('/delete-banner/:id',(req,res,next)=>{
    try {
      let bannerId=req.params.id
   
    bannerHelpers.deleteBanner(bannerId).then((response)=>{
      res.redirect('/admin/view-banner')
    })
      
    } catch (error) {
      next(error)
    }
    
  
  })

  


  router.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  router.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('admin/error');
  });




module.exports = router;
