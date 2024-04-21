const taotaikhoan = document.querySelector('#taotaikhoan')
console.log(taotaikhoan)
taotaikhoan.addEventListener("click", function(){
    document.querySelector('.taotaikhoan') .style.display = "flex"
})
const taotaikhoanclose = document.querySelector('#taotaikhoan-close')

taotaikhoanclose.addEventListener("click", function(){
    document.querySelector('.taotaikhoan') .style.display = "none"
})
/*--------------------------------------------------------------*/
const dangnhap = document.querySelector('#dangnhap')
console.log(dangnhap)
dangnhap.addEventListener("click", function(){
    document.querySelector('.dangnhap') .style.display = "flex"
})
const dangnhapclose = document.querySelector('#dangnhap-close')

dangnhapclose.addEventListener("click", function(){
    document.querySelector('.dangnhap') .style.display = "none"
})
// slider------------------------------------------------------
const rightbtn = document.querySelector('.fa-chevron-right')
const leftbtn = document.querySelector('.fa-chevron-left')
const imgNuber = document.querySelectorAll('.slider-content-left-top img')
console.log(imgNuber.length)
let index= 0
rightbtn.addEventListener("click",function(){
    index = index+1
    if(index>imgNuber.length-1){
        index=0
    }
    document.querySelector(".slider-content-left-top").style.right = index *100+"%"
})
leftbtn.addEventListener("click",function(){
    index = index-1
    if(index<=0){
        index=imgNuber.length-1
    }
    document.querySelector(".slider-content-left-top").style.right = index *100+ "%"
})
//slider 1------------------------------------------------------------------
const imgNuberLi = document.querySelectorAll('.slider-content-left-bottom li')
imgNuberLi.forEach(function(image,index){
    image.addEventListener("click",function(){
        removeactive()
        document.querySelector(".slider-content-left-top").style.right = index *100+ "%"
        image.classList.add("active")
    })
})
function removeactive(){
    let imgactive = document.querySelector('.active')
    imgactive.classList.remove("active")
}
//slider2------------------------------------------------------------
function imgAuto(){
    index= index + 1
    if(index>imgNuber.length-1){
        index=0
    }
    removeactive()
    document.querySelector(".slider-content-left-top").style.right = index *100+ "%"
    imgNuberLi[index].classList.add("active")  
    // console.log(index)
}
setInterval(imgAuto,5000)
//-----Slider-product-------------------
const rightbtntwo = document.querySelector('.fa-chevron-right-two')
const leftbtntwo = document.querySelector('.fa-chevron-left-two')
const imgNubertwo = document.querySelectorAll('.slider-product-one-content-items')
// console.log(rightbtntwo)
// console.log(leftbtntwo)
rightbtntwo.addEventListener("click",function(){
    index = index+1
    if(index>imgNubertwo.length-1){
        index=0
    }
    document.querySelector(".slider-product-one-content-items-content").style.right = index *100+"%"
})
leftbtntwo.addEventListener("click",function(){
    index = index-1
    if(index<=0){
        index=imgNubertwo.length-1
    }
    document.querySelector(".slider-product-one-content-items-content").style.right = index *100+ "%"
})
//--------slider-product2---------
const rightbthree = document.querySelector('.fa-chevron-right-two')
const leftbtnthree = document.querySelector('.fa-chevron-left-two')
const imgNuberthree = document.querySelectorAll('.product-gallery-two-content-left-bottom')
rightbtnthree.addEventListener("click",function(){
    index = index+1
    if(index>imgNuberthree.length-1){
        index=0
    }
    document.querySelector(".product-gallery-two-content-left-bottom-item").style.right = index *100+"%"
})
leftbtnthree.addEventListener("click",function(){
    index = index-1
    if(index<=0){
        index=imgNuberthree.length-1
    }
    document.querySelector(".product-gallery-two-content-left-bottom-item").style.right = index *100+ "%"
})
