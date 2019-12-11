document.querySelector(".loader").style.display="block"
const mobileNet = ml5.imageClassifier('MobileNet',()=> document.querySelector(".loader").style.display="none")
