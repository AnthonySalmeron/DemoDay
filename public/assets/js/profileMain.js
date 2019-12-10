const mobileNet = ml5.imageClassifier('MobileNet',()=> document.querySelector(".loader").style.display="none")
document.getElementById('deleteInterests').onchange = function(){
  var toDelete = document.getElementById("deleteInterests").value
  fetch('Interests', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'interest': toDelete
    })
  }).then(function (response) {
    window.location.reload()
  })
}
document.getElementById("addInterests").onchange =function(){
  var toAdd = document.getElementById("addInterests").value
  console.log(toAdd)
  fetch('Interests', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'interest': toAdd
    })
  }).then(function (response) {
    window.location.reload()
  })
}
document.getElementById("imageToUpload").onchange = function(){
  var selectedFile = event.target.files[0];
  var reader = new FileReader();

  var imgtag = document.getElementById("uploadedImage");//the place in the dom where it displays the uploaded image
  imgtag.title = selectedFile.name;//when mouse moves over image, gives the originalname of the image

  reader.onload = function(event) {
    imgtag.src = event.target.result;//event.target references the reader, so the result property of the reader which is the data of the image
    const result = document.getElementById('result'); // The result tag in the HTML
    const probability = document.getElementById('probability'); // The probability tag in the HTML
    mobileNet.classify(imgtag,gotResults)
    function gotResults(err,results){
      if (err) return console.log(err)
      console.log(results)
      result.innerText = results[0].label;
      probability.innerText = results[0].confidence.toFixed(4);
      document.querySelectorAll(".mL")[0].removeAttribute('disabled')
      document.querySelectorAll(".mL")[1].removeAttribute('disabled')
      document.querySelectorAll(".mL")[2].removeAttribute('disabled')
      document.querySelectorAll(".mL")[0].value= results[0].label
      document.querySelectorAll(".mL")[1].value= results[1].label
      document.querySelectorAll(".mL")[2].value= results[2].label
      document.getElementById("lb1").innerHTML = results[0].label
      document.getElementById("lb2").innerHTML = results[1].label
      document.getElementById("lb3").innerHTML = results[2].label
    }
  };
  reader.readAsDataURL(selectedFile);
};


// EXAMPLE CODE FOR FETCHING DATA FROM BLOBS, ONLY NECESSARY FOR AJAX
//   fetch('https://sciencedoc.blob.core.windows.net/science/test-1424978755516.1873.txt')
//   // Retrieve its body as ReadableStream
//   .then(res=> res.body.getReader())
//   .then(res=>res.read())
//   .then(function processText({ done, value }) {
//     let chunk = value
//     //data comes in as Uint8Array so this decoder makes it english
//     let utf8Decoder= new TextDecoder('utf-8')
//
//     // Result objects contain two properties:
//     // done  - true if the stream has already given you all its data.
//     // the reader can be called recursively if it continues to stream data
//     // value - some data. Always undefined when done is true.
//     // if (done) {
//     //   console.log("Stream complete");
//       document.getElementById('whereTextGoes').textContent = utf8Decoder.decode(chunk);
//       return;
//     // }
// })
//CODE BELOW IS MAINLY FOR IMAGES BUT CAN BE USED FOR OTHER FILE FORMATS THAT NEED A URL TOO
  // .then(res=> console.log(res.read()))
  // .then(response => response.body)
  // .then(rs => {
  //   const reader = rs.getReader();
  //   return new ReadableStream({
  //     async start(controller) {
  //       while (true) {
  //         const { done, value } = await reader.read();
  //         // When no more data needs to be consumed, break the reading
  //         if (done) {
  //           break;
  //         }
  //         // Enqueue the next data chunk into our target stream
  //         controller.enqueue(value);
  //       }
  //       // Close the stream
  //       controller.close();
  //       reader.releaseLock();
  //     }
  //   })
  // })
  // // Create a new response out of the stream
  // .then(rs => new Response(rs))
  // // Create an object URL for the response
  // .then(response => response.blob())
  // .then(blob => URL.createObjectURL(blob))
  // // Update image
  // .then(url => document.getElementById('whereImgGoes').src = url)
  // .catch(err=>{console.log(err)});
