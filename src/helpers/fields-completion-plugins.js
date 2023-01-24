export function getProfileFieldValue(fn, data){
    
    switch (fn.toLowerCase()) {
        case "fn_user":            
            return data.user

        case "fn_last_password_update":
            return yyyymmdd()

        default:
            return "S/D";
    }
}



function yyyymmdd() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
}