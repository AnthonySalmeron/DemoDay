module.exports= function(app,passport,db,multer,ObjectId, path){
  app.get('/',(req,res)=>{
    res.render('index.ejs',{
      user:req.user
    })
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
  // var storages = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'public/uploads')
  //   },
  //   filename: (req, file, cb) => {
  //     var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
  //     cb(null, fileName + '-' + Date.now() + path.extname(file.originalname))
  //   }
  // });
  // var uploads = multer({
  //   storage: storages,
  //   limits: {fileSize: 5000000}
  // });
  // app.post('/uploads', uploads.fields([{name:'text',maxCount:1},{name:'replacePic',maxCount:1}]),(req,res)=>{
  //   console.log(req.files)
  //   res.redirect('/profile')
  // })
  //IMG UPLOAD==================================================================================================================
  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/images')
      },
      filename: (req, file, cb) => {
        var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
        cb(null, fileName + '-' + Date.now() + path.extname(file.originalname))
      }
  });
  var upload = multer({
    storage: storage,
    limits: {fileSize: 5000000}
  });
  app.post('/upload', upload.single('replacePic'), (req, res, next) => {

      insertDocuments(db, req, 'images/' + req.file.filename, () => {
          //db.close();
          //res.json({'message': 'File uploaded successfully'});
          res.redirect('/profile')
      });
  });
  var insertDocuments = function(db, req, filePath, callback) {
      var collection = db.collection('users');
      var uId = ObjectId(req.session.passport.user)
      collection.findOneAndUpdate({"_id": uId}, {
        $set: {
          profileImg: filePath
        }
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        callback(result)
      })
      // collection.findOne({"_id": uId}, (err, result) => {
      //     //{'imagePath' : filePath }
      //     //assert.equal(err, null);
      //     callback(result);
      // });
  }

  //END IMG UPLOAD=============================================================================================================
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
