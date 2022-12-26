export function emptyUser() {
    return{
        user:"",
        name:"",
        surname:"",
        pass:"",
        group:"Administrators"    
    }
}
export function createUser(payload){
    return{
        user:payload.user,
        name:payload.name,
        surname:payload.surname,
        pass:"",
        group:""    
    }
}

export function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers - customize it to your needs */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}