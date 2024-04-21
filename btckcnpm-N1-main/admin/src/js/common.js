
// const url = 'http://14.225.253.57:9019';
const url = 'http://127.0.0.1:8000';
$(document).ready(function () {
    try {
        initializeC();
        initEventsC();
    } catch (e) {
        alert('ready' + e.message);
    }
});

function initializeC(){
    let _token = localStorage.getItem("admin_access_token")
    let user_id = localStorage.getItem("admin_email")
    let user_nm = localStorage.getItem("admin_user_nm")
    if(_token && user_id){
        ajaxGetOrder();
    }else{
        let url = $('#admin-logout').attr('href');
        window.location.href = url;
    }
}
function initEventsC(){
    $(document).on('click','#save-admin',function(){
        var list_order = []
        var list_account = []
        $('.t_body_order tr').each(function() {
            var order_no = $(this).attr('data-id');
            var order_status = $(this).find('.order_manager_active').val();
            list_order.push({'order_no':order_no,'order_status':order_status})
        });
        $('.t_body_account tr').each(function() {
            var email = $(this).attr('data-id');
            var account_active = $(this).find('.account_active').val();
            list_account.push({'email':email,'del_flg':account_active})
        });

        var data = {};
        data.list_order = list_order
        data.list_account = list_account

        save(data);
        
    })
    $(document).on('click','.order-detail',function(){
        let order_id = $(this).closest('tr').attr('data-id');

        let _this = this;
        let _token = localStorage.getItem("admin_access_token")
        let user_id = localStorage.getItem("admin_email")
        let token_type = localStorage.getItem("admin_token_type")
        let user_nm = localStorage.getItem("admin_user_nm")
        var url_curent = '/api/get-oder-detail-admin';
        let data = {};
        data.order_id = order_id
        $.ajax({
            type: 'POST',
            url: url+url_curent,
            dataType: 'json',
            loading: true,
            data: data,
            success: function (data, status, http_response) {
               
      
                for (let i = 0; i < data.length; i++) {
                    var price = formatNumber(data[i].price);
                    let html = `
                    <tr data-id="${data[i].order_no}">
                        <td>${data[i].title} </td>
                        <td>${data[i].qty}₫</td>
                        <td>${price}</td>
                       
                   </tr>
                 
                    `
                    $('.t_body_order_detail').append(html)
                }
                $('#exampleModal').modal('show');
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
    $(document).on('click','#admin-logout',function(){
        let _this = this;
        let _token = localStorage.getItem("admin_access_token")
        let user_id = localStorage.getItem("admin_email")
        let token_type = localStorage.getItem("admin_token_type")
        let user_nm = localStorage.getItem("admin_user_nm")
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
                localStorage.removeItem("admin_access_token")
                localStorage.removeItem("admin_email")
                localStorage.removeItem("admin_token_type")
                localStorage.removeItem("admin_user_nm")
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

function ajaxGetOrder (){
    let _this = this;
        let _token = localStorage.getItem("admin_access_token")
        let user_id = localStorage.getItem("admin_email")
        let token_type = localStorage.getItem("admin_token_type")
        let user_nm = localStorage.getItem("admin_user_nm")
        var url_login = '/api/get-admin';
        $.ajax({
            type: 'POST',
            url: url+url_login,
            dataType: 'json',
            loading: true,
            // data: data,
            success: function (data, status, http_response) {
               
                for (let i = 0; i < data.order_manager.length; i++) {
                    var total = formatNumber(data.order_manager[i].total);
                    let html = `
                    <tr data-id="${data.order_manager[i].order_no}">
                        <td>${data.order_manager[i].account} </td>
                        <td>${data.order_manager[i].cre_date}</td>
                        <td>${total}</td>
                        <td>
                        <select  class="form-select order_manager_active">
                          <option value="0" ${data.order_manager[i].order_status == 0 ? 'selected' : ''}>Đang chuẩn bị</option>
                          <option value="1" ${data.order_manager[i].order_status == 1 ? 'selected' : ''}>Đang giao</option>
                          <option value="2" ${data.order_manager[i].order_status == 2 ? 'selected' : ''}>Giao thành Công</option>
                          
                        </select>
                        </td>
                        <td>
                          <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button>
                            <div class="dropdown-menu">
                              <a class="dropdown-item order-detail"  href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i>Chi tiết</a>
                              <!-- <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a> -->
                            </div>
                          </div>
                        </td>
                   </tr>
                 
                    `
                    $('.t_body_order').append(html)
                }
                for (let i = 0; i < data.account.length; i++) {
                    let html = `
                    <tr data-id="${data.account[i].email}">
                        <td>${data.account[i].user_nm} </td>
                        <td>${data.account[i].address}</td>
                        <td>${data.account[i].tel}</td>
                        <td>
                        ${data.account[i].email}
                        </td>
                        <td>
                        <select class="form-select account_active">
                        <option value="0" ${data.account[i].del_flg == 0 ? 'selected' : ''}>Đang hoạt động</option>
                        <option value="1" ${data.account[i].del_flg == 1 ? 'selected' : ''}>Xóa</option>

                        
                      </select>
                        </td>
                   </tr>
                 
                    `
                    $('.t_body_account').append(html)
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

function save (data){
        let _token = localStorage.getItem("admin_access_token")
        let token_type = localStorage.getItem("admin_token_type")
        var url_current = '/api/order-update-admin';
        $.ajax({
            type: 'POST',
            url: url+url_current,
            dataType: 'json',
            loading: true,
            data: data,
            success: function (data, status, http_response) {
                location.reload()
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