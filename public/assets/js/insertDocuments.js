module.exports = function(db, req, fileTxt,fileImg ,callback) {
    var collection = db.collection('users');
    var collectionTwo = db.collection('proposals');
    var uId = ObjectId(req.session.passport.user)
    var newDoc;
     collectionTwo.insertOne({
      fileNamePic : req.files[0].originalname,
      fileNameTxt : req.files[1].originalname,
      picLocation : fileImg,
      txtLocation : fileTxt,
      title       : req.body.description,
      keywords    : req.body.keys,
      popularity  : 1,
      author      : req.body.author,
      uploader    : uId
    },(err,result)=>{
      if (err) console.log(err)
    //  console.log(result.insertedId)
    //  console.log(uId)
      newDoc = result.insertedId //trying to get id of returned object
      collection.findOneAndUpdate({"_id": uId}, {
        $push: {
          uploads: [fileImg,fileTxt,req.body.description, newDoc]
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
