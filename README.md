CRUD para usuarios del DMS (*)
Vue 3 - Vanilla Javascript - ES6
Se parte de proyecto base vue-base (dmeritano.github.com)
(*) Solo funciona con repositorios DMS versión 6 o superior.

==Notas version 1.1.2==

### Mejoras y correciones

Se agrega titulo con el nombre de la aplicacion en AppHeader

Se create variable en state de users ( usersLoadedFromServer )
Esta variable se pone en true la primera vez que el usuario obtiene la lista de usuarios
Luego, cuando el usuario navega entre las demas paginas de la aplicacion, al volver a home
si esa variable esta en true no se pide al servidor nuevamente la lista de usuarios.

El agregado, modificacion y elmiminado de usuarios ya se encargar de mantener actualizado
la variable "users" del state de usuarios, con lo cual estaria sincronizada con los usuarios
en el servidor.



==Notas version 1.1.1==
### Mejoras y correciones

Para las traducciones relacionadas con la pagina UserProfile.vue (lables y options de los select), 
las cuales se configuran en /public/config.json, cree los archivos locales en public/locales.

    ..public/locales/es.json
    ..public/locales/en.json

De esta forma el configurador de la aplicacion puede acceder a dichos archivos y adaptarlos de acuerdo
a la configuracion que vaya haciendo en config.json (userProfileAttributes).

El resto de traducciones siguen en @/locales, y son las traducciones propias de la aplicacion, las
cuales no deberian cambiar. De hecho, webpack no expone dichos archivos al hacerse el build, y por
lo tanto los configuadores no tienen acceso a ellos.

Para estos cambios de tener archivos de traducciones separados tuve que modificar i18n.js , para que
tambien cargue los mensajes de los archivos que estan en /public/locales
