CRUD para usuarios del DMS (*)
Vue 3 - Vanilla Javascript - ES6
Se parte de proyecto base vue-base (dmeritano.github.com)
(*) Solo funciona con repositorios DMS versión 6 o superior.


==Notas version 1.0.2==


### Mejoras y correciones

Al actualizar un usuario, si se actualiza la contraseña, se actualizar el documento de perfil del usuario (atributo last_password_update); esto en el caso de que se encuentre activo el control de expiracion de contraseñas (entrada en config.json)

En el login, si esta activo el control de expiracion de contraseñas, se valida que la password no haya vencido. Si vencio, se dirige al suario a una nueva pagina (ChangePassword) para que cambie la contraseña. Solo si la cambia y el proceso es exitoso se le permite al usuario ir al /home.

Se crea /store/modules/users-helpers.js para organizar mejor las funcions utilizadas en el store de usuarios.

