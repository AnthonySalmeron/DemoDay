module.exports= function(app,passport,db,multer,ObjectId, path, multerAzure,CognitiveServicesCredentials,TextAnalyticsAPIClient,moment,azuConf, Fuse){
  app.get('/',(req,res)=>{
    if('user' in req){
      let sortedKeys = Object.entries(req.user.visitationLog).sort((a,b)=>b[1]-a[1])//sort from greatest to smallest value
      db.collection('peer-reviewed').find({keywords:{$in:[sortedKeys[0][0],sortedKeys[1][0],sortedKeys[2][0]]}}).sort({popularity:-1}).limit(7).toArray(function(err,result){
        if (err) console.log(err)
        res.render('index.ejs',{
          articles: result,
          user:req.user
        })
      })
    }else{
      db.collection('peer-reviewed').find().sort({popularity:-1}).limit(7).toArray(function(err,result){
        if (err) console.log(err)
        res.render('index.ejs',{
          articles: result
        })
      })
    }
  })
  app.get("/search",(req,res)=>{
    if('id' in req.query){
      let arId = ObjectId(req.query.id)
      db.collection('peer-reviewed').find({_id:arId}).toArray(function(err,result){
        if (err) console.log(err)
        res.render('generic.ejs',{
          text:result,
          user: req.user
        })
      })
      db.collection('peer-reviewed').findOneAndUpdate({_id:arId}, {
          $inc: {
            popularity: 1
          }
        }, (err, result) => {
          if (err) return console.log(err)
          console.log('updated popularity of search item')
        }
      )
    }else if('category' in req.query){
      db.collection('peer-reviewed').find({keywords:req.query.category}).sort({popularity:-1}).limit(11).toArray(function(err,result){
        if (err) console.log(err)
        res.render('generic.ejs',{
          text:result,
          user: req.user
        })
      })
    }else{
      db.collection('peer-reviewed').find().toArray(function(err,resu){
        if (err) console.log(err)
        console.log(resu)
        var options = {
          shouldSort: true,//sorted by match
          includeScore: true,//score for threshold
          threshold: 0.6,//amount of leeway to match by, closer to 0 is exact matches
          location: 0,//specifies a spot in the string you can start search from
          distance: 100,//specifies how many characters in total they can be wrong by
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            "title",
            "keywords",
            "author",
            'dateUploaded'
          ]
        };
        var fuse = new Fuse(resu, options); // "resu" is the item array
        var result = fuse.search(req.query.search);
        result = result.map(el=> el.item);
        res.render('generic.ejs',{
          text:result,
          user: req.user
        })
      })
    }
  })
  app.put('/Interests', (req,res)=>{
    var uId = ObjectId(req.session.passport.user)
    db.collection('users').findOneAndUpdate({"_id": uId},{$push:{interests: req.body.interest}}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Interest Added!')
    })
  })
  app.put('/visits',(req,res)=>{
    var uId = ObjectId(req.session.passport.user)
    db.collection('users').findOneAndUpdate({"_id": uId},{
      $inc:{
        "visitationLog.AI": req.body.AI,
        "visitationLog.Biology": req.body.Biology,
        "visitationLog.Chemistry": req.body.Chemistry,
        "visitationLog.Physics": req.body.Physics,
        "visitationLog.Robotics": req.body.Robotics,
        "visitationLog.Astronomy": req.body.Astronomy,
        "visitationLog.Nature": req.body.Nature,
        "visitationLog.Archaeology": req.body.Archaeology,
        "visitationLog.History": req.body.History,
        "visitationLog.Health": req.body.Health
      }
    }, (err, result) => {
      if (err) return res.send(500, err)
      console.log('updated log');
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
  //LOCAL STORAGE OPTION
  // var storage = multer.diskStorage({
  //     destination: (req, file, cb) => {
  //       cb(null, 'public/uploads')
  //     },
  //     filename: (req, file, cb) => {
  //       var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
  //       cb(null, fileName + '-' + Date.now() + path.extname(file.originalname))
  //     }
  // });
  // AMAZON STORAGE OPTION //(bugged)
  // var upload = multer({
  //   storage: multerS3({
  //   s3: s3,
  //   bucket: 'science-docs-articles',
  //   key: function (req, file, cb) {
  //     console.log('key is working',file)
  //     var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
  //     cb(null, fileName + '-' + Date.now() + path.extname(file.originalname))
  //   }
  // })
  // });
  var upload = multer({
  storage: multerAzure({
    connectionString: azuConf.connectionString, //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
    account: azuConf.account, //The name of the Azure storage account
    key: azuConf.key, //A key listed under Access keys in the storage account pane
    container: azuConf.container,  //Any container name, it will be created if it doesn't exist
    blobPathResolver: function(req, file, cb){
      var fileName = file.originalname.match(/[\w+]+\./g).join("").slice(0,-1)//grabs just the filename and not the extension
          cb(null, fileName + '-' + Math.round(Date.now()*Math.random()) + path.extname(file.originalname))
    }
  })
})
  app.post('/upload', upload.array('article',2), (req, res, next) => {
     console.log(req.files)
     console.log(req.body.hello)
      insertDocuments(db, req, () => {
          res.redirect('/profile')
      });
  });
  var insertDocuments = function(db, req,callback) {
      var collection = db.collection('users');
      var collectionTwo = db.collection('proposals');
      var uId = ObjectId(req.session.passport.user)
      var newDoc;
       collectionTwo.insertOne({
         fileNamePic : req.files[1].originalname,
         fileNameTxt : req.files[0].originalname,
         picLocation : req.files[1].url,
         txtLocation : req.files[0].url,
         picBlob     : req.files[1].blobPath,
         txtBlob     : req.files[0].blobPath,
         title       : req.body.description,
         keywords    : req.body.keys,
         popularity  : 1,
         author      : req.body.author,
         uploader    : uId,
         dateUploaded: moment().format('YYYY MM DD'),
         mlKeywords  : req.body.mls
      },(err,result)=>{
        if (err) console.log(err)
      //  console.log(result.insertedId)
      //  console.log(uId)
        newDoc = result.insertedId //trying to get id of returned object
        collection.findOneAndUpdate({"_id": uId}, {
          $push: {
            uploads: [req.files[1].url,req.files[0].url,req.body.description, newDoc]
          }
        }, {
          sort: {_id: -1},
          upsert: false
        }, (err, result) => {
          if (err) return res.send(err)
          callback(result)
        })
      })
    }
    //HERE WE ARE CHECKING TO SEE IF A PROPOSAL SHOULD BE SENT THROUGH
    const subscription_key =  azuConf.subscription_key;
    const endpoint = azuConf.endpoint;
    const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
    const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);
    app.post('/review',function(req,res){
      res.render('profile.ejs', {
        user : req.user //render the page because we don't need to wait for this to finish
      })
      let favorability, keyphrases;
      async function sentimentAnalysis(client){
        const input = {
          documents: [
              { language: "en", id: "1", text: req.body.review}
            ]
          };
        const sentimentResult = await client.sentiment({
          multiLanguageBatchInput: input
        });
        const keyPhraseResult = await client.keyPhrases({
          multiLanguageBatchInput: input
        });
        keyPhrases = keyPhraseResult.documents[0].keyPhrases;
        favorability = sentimentResult.documents[0].score;
        // console.log(keyPhraseResult.documents);
        // console.log(sentimentResult.documents);
        console.log(req.body.location)
        console.log(favorability);

        db.collection('proposals').findOneAndDelete({txtLocation:req.body.location},(err,result)=>{
          if (err) console.log(err)
          console.log(result.value)
          if(favorability<=0.6){
            const {
              Aborter,
              BlobURL,
              BlockBlobURL,
              ContainerURL,
              ServiceURL,
              StorageURL,
              SharedKeyCredential,//this is the authentication we're using
              AnonymousCredential,//optional
              TokenCredential//optional
            } = require("@azure/storage-blob");//remember to download version 10, 12 as of this writing doesn't support deleting blobs and the methods here are deprecated
            async function main(blobName){
              const account = azuConf.account
              const accountKey = azuConf.key
              const credentials = new SharedKeyCredential(account, accountKey);
              const pipeline = StorageURL.newPipeline(credentials);
              const serviceURL = new ServiceURL(`https://${account}.blob.core.windows.net`, pipeline);
              // const blobName1 = result.value.txtBlob;
              // const blobname2 = result.value.picBlob;
              const containerName = azuConf.container;
              const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
              const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
              // const blockBlobURL2 = BlockBlobURL.fromContainerURL(containerURL, blobName2);
              const aborter = Aborter.timeout(60000)//requests are given a minute to execute
              await blockBlobURL.delete(aborter)
              // await blockBlobURL2.delete(aborter)
              console.log(`Block blob "${blobName}" is deleted`);
            }
            main(result.value.txtBlob)
            .then(() => {
              console.log("Successfully executed sample.");
            })
            .catch(err => {
              console.log(err.message);
            });
            main(result.value.picBlob)
            .then(() => {
              console.log("Successfully executed sample.");
            })
            .catch(err => {
              console.log(err.message);
            });
            //Can use axios but prefere to use npm packages instead for above task
            // let axiosConfig = {
            //   headers : {
            //     Authorization :,//add Authorization scheme here
            //     'x-ms-date':Date.now(),
            //     'x-ms-version': 2019-02-02
            //   }
            //   axios.all([
            //     axios.delete(result.value.txtLocation,axiosConfig)
            //     axios.delete(result.value.picLocation,axiosConfig)
            //   ])
            //   .then(axios.spread((res1,res2)=>{
            //
            //   }))
            //   .catch(err=>{
            //     console.log(err)
            //   })
          }else if(favorability>0.6){
              db.collection('peer-reviewed').insertOne(result.value,(err,res)=>{
                if (err) console.log(err);
                console.log(res);
                db.collection('peer-reviewed').findOneAndUpdate({_id:res.insertedId},{
                  $push: {mlKeywords:{ $each: keyPhrases }}
                },(err,resu)=>{
                  if (err) console.log(err)
                  console.log('all done')
                })//adding to the array which holds machine learning keywords
              })//adding the deleted document to the peer-reviewed group
            }//else statement that runs if favorability is >.6
        })//overall operation that first deletes the document for the article that was reviewed
      }//end of sentimentAnalysis()
      //call the above function
      sentimentAnalysis(textAnalyticsClient)
    })//end of app.post for review

  //END FILE UPLOAD=============================================================================================================
  //LOGIN=====================================================================================================================
  app.get('/profile', isLoggedIn, async function(req, res) {
    let list;
    await db.collection('proposals').find({uploader:req.user._id}).toArray((err,res)=>{
      if (err) console.log(err)
      list = res;
    })
    db.collection('proposals').find({keywords:{$in:req.user.interests}, uploader:{ $ne: req.user._id }}).limit(5).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user : req.user,
        remaining: result,
        list: list
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
