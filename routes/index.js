const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send("aaa");
});

// Create a user
router.post("/users/createUser", user_controller.sign_up_post);

//POST request for log-in.
router.post("/users/loginUser", user_controller.log_in_post);

//Handle website once user is logged in
router.get("/protected",user_controller.protected);

//Retrieve user movies
router.post("/users/retrieveUserFavourites", user_controller.retrieve_user_favourites)

//Load user
router.post("/users/loadUser", user_controller.load_User)

module.exports = router;
