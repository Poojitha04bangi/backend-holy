export type UserType =  {
    firstname :String,
    lastname :String,
    email:String,
    password :String,
    confirm_password :String,
    checkValidPassword: Function;
    samePassword: Function;
    getResetPasswordToken: Function;
}
