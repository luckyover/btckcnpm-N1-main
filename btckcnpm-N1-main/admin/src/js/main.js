
 const url = 'http://14.225.253.57:9019';
//const url = 'http://127.0.0.1:8000';
$(document).ready(function () {
    try {
        initialize();
        initEvents();
    } catch (e) {
        alert('ready' + e.message);
    }
});

function initialize(){
   
}
function initEvents(){
    //login
    $(document).on('click','.btn-login',function(){
        login(this);
    })
    //login
    $(document).on('click','.btn-login',function(){
        login(this);
    })
     //login
     $(document).on('click','.btn-register',function(){
        register(this);
    })
}

function login(_this){
    var data = $('.login_admin').serialize();
    var url_login = '/api/login';
    var role = $(_this).attr('role')
    data += '&role='+role;
    // send ajax
    $.ajax({
        type: 'POST',
        url: url+url_login,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            cancelLoad()
            if(role == 0){
                localStorage.setItem("access_token",data.access_token);
                localStorage.setItem("email",data.email);
                localStorage.setItem("token_type",data.token_type);
                localStorage.setItem("user_nm",data.user_nm);
                let url = $(_this).attr('href');
                window.location.href = url;
            }else{
                localStorage.setItem("admin_access_token",data.access_token);
                localStorage.setItem("admin_email",data.email);
                localStorage.setItem("admin_token_type",data.token_type);
                localStorage.setItem("admin_user_nm",data.user_nm);
                let url = $(_this).attr('href');
                window.location.href = url;
            }
           
        },
        beforeSend: function () {
            overLoad();
        },
        error: function (http_response, status, error) {
            checkError(http_response)
            cancelLoad()
        }
    });
}
function cancelLoad(){
    $('#loading').removeClass('loading');
}
function overLoad(){
    $('#loading').addClass('loading');
}

function checkError(http_response){
    clearError();
    let errors = http_response?.responseJSON?.errors
    if(errors && http_response.status == 422){
        for (const key in errors) {
            const mess = errors[key];
            let html = `<label class="lb-error" lb-error="Lỗi">
                <span class="lb-error-content">
                    ${mess}
                </span>
             </label>`
           
            $(`[name=${key}]`).addClass('is-invalid').closest('.input-control').append(html)
        }
    }
    if(http_response.status == 501 && errors){
        let alter = errors['alter'];
        $('.login_admin').prepend(_alter(alter));
    }
    
}

function clearError(){
    $('.is-invalid').removeClass('is-invalid')
    $('.lb-error').remove();
    $('.content-alert').remove();
}
function _alter(alter){
    return `<div class="alert content-alert alert-primary" role="alert">
    <span class="alter-error">Lỗi</span>${alter}
    </div>`
}

function register(_this){
    var data = $('.register-form').serialize();
    var url_login = '/api/register';
    var role = $(_this).attr('role')
    data += '&role='+role;
    // send ajax
    $.ajax({
        type: 'POST',
        url: url+url_login,
        dataType: 'json',
        loading: true,
        data: data,
        success: function (data, status, http_response) {
            cancelLoad()
            let url = $(_this).attr('href');
            window.location.href = url;
           
        },
        beforeSend: function () {
            overLoad();
        },
        error: function (http_response, status, error) {
            checkError(http_response)
            cancelLoad()
        }
    });
}