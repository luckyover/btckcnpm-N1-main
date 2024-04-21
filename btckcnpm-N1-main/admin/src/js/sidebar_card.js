$(document).ready(function () {
    try {
        initializeSideBar();
        initEventsSideBar();
    } catch (e) {
        alert('ready' + e.message);
    }
});
function initializeSideBar(){
    var html = `
    <div class="transparent">
        <div class="cart">
            <span class="close-cart"> <i class="fas fa-window-close"></i> </span>
            <h2>your cart</h2>
            <div class="cart-content">

            </div>
            <div class="cart-footer">
                <h3>your total: <span class="cart-total">0</span></h3>
                <button class="clear-cart banner-btn">clear cart</button>
            </div>
    </div>
    `;
    $('body').append(html);
}

function initEventsSideBar(){
    //show cart
    $(document).on('click','.cart-shopping',function(){
      
        $('.transparent').addClass('transparentBcg')
        $('.transparent .cart').addClass('showCart')
        getListItemCart()
    })
    //close cary
    $(document).on('click','.close-cart',function(){
        $('.transparent').removeClass('transparentBcg')
        $('.transparent .cart').removeClass('showCart')
    })

    //out side close
    $(document).mousedown(function(event) {
        try {

             // Get the element that was clicked
            var el = $(event.target);
            var click_area = $(".transparent");
            if (!el.is(click_area) && !click_area.has(el).length) {
                $('.transparent').removeClass('transparentBcg')
                $('.transparent .cart').removeClass('showCart')
            }
        } catch (e) {
            alert('mousedown'+e.message)
        }

      });
      //remove item
      $(document).on('click','.transparent .remove-item',function(){
           let id = $(this).attr('data-id');
           let cart = JSON.parse(localStorage.getItem("cart") || '[]');
           cart.splice(id,1);
           localStorage.setItem("cart", JSON.stringify(cart));
           getListItemCart()
      })
      //up
      $(document).on('click','.transparent .qty_up',function(){
        let id = $(this).attr('data-id');
        let qty = $(this).closest('.cart-item').find('.item-amount').text() ?? 0;
        updateQty(id,Number(qty) + 1);
      })
      $(document).on('click','.transparent .qty_down',function(){
        let id = $(this).attr('data-id');
        let qty = $(this).closest('.cart-item').find('.item-amount').text() ?? 0;
        if(Number(qty) > 0){
            updateQty(id,Number(qty) - 1);
        }
        
      })
      
}



function setCartItem(){
    let data = {};
    // data.img = $('.product-main').find('.product-main-img img').attr('src') ?? '';
    // data.title = $('.product-main').find('.product-title').text() ?? '';
    // data.price = $('.product-main').find('.amount bdi').text() ?? '';
    data.img = 'rtrt'
    data.title = 'okk'
    data.price = '1212'
    data.qty = 1;

    saveCart(data);
}
function saveCart(item){
    let cart = JSON.parse(localStorage.getItem("cart") || '[]');
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    getListItemCart();
}

function getListItemCart(){
    let cart = JSON.parse(localStorage.getItem("cart") || '[]');
    $('.cart .cart-content').empty();
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += Number(cart[i].price) * Number(cart[i].qty);
        let html = `
        <div class="cart-item">
            <img src="#" alt="">
            <div>
              <h4>${cart[i].title}</h4>
              <h5><span  class="price">${cart[i].price}</span></h5>
              <span class="remove-item" data-id="${i}">remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up qty_up" data-id="${i}"></i>
              <p class="item-amount">${cart[i].qty}</p>
              <i class="fas fa-chevron-down qty_down" data-id="${i}"></i>
            </div>
        </div>
        `;
        $('.cart .cart-content').append(html);
    }
    $('.cart .cart-total').text(total.toLocaleString('en-US'))
}


function updateQty(id,qty){
    let cart = JSON.parse(localStorage.getItem("cart") || '[]');
    cart[id]['qty'] = Number(qty);
    localStorage.setItem("cart", JSON.stringify(cart));
    getListItemCart();
}