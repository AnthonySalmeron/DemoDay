module.exports= function(app,passport,db,multer,ObjectId, path, s3, multerS3){
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

  //FILE UPLOAD==================================================================================================================
  // var storage = multer.diskStorage({
  //     destination: (req, file, cb) => {
  //       cb(null, 'public/uploads')
  //     },
  //     filename: (req, file, cb) => {
  //       var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
  //       cb(null, fileName + '-' + Date.now() + path.extname(file.originalname))
  //     }
  // });
  var upload = multer({
    storage: multerS3({
    s3: s3,
    bucket: 'science-docs-articles',
    key: function (req, file, cb) {
      console.log('key is working',file,s3)
      var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
      cb(null, fileName + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  });
  app.post('/upload', upload.array('article',2), (req, res, next) => {
    //  console.log(req.files, req.body.description, req.body.keys, req.user.local.firstname)
    console.log(req.files)
    res.redirect('/profile')
      // require('../js/insertDocuments.js')(db, req, 'uploads/' + req.files[0].filename,'uploads/' + req.files[1].filename, () => {
      //     //db.close();
      //     //res.json({'message': 'File uploaded successfully'});
      //     res.redirect('/profile')
      // });
  });
  // var insertDocuments = function(db, req, fileTxt,fileImg ,callback) {
  //     var collection = db.collection('users');
  //     var collectionTwo = db.collection('proposals');
  //     var uId = ObjectId(req.session.passport.user)
  //     var newDoc;
  //      collectionTwo.insertOne({
  //       fileNamePic : req.files[0].originalname,
  //       fileNameTxt : req.files[1].originalname,
  //       picLocation : fileImg,
  //       txtLocation : fileTxt,
  //       title       : req.body.description,
  //       keywords    : req.body.keys,
  //       popularity  : 1,
  //       author      : req.body.author,
  //       uploader    : uId
  //     },(err,result)=>{
  //       if (err) console.log(err)
  //     //  console.log(result.insertedId)
  //     //  console.log(uId)
  //       newDoc = result.insertedId //trying to get id of returned object
  //       collection.findOneAndUpdate({"_id": uId}, {
  //         $push: {
  //           uploads: [fileImg,fileTxt,req.body.description, newDoc]
  //         }
  //       }, {
  //         sort: {_id: -1},
  //         upsert: false
  //       }, (err, result) => {
  //         if (err) return res.send(err)
  //         callback(result)
  //       })
  //     })
  //
  // }

  //END FILE UPLOAD=============================================================================================================
  //LOGIN=====================================================================================================================
  app.get('/profile', isLoggedIn, function(req, res) {
      db.collection('proposals').find().limit(5).toArray((err, result) => {
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
