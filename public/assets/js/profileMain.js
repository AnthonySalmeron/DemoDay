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

  // fetch('test.txt')
  // .then(res=>res.text())
  // .then(res=>{
  //   document.getElementById('whereTextGoes').innerHTML = res;
  // })
