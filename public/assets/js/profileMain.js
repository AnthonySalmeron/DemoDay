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
function loader(){
  console.log(document.getElementById("thisone").textContent)
}
// EXAMPLE CODE FOR FETCHING DATA FROM BLOBS, ONLY NECESSARY FOR AJAX
  fetch('https://sciencedoc.blob.core.windows.net/science/test-1424978755516.1873.txt')
  // Retrieve its body as ReadableStream
  .then(res=> res.body.getReader())
  .then(res=>res.read())
  .then(function processText({ done, value }) {
    let chunk = value
    //data comes in as Uint8Array so this decoder makes it english
    let utf8Decoder= new TextDecoder('utf-8')

    // Result objects contain two properties:
    // done  - true if the stream has already given you all its data.
    // the reader can be called recursively if it continues to stream data
    // value - some data. Always undefined when done is true.
    // if (done) {
    //   console.log("Stream complete");
      document.getElementById('whereTextGoes').textContent = utf8Decoder.decode(chunk);
      return;
    // }
})
//STUFF BELOW IS MAINLY FOR IMAGES BUT CAN BE USED FOR OTHER FILE FORMATS THAT NEED A URL TOO
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
