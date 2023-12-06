
function Validator(options){

    // lấy form element từ document
    var formElement = document.querySelector(options.form);

    if(formElement){

        // duyệt qua từng phần tử trong rules
        options.rules.forEach(function(rule){

            // lấy input element vừa được thao tác
            var inputElement = formElement.querySelector(rule.selector);

            if(inputElement){

                //thực hiện phương thức onblur -> khi bỏ focus ra khỏi input element
                inputElement.onblur = function(){

                    //lấy element thông báo lỗi trong cùng element với input element
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

                    //lấy error message từ hàm test của rule tương ứng
                    var errorMessage = rule.test(inputElement.value);

                    if(errorMessage){
                        inputElement.parentElement.classList.add('invalid');
                        errorElement.innerText = errorMessage;
                        check = false;
                    } else {
                        inputElement.parentElement.classList.remove('invalid');
                        errorElement.innerText = '';
                    }
                }

                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerText = '';
                }
            }
        });

        var btnElement = formElement.querySelector(options.submitElement);
        btnElement.onclick = function(){

            var check = options.rules.every(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                if(inputElement.value.length > 0 && rule.test(inputElement.value) == undefined) return true;
                return false;
            });

            if(check) {
                btnElement.type = 'reset';
                alert('Success');
            }
            else {
                btnElement.type = 'button';
                alert('Error');
            }
        }



    }
}

Validator.isRequired = function(selector){
    return {    
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Please enter your full name';
        }
    };
}

Validator.isPassword  = function(selector, min){
    return {        
        selector: selector,
        test: function(value){
            if(value.length <= 0) return 'Please enter this field';
            return (value.length >= min) ? undefined : `Password must have at least ${min} characters`;
        }
    };
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(value){
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(value) ? undefined : 'This filed must be email';
        }
    };
}

Validator.confirmPassword = function(selector, confirmValue){
    return {
        selector: selector,
        test: function(value){
            return (value === confirmValue()) ? undefined : 'This password does not match';
        }
    };
}


Validator.submit = function(){
    
}