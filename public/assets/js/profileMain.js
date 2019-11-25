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
