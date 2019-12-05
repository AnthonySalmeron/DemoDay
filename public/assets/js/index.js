let texts = document.querySelectorAll('.getText')
Array.from(texts).forEach(el=>{
    fetch(`${el.textContent}`)
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
        el.textContent = utf8Decoder.decode(chunk);
        // return;
      // }
  })
})
