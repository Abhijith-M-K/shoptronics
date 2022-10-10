var express = require("express");
var router = express.Router();
// var userHelpers=require('../helpers/user-helpers')
let productHelper = require("../helpers/product-helpers");
let userHelpers = require("../helpers/user-helpers");
let twilioHelpers = require("../helpers/twilio-helpers");
const { response, request, render, routes } = require("../app");
const categoryHelpers = require("../helpers/category-helpers");
const productHelpers = require("../helpers/product-helpers");
const async = require("hbs/lib/async");
const bannerHelpers = require("../helpers/banner-helpers");
const couponHelpers = require("../helpers/coupon-helpers");
const verifylogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    bannerHelpers.getAllBanner().then((banners) => {
      productHelper.getAllProducts().then((products) => {
        userDetails = req.session.user;
        res.render("user/index", {
          user: true,
          layout: "user-layout",
          products,
          userDetails,
          cartCount,
          wishCount,
          banners,
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("user/login", { user: true });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/signup", (req, res, next) => {
  try {
    res.render("user/signup", { user: true });
  } catch (error) {
    next(error);
  }
});

router.post("/signup", (req, res, next) => {
  try {
    userHelpers.verifyUser(req.body).then((response) => {
      console.log(response);
      if (response.status) {
        req.session.body = req.body
        console.log(req.session.body);
    twilioHelpers.doSms(req.body).then((data) => {
      req.session.body = req.body;

      if (data) {
        res.render("user/otp");
      } else {
        res.redirect("/signup");
      }
    })
  }else{
    res.redirect("/signup");
  }
})
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  try {
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/otp", (req, res, next) => {
  try {
    console.log(req.session.body);
    twilioHelpers.otpVerify(req.body, req.session.body).then((response) => {
      userHelpers.doSignup(req.session.body).then((response) => {
        res.redirect("/login");
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/category", async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    categoryHelpers.getAllCategory().then((category) => {
      productHelper.getAllProducts().then((product) => {
        res.render("user/category", {
          user: true,
          layout: "user-layout",
          category,
          product,
          cartCount,
          userDetails,
          wishCount,
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", function (req, res, next) {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {}
});

router.get("/cart", verifylogin, async (req, res) => {
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);

    let total = await userHelpers.getTotalAmount(req.session.user._id);

    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }

    userDetails = req.session.user;
    res.render("user/cart", {
      user: true,
      layout: "user-layout",
      products,
      userDetails,
      total,
      cartCount,
      wishCount,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/add-to-cart/:id", (req, res, next) => {
  try {
    userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
      // res.redirect("/");
      
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/change-product-quantity", (req, res, next) => {
  try {
    userHelpers.changeProductQuantity(req.body).then((response) => {
      res.json(response);
    });
  } catch (error) {
    next(error);
  }
});

router.get("/single-product/:id", async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }

    productHelpers.getProductData(req.params.id).then((product) => {
      res.render("user/single-product", {
        layout: "user-layout",
        user: true,
        product,
        cartCount,
        userDetails,
        wishCount,
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/checkout", verifylogin, async (req, res, next) => {
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);
    let total = await userHelpers.getTotalAmount(req.session.user._id);

    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    let addressId = req.query.id;
    let userId = req.session.user._id;

    let selectAddress = await userHelpers.placeAddress(addressId, userId);

    let userAddress = await userHelpers.userAddress(req.session.user._id);
    let viewCoupon = await couponHelpers.viewCoupon();
    res.render("user/checkout", {
      layout: "user-layout",
      user: true,
      userDetails,
      total,
      cartCount,
      products,
      wishCount,
      userAddress,
      selectAddress,
      userId,
      viewCoupon,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/product-category", async (req, res, next) => {
  try {
    catId = req.query.category;

    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }

    let prod = await productHelpers.catProMatch(catId);

    let category = await categoryHelpers.getAllCategory();

    res.render("user/product-category", {
      layout: "user-layout",
      user: true,
      prod,
      category,
      cartCount,
      userDetails,
      wishCount,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/delete-cart/:cartId/:proId", (req, res, next) => {
  try {
    cartId = req.params.cartId;
    proId = req.params.proId;

    userHelpers.deleteCart(cartId, proId).then((response) => {
      res.json(response);
    });
  } catch (error) {
    next(error);
  }
});

router.get("/profile", verifylogin, async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    let userSignupDetails = await userHelpers.getPersonalDetails(
      req.session.user._id
    );
    let userAddress = await userHelpers.userAddress(req.session.user._id);

    res.render("user/profile", {
      layout: "user-layout",
      user: true,
      userDetails,
      cartCount,
      wishCount,
      userSignupDetails,
      userAddress,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/placeorder", async (req, res, next) => {
  try {
    let products = await userHelpers.getCartProductList(req.session.user._id);
    let total = await userHelpers.getTotalAmount(req.session.user._id);
    userHelpers
      .placeOrder(req.body, products, total, req.session.user._id)
      .then((orderID) => {
        if (req.body["payment-method"] == "COD") {
          res.json({ codSuccess: true });
        } else {
          userHelpers.generateRazorPay(orderID, total).then((response) => {
            res.json(response);
          });
        }
      });
  } catch (error) {
    next(error);
  }
});

router.get("/order", async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    res.render("user/order", {
      layout: "user-layout",
      user: true,
      userDetails,
      cartCount,
      wishCount,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/order-success", async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }

    let orders = await userHelpers.getUserOrders(req.session.user._id);

    res.render("user/order-success", {
      layout: "user-layout",
      user: true,
      userDetails,
      cartCount,
      orders,
      wishCount,
    })
  } catch (error) {
    next(error);
  }
})

router.get("/view-order/:id", async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    let products = await userHelpers.getOrderProduct(req.params.id);
    let orders = await userHelpers.getUserOrders(req.session.user._id);
    value = await userHelpers.value(req.params.id);

    res.render("user/view-order", {
      layout: "user-layout",
      user: true,
      userDetails,
      cartCount,
      products,
      orders,
      wishCount,
      value,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-payment", (req, res, next) => {
  try {
    userHelpers
      .verifyPayment(req.body)
      .then(() => {
        userHelpers.changePaymentStatus(req.body["order[receipt]"]).then(() => {
          res.json({ status: true });
        });
      })
      .catch((err) => {
        res.json({ status: false });
      });
  } catch (error) {
    next(error);
  }
});

router.get("/wishlist", verifylogin, async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    userDetails = req.session.user;
    let wishCount = null;
    if (req.session.user) {
      wishCount = await userHelpers.getWishCount(req.session.user._id);
    }
    let products = await userHelpers.getWishProduct(req.session.user._id);

    res.render("user/wishlist", {
      layout: "user-layout",
      user: true,
      products,
      cartCount,
      userDetails,
      wishCount,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/add-to-wish/:id", (req, res, next) => {
  try {
    userHelpers.addToWish(req.params.id, req.session.user._id).then(() => {
      res.json({ status: true });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/delete-wish/:wishId/:proId", (req, res, next) => {
  try {
    wishId = req.params.wishId;
    proId = req.params.proId;

    userHelpers.deleteWish(wishId, proId).then((response) => {
      res.json(response);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/add-address", async (req, res, next) => {
  try {
    let userProfileDetails = await userHelpers.profileDetails(
      req.body,
      req.session.user._id
    );
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

router.get("/delete-address/:id", async (req, res, next) => {
  try {
    userId = req.session.user._id;
    addressId = req.params.id;

    let deleteAddress = await userHelpers.deleteAddress(addressId, userId);
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

router.post("/update-profile", async (req, res, next) => {
  try {
    let userName = await userHelpers.updateName(req.body, req.session.user._id);
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

router.post("/edit-address/:id", (req, res, next) => {
  try {
    addressId = req.params.id;
    usrID = req.session.user._id;
    userHelpers.updateAddress(req.body, addressId, usrID).then((response) => {
      res.redirect("/profile");
    });
  } catch (error) {
    next(error);
  }
});

router.post("/change-password", async (req, res, next) => {
  try {
    userId = req.session.user._id;

    let userPassword = await userHelpers.updateUserPassword(userId, req.body);

    res.redirect("/profile");
  } catch (error) {}
});

router.get("/item-cancelled/:id", async (req, res) => {
  try {
    orderId = req.params.id;

    let changeStatusCancelled = await userHelpers.changeStatusCancelled(
      orderId
    );
    res.redirect("/order-success");
  } catch (error) {
    next(error);
  }
});

router.post("/apply-coupon", (req, res, next) => {
  try {
    couponHelpers.getAllCoupon(req.body).then((response) => {
      if (response.coupon) {
        req.session.coupon = response;
      }
      res.json(response);
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
