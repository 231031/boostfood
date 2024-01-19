import toast from "react-hot-toast";
import validator from "validator";
export async function usernameValidate (values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    return errors;
}

export async function resetPasswordValidate (values) {
    const errors = passwordVerify({}, values);

    if (values.password !== values.confirm_pwd) {
        errors.exist = toast.error('Password not Matched');
    }
    return errors;
}

export async function registerValidate (values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    registerVerify(errors, values);
    return errors;
}

export async function addFoodValidate (values) {
    const errors = addFoodVerify({}, values);

    return errors;
}

export async function addIngredientValidate (values) {
    const errors = addIngredientVerify({}, values);

    return errors;
}

//  validate username and password
function usernameVerify (error = {},  values) {
    if (!values.username) {
        error.username = toast.error('Username Required');
    } else if (values.username.includes(" ")) {
        error.username = toast.error('Username Invalid');
    } else if (!values.username) {
        error.username = toast.error('Username Required');
    } 
 
    return error;
}

function passwordVerify (error = {},  values) {
    if (!values.password) {
        error.username = toast.error('Password Required');
    }  else if (values.password.includes(" ")) {
        error.password = toast.error('Password Invalid');
    } else if (values.password.length < 8) {
        error.password = toast.error('Password must be at least 8 characters');
    }
 
    return error;
}

function registerVerify (error = {},  values) {
    if (!values.email || !values.tel || !values.fistName || !values.lastName) {
        error.username = toast.error('All form required to filed');
    } else if (
    (values.email && values.email.includes(" ")) ||
    (values.fistName && values.fistName.includes(" ")) ||
    (values.lastName && values.lastName.includes(" "))) {
        error.username = toast.error('Information Invalid');
    } else if (!(validator.isEmail(values.email))) {
        error.email =toast.error('Email Invalid');
    }
 
    return error;
}

function addFoodVerify (error = {},  values) {
    if (!values.foodname || !values.price || !values.discountedPrice || !values.stock) {
        error.username = toast.error('All form required to filed');
    }
    if (!values.category) error.category = toast.error('Category Required');
 
    return error;
}

function addIngredientVerify (error = {},  values) {
    if (!values.ingredientname || !values.price || !values.discountedPrice || !values.stock) {
        error.ingredientname = toast.error('All form required to filed');
    }
    if (!values.category) error.category = toast.error('Category Required');
 
    return error;
}