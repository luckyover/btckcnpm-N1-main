
const url = 'http://14.225.253.57:9019';
//const url = 'http://127.0.0.1:8000';

$(document).ready(function () {
    try {
        initializeSideBar();
        var modal = $('.modal');
        var btn = $('.bs-modal');
        var span = $('.close');
        btn.click(function () {
          gethis();
          modal.show();
        });

        span.click(function () {
          modal.hide();
        });

        $(window).on('click', function (e) {
          if ($(e.target).is('.modal')) {
            modal.hide();
          }
        });

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
            <h2>Giỏ hàng</h2>
            <div class="cart-content">

            </div>
            <div class="cart-footer">
                <h3>Tổng tiền: <span class="cart-total">0</span></h3>
                <button class="clear-cart banner-btn">Mua hàng</button>
            </div>
    </div>
    <div id="toast"></div>

    <div class="modal">
        <div class="modal-content">
          <h3>Lịch sử mua hàng</h3>
          <div class="hs-content">
          <table class="table">
          <thead>
            <tr>
              <th scope="col">#Mã đơn hàng</th>
              <th scope="col">Ngày mua</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Trạng thái đơn hàng</th>
            </tr>
          </thead>
          <tbody class="hs-table">

          </tbody>
        </table>
          <div>
        </div>
    </div>
    

    `;
    $('body').append(html);

    let _token = localStorage.getItem("access_token")
    let user_id = localStorage.getItem("email")
    let user_nm = localStorage.getItem("user_nm")
    if(_token && user_id){
        $('#dangnhap').attr('id','').attr('id','logout');
        $('#logout a').text(`ĐĂNG SUẤT(${user_nm})`);
        let href = $('#logout a').attr('href')
        $('#logout a').attr('href','#')
        $('#logout').attr('href',href);

         $('.add-top').prepend(`<li class="bs-modal">LỊCH SỬ</li>`)
    }

    ajaxGetDataCart();
   
}

function initEventsSideBar(){
    //show cart
    $(document).on('click','.cart-shopping',function(){
        $('.transparent').addClass('transparentBcg')
        $('.transparent .cart').addClass('showCart')
        ajaxGetDataCart();
        
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
           removeItemCart(id)
      })
      //up
      $(document).on('click','.transparent .qty_up',function(){
        let id = $(this).attr('data-id');
        let qty = $(this).closest('.cart-item').find('.item-amount').text() ?? 0;
        updateQtyCart(id,Number(qty) + 1);
      })
      $(document).on('click','.transparent .qty_down',function(){
        let id = $(this).attr('data-id');
        let qty = $(this).closest('.cart-item').find('.item-amount').text() ?? 0;
        if(Number(qty) > 1){
            updateQtyCart(id,Number(qty) - 1);
        }
        
      })

      $(document).on('click','.product-main-info-buy',function(){
            let _token = localStorage.getItem("access_token")
            let user_id = localStorage.getItem("email")
            if(_token && user_id){
                setCartItem();
            }else{
               
                let url = $('#dangnhap a').attr('href');
                window.location.href = url;
            }
      })

      $(document).on('click','#logout',function(){
        let _this = this;
        let _token = localStorage.getItem("access_token")
        let user_id = localStorage.getItem("email")
        let token_type = localStorage.getItem("token_type")
        var url_login = '/api/logout';
        $.ajax({
            type: 'POST',
            url: url+url_login,
            dataType: 'json',
            loading: true,
            // data: data,
            success: function (data, status, http_response) {
                let url = $(_this).attr('href');
                window.location.href = url;
                localStorage.removeItem("access_token")
                localStorage.removeItem("email")
                localStorage.removeItem("token_type")
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization',token_type+' '+_token); 
            },
            error: function (http_response, status, error) {
                if(http_response.status == 401){
                    window.location.href = '../dang-nhap.html';
                }
            }
        });

       
     })

     $(document).on('click','.banner-btn',function(){
        let _this = this;
        let _token = localStorage.getItem("access_token")
        let user_id = localStorage.getItem("email")
        let token_type = localStorage.getItem("token_type")
        var url_curent= '/api/order-cart';
        let data = {};
        data.email = user_id;
    
        $.ajax({
            type: 'POST',
            url: url+url_curent,
            dataType: 'json',
            loading: true,
            data: data,
            success: function (data, status, http_response) {
                showSuccessToast('Bạn đã mua hàng thành công')
                    ajaxGetDataCart(data);
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization',token_type+' '+_token); 
              
            },
            error: function (http_response, status, error) {
                if(http_response.status == 401){
                    window.location.href = '../dang-nhap.html';
                }
            }
        });
     })
      
}

function setCartItem(){
    let _this = this;
    let _token = localStorage.getItem("access_token")
    let user_id = localStorage.getItem("email")
    let token_type = localStorage.getItem("token_type")
    var url_curent= '/api/add-cart';

    var price = $('.product-main').find('.amount bdi').text() ?? 0;
    var index = price.trim().lastIndexOf(' ');
  
    let data = {};
    data.img = $('.product-main').find('.product-main-img img').attr('src') ?? '';
    data.title = $('.product-main').find('.product-title').text() ?? '';
    data.price = price.trim().slice(0,index).replaceAll('.', '')
    data.qty = 1;
    data.email = user_id;

    $.ajax({
        type: 'POST',
        url: url+url_curent,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            
                ajaxGetDataCart(data);
                showSuccessToast('Bạn đã thêm giỏ hàng thành công')
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',token_type+' '+_token); 
          
        },
        error: function (http_response, status, error) {
            if(http_response.status == 401){
                window.location.href = '../dang-nhap.html';
            }
        }
    });

}
function saveCart(item){
    let cart = JSON.parse(localStorage.getItem("cart") || '[]');
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    getListItemCart();
}

function ajaxGetDataCart(){
    let _this = this;
    let _token = localStorage.getItem("access_token")
    let user_id = localStorage.getItem("email")
    let token_type = localStorage.getItem("token_type")
    var url_curent= '/api/get-cart';
    let data = {};
    data.email = user_id;
    $.ajax({
        type: 'POST',
        url: url+url_curent,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            getListItemCart(data)
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',token_type+' '+_token); 
          
        },
        error: function (http_response, status, error) {
            if(http_response.status == 401){
                window.location.href = '../dang-nhap.html';
            }
        }
    });
}
function getListItemCart(cart){
    // let cart = JSON.parse(localStorage.getItem("cart") || '[]');
    $('.cart .cart-content').empty();
    let total = 0;
    var index  = 0 
    for (let i = 0; i < cart.length; i++) {
        index++;
        total += Number(cart[i].price) * Number(cart[i].qty);
        let html = `
        <div class="cart-item">
          
            <div>
              <h4>${cart[i].title}</h4>
              <h5><span  class="price">${formatNumber(cart[i].price)}</span></h5>
              <span class="remove-item" data-id="${cart[i].cart_id}">Xóa</span>
            </div>
            <div>
              <i class="fas fa-chevron-up qty_up" data-id="${cart[i].cart_id}"></i>
              <p class="item-amount">${cart[i].qty}</p>
              <i class="fas fa-chevron-down qty_down" data-id="${cart[i].cart_id}"></i>
            </div>
        </div>
        `;
        $('.cart .cart-content').append(html);
    }
   
    $('.cart .cart-total').text(formatNumber(total)+ '₫')
    let html = `
         <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
         Giỏ hàng (${index})
    `
    $('.cart-shopping').html(html);
}




function removeItemCart(id){
    let _this = this;
    let _token = localStorage.getItem("access_token")
    let user_id = localStorage.getItem("email")
    let token_type = localStorage.getItem("token_type")
    var url_curent= '/api/remove-cart';
    let data = {};
    data.email = user_id;
    data.id = id;
    $.ajax({
        type: 'POST',
        url: url+url_curent,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            getListItemCart(data)
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',token_type+' '+_token); 
          
        },
        error: function (http_response, status, error) {
            if(http_response.status == 401){
                window.location.href = '../dang-nhap.html';
            }
        }
    });
}


function updateQtyCart(id,qty){
    let _this = this;
    let _token = localStorage.getItem("access_token")
    let user_id = localStorage.getItem("email")
    let token_type = localStorage.getItem("token_type")
    var url_curent= '/api/update-cart';
    let data = {};
    data.email = user_id;
    data.id = id;
    data.qty = qty;
    $.ajax({
        type: 'POST',
        url: url+url_curent,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            getListItemCart(data)
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',token_type+' '+_token); 
          
        },
        error: function (http_response, status, error) {
            if(http_response.status == 401){
                window.location.href = '../dang-nhap.html';
            }
        }
    });
}

function gethis(){
    let _this = this;
    let _token = localStorage.getItem("access_token")
    let user_id = localStorage.getItem("email")
    let token_type = localStorage.getItem("token_type")
    var url_curent= '/api/his-cart';
    let data = {};
    data.email = user_id;
  
    $.ajax({
        type: 'POST',
        url: url+url_curent,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            $('.hs-table').empty();

            for (let i = 0; i < data.length; i++) {
                let status = 'Đang chuẩn bị';
                if(data[i].order_status == 0){
                    status = 'Đang chuẩn bị';
                }else if (data[i].order_status == 1){
                    status = 'Đang giao';
                }else{
                    status = 'Giao thành Công';
                }
                let html = `
                <tr>
                    <th scope="row">${data[i].order_no}</th>
                    <td>${formatDate(data[i].cre_date)}</td>
                    <td>${formatNumber(data[i].total)}</td>
                    <td>${status}</td>
                </tr>
          `
          $('.hs-table').append(html);
            }
        
            
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',token_type+' '+_token); 
          
        },
        error: function (http_response, status, error) {
            if(http_response.status == 401){
                window.location.href = '../dang-nhap.html';
            }
        }
    });
}

function formatNumber(number) {
    const parts = number.toString().split('').reverse();
    let formattedNumber = '';

    for (let i = 0; i < parts.length; i++) {
        if (i !== 0 && i % 3 === 0) {
            formattedNumber = '.' + formattedNumber;
        }
        formattedNumber = parts[i] + formattedNumber;
    }

    return formattedNumber;
}

// Toast function
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast");
  console.log(main);
  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
         main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fas fa-check-circle",
      info: "fas fa-info-circle",
      warning: "fas fa-exclamation-circle",
      error: "fas fa-exclamation-circle"
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
    console.log(toast);
    toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
               
    main.appendChild(toast);
  }
}

function showSuccessToast(mess) {
    toast({
      title: "Thành công!",
      message: mess,
      type: "success",
      duration: 5000
    });
}
function formatDate(inputDate) {
    // Convert inputDate string to a Date object
    var date = new Date(inputDate);

    // Format the date and time
    var formattedDate = date.getFullYear() + '-' +
                        String(date.getMonth() + 1).padStart(2, '0') + '-' +
                        String(date.getDate()).padStart(2, '0') + ' ' +
                        String(date.getHours()).padStart(2, '0') + ':' +
                        String(date.getMinutes()).padStart(2, '0');

    return formattedDate;
}