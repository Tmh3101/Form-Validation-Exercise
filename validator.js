
function Validator(options){

    function validate(inputElement, rule){

        // lấy element thông báo lỗi trong cùng parent element với input element
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        // lấy error message từ hàm test của rule tương ứng đầu tiên
        var errorMessage;
        var rules = selectorRules[rule.selector]; // lấy ra mảng rules của từng input
        for(var i = 0; i < rules.length; i++){ // lặp qua từng rule để lấy phần tử khác undefine đầu tiên (nếu có)
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        // thực hiện hiển thị error message nếu error message khác undefine
        if(errorMessage){
            inputElement.parentElement.classList.add('invalid');
            errorElement.innerText = errorMessage;
        } else {
            inputElement.parentElement.classList.remove('invalid');
            errorElement.innerText = '';
        }

        //trả về true nếu error message là undefine, ngược lại trả về false
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form); // lấy form element từ document
    var selectorRules = {}; //tạo object để lưu các mảng rules của từng input (một input element có thể có nhiều rules)

    if(formElement){

        options.rules.forEach(function(rule){  // duyệt qua từng phần tử trong rules

            // lưu các rules vào object cho các input tương ứng
            if(Array.isArray(selectorRules[rule.selector])){ // nếu đã có rồi thì thêm vô
                selectorRules[rule.selector].push(rule.test);
            } else { // ngược lại, gán bằng mảng
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector); // lấy input element vừa được thao tác

            if(inputElement){

                // thực hiện phương thức onblur -> khi bỏ focus ra khỏi input element
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }

                //thực hiện xóa bỏ error message trong khi người dùng đang nhập dữ liệu vào input
                inputElement.oninput = function(){
                    // lấy element thông báo lỗi trong cùng parent element với input element
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerText = '';
                }
            }
        });


        formElement.onsubmit = function(e) {
            e.preventDefault(); //ngăn chặn sự kiện submit của button
            var isValidForm = true; //tạo biến lưu trữ trạng thái hợp lệ của form khi submit
            //lăp qua từng rule để kiểm tra
            options.rules.forEach(function(rule){

                var inputElement = formElement.querySelector(rule.selector); // lấy input element vừa được thao tác
                var check = validate(inputElement, rule);
                if(!check) isValidForm = false;

            });

            //nếu form hợp lệ
            if(isValidForm){

                var enableInputs = formElement.querySelectorAll('[name]'); //lấy ra mảng element có trường name

                //reduce mảng enableInputs thành một đối tượng
                var formValues = Array.from(enableInputs).reduce(function(values, input){
                    values[input.name] = input.value;
                    return values;
                }, {});
                console.log(formValues);

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