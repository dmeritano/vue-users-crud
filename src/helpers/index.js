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