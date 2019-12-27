let scene, camera, renderer,stars,starGeo
function init(){
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000)
  camera.position.z= 1
  camera.rotation.x=Math.PI/2

  renderer=new THREE.WebGLRenderer({antialias:true,canvas:document.getElementById('canvas')})
  renderer.setSize(window.innerWidth,window.innerHeight)

  starGeo = new THREE.Geometry()
  for(let i=0;i<6000;i++){
    let star = new THREE.Vector3(Math.random()*600-300,Math.random()*600-300,Math.random()*600-300)
    star.velocity=0
    star.acceleration=0.02
    starGeo.vertices.push(star)
  };
  let sprite = new THREE.TextureLoader().load('../images/img.png')
  let material = new THREE.PointsMaterial({color:0xaaaaaa,size:0.7,map:sprite})
  stars= new THREE.Points(starGeo,material)
  scene.add(stars)
  window.addEventListener('resize',onWindowResize,false)
  animate()
}
init()
function animate(){
  starGeo.vertices.forEach(i=>{
    i.velocity+=i.acceleration
    i.y-=i.velocity
    if(i.y<-200){//if they fall behind the screen
      i.y=200
      i.velocity=0
    }
  })
  starGeo.verticesNeedUpdate=true
  stars.rotation.y+=0.002
  renderer.render(scene,camera)
  requestAnimationFrame(animate)
}
function onWindowResize(){
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth,window.innerHeight)
}
