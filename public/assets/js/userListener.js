
var arr = Array.from(document.querySelectorAll('.keez'))
var arrayOfKeys = []
arr.forEach(el=>{
  arrayOfKeys.push(el.textContent)
})
setInterval(function(){
    if(arrayOfKeys.length>0){
      fetch("visits",{
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'AI': arrayOfKeys.includes("AI") ? 5:0,
          'Biology': arrayOfKeys.includes("Biology") ? 5:0,
          'Chemistry': arrayOfKeys.includes("Chemistry") ? 5:0,
          'Physics': arrayOfKeys.includes("Physics") ? 5:0,
          'Robotics': arrayOfKeys.includes("Robotics") ? 5:0,
          'Astronomy': arrayOfKeys.includes("Astronomy") ? 5:0,
          'Nature': arrayOfKeys.includes("Nature") ? 5:0,
          'Archaeology': arrayOfKeys.includes("Archaeology") ? 5:0,
          'History': arrayOfKeys.includes("History") ? 5:0,
          'Health': arrayOfKeys.includes("Health") ? 5:0
        })
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },5000)
