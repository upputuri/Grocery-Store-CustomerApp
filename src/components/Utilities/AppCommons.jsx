
const passwordFormatError = "Password must contain at least six characters, one lowercase, one uppercase and one numeric and can not be same as email!";

const isPasswordValid =(username, password) => {
    let re;
    if(password.length < 6) {
        return false;
    }
    if(password === username) {
        return false;
    }
    re = /[0-9]/;
    if(!re.test(password)) {
        return false;
    }
    re = /[a-z]/;
    if(!re.test(password)) {
        return false;
    }
    re = /[A-Z]/;
    if(!re.test(password)) {
        return false;
    }
    return true;
}


export {isPasswordValid, passwordFormatError};