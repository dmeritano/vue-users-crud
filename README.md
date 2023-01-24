CRUD para usuarios del DMS (*)
Vue 3 - Vanilla Javascript - ES6
Se parte de proyecto base vue-base (dmeritano.github.com)
(*) Solo funciona con repositorios DMS versión 6 o superior.


==Notas version 1.0.1==


### Mejoras y correciones

Se modifican las acciones de login, addUser y deleteUser para utilizar promesas encadenadas, dado que llamamos a mas de un metodo del API del DMS.

Se agrega al config.json nueva configuración para nueva funcionalidad de agregado y elmininado de documentos de perfil de usuario en las acciones de agregar y eliminar usuarios respectivamente.

```json

    "createOrEditUserProfileDocument" : true,
    "userProfileDocumentsParentIdContainer" : "99269579112449",
    "userProfileFields" : [
        {
            "name" : "user_name",
            "completion" : "auto",
            "defaultValue" : "",
            "completionAutoFunction" : "fn_user"
        },
        {
            "name" : "allow_users_crud",
            "completion" : "default",
            "defaultValue" : "false",
            "completionAutoFunction" : ""    
        },
        {
            "name" : "last_password_update",
            "completion" : "auto",
            "defaultValue" : "",
            "completionAutoFunction" : "fn_last_password_update"    
        }        

    ]      
```

### TODO:

Agregar a la configuracion: "controlar_vencimiento_passwords"

Si controlar_vencimiento_passwords === true

    Ver la forma de aplicar vencimiento de contraseñas. Esto implica contar con una fecha obtenida del servidor (nuevo verbo?) dado que no podemos fiarnos de la fecha del ordenador para calcular si una password vencio o no.

    Lo mismo para actualizar un posible nuevo campo ( "last_password_update" ?) en el documento de perfil del usuario que indique el ultimo update de la contraseña.  

    Este nuevo campo (u otro que definamos) deberia actualizarse en el documento de perfil del usuario cuando se crea el usuario y cuando se modifique la password de un usuario al editarlo (desde este CRUD) y también desde otros sistemas que permitan cambiar la contraseña, como la Revision y la Consulta Web.

Si controlar_vencimiento_passwords === true

    Hay que agregar nueva interface al CRUD para que si la contraseña del usuario esta vencida le salta interfaz "obligándolo" a cambiar la password para seguir.

    Una alternativa es abrir la pantalla de edicion del usuario logueado y ponerle algun mensaje que diga "su contraseña ha vencido, debe cambiarla.  Y que si no la cambiar no pueda hacer 
    otra cosa"


