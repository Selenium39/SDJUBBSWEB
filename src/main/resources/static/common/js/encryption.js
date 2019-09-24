function formEncryption(password) {
    var salt = "selniumlovezxy";
    var str = salt.charAt(5) + salt.charAt(2) + password + salt.charAt(0);//使用固定的salt
    return md5(str);
}