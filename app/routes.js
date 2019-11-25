module.exports= function(app,passport,db,ObjectId){
  app.get('/',(req,res)=>{
    res.render('index.ejs')
  })
  app.get("/generic.ejs",(req,res)=>{
    res.render('generic.ejs')
  })
  app.put('/Interests', (req,res)=>{
    var uId = ObjectId(req.session.passport.user)
    db.collection('users').findOneAndUpdate({"_id": uId},{$push:{interests: req.body.interest}}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Interest Added!')
    })
  })
  app.delete('/Interests', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('users').findOneAndUpdate({"_id": uId},{$pull:{interests: req.body.interest}}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Interest Deleted!')
    })
  })
  //LOGIN=====================================================================================================================
  app.get('/profile', isLoggedIn, function(req, res) {
      db.collection('uploads').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('profile.ejs', {
          user : req.user,
          remaining: result
        })
      })
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });
  //LOGGING IN ===========================
  app.get('/login', function(req, res) {
              res.render('login.ejs', { message: req.flash('loginMessage') });
          });

  // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))
    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    })
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    //function to check if logged in
    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();

      res.redirect('/');
  }
}
