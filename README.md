## CRUD USUARIOS DMS

## Table of contents

1. [Descripción General](#descripción)
2. [Características Aplicación](#características)
3. [Configuración](#configuración)

## Descripción

La aplicación para mantenimiento de usuarios del DMS ('App' en adelante) permite realizar las operaciones CRUD (creación, lectura, actualización y elmininado) de usuarios de un repositorio DMS.

## Características

* La App está construida con Vue.js y se ejecuta por completo en el navegador del usuario. Vue 3 - Vanilla Javascript - ES6

* Utiliza Bootstrap 5.x para los estilos, con las personalización de ciertas clases de ese framework para adaptarlos al look and feel de GoodOK

* El CRUD con el repositorio lo realiza a través del DmsRestService, versión 4.13 o superior.

* La App se entrega empaquetada como un fichero WAR para que pueda ser deplegada en un servidor de aplicaciones Tomcat.  El propio proceso de build genera el war en /target

* La App implementa internacionalización de textos/etiquetas con i18n, textos que por el momento están traducidos al español e inglés. 

    * Existen dos tipos traducciones:
        * Las generales que aplican a todos los textos de la aplicación persé; los ficheros con las claves (es.json, en.json) están dentro de la carpeta src/locales del proyecto y son empaquetados por webpack al momento del build; por lo tanto NO son configurables por el usuario configurador.
        * Las referidas a configuraciones que pueda hacer el configurador en el fichero config.json (que veremos mas delante en la sección [Configuración](#configuración) ), como por ejemplo texto de labels, placeholders, options de selects, etc.  Estos ficheros (es.json, en.json) se encuentran en la raíz de la aplicación desplegada, carpeta `/locales` y por lo tanto **no** son tratados por webpack, lo que quiere decir que el configurador los tendrá accesibles para hacer las traducciones a su gusto.

* Para el manejo del estado la App usa 'vuex' y para la persistencia de los datos del navegador se usa 'vuex-persist', utilizando como repositorio el localstorage.

* Las peticiones al backend las hace con axios y para la navegación entre páginas y la seguridad (rutas protegidas) utiliza vue-router.

**Restricciones**

* Solo funciona con repositorios Atril v6 o superior.

## Configuración

**config.json**

Toda la configuración de la App se apoya en el fichero `config.json` , el cual una vez desplegada la aplicación estará en el directorio raíz.

La idea sería que el configurador adapte el fichero con la configuración deseada y luego lo reemplace en el WAR que se terminará desplegando en el Tomcat.

### Atributos

A continuación se describen todos los atributos en `config.json` y su significado.

> serviceBaseUrl

La URL del servicio DmsRestService

> showAppFooter

Indica si al pie de cada página se muestra **true** o no **false** el footer.  Ejemplo `showAppFooter : true`

> showAboutPage

Indica si en la barra de navegación se muestra **true** o no **false** el link a la página about. Ejemplo `showAboutPage : false`

**Permisos para acceder a la aplicación:** La App permite definir qué usuarios pueden acceder a realizar operaciones CRUD sobre los usuarios del DMS, y esto lo implementa de dos formas diferentes, utilizando las entradas `allowed_users` y (en conjunto) las entradas `getUserProfileDocument` , `userProfileDocument` ,  `userProfileLinkedAttribute` y `allowUsersCrudAttribute`

> allowed_users

Normalmente se usará esta variable de configuración en entornos donde no se ha configurado -a nivel configuración de documentos del DMS- documentos para contener perfiles de los usuarios con información adicional (como por ejemplo UserProfile).

Los usuarios **no** configurados en la lista podrán autenticarse en la App pero no tendrán acceso a operar con los usuarios del sistema, situación que le será informada luego de autenticarse correctamente.  Una lista de ejemplo sería `allowedUsers : ["admin", "testuser", "david"]`

Una de las opciones que **si** podrán realizar los usuarios que se autentiquen pero no estén en la lista es acceder a la página para cambiar su contraseña, a la cual se accede haciendo click en el nombre del usuario, arriba a la derecha en la barra de navegación.

> getUserProfileDocument

Indica si luego de autenticarse un usuario se solicita **true** o no **false** el documento del perfil del usuario al DMS. Ejemplo `getUserProfileDocument : true` . En el caso de que el valor sea **true**  y al buscar el documento de perfil éste no existiera, no se permitirá el login.

> userProfileDocument

Aquí se indica el nombre que tienen los documentos de perfiles de usuarios en el DMS. Ejemplo `userProfileDocument : "UserProfile"`

> userProfileLinkedAttribute
Aquí se configura qué campo dentro del documento de perfil del usuario se relaciona con el nombre de usuario en el DMS. Ejemplo `userProfileLinkedAttribute : "user_name"`

> allowUsersCrudAttribute

Esta configuración se utiliza de forma similiar a `allowed_users`. Si queremos que la configuración de si un usuario puede hacer el CRUD sea dinámica y no fija en `allowed_users`, usando documentos de perfil de usuarios, podemos contar con un atributo en el documento de perfil que indique si está permitido usar la App para el mantenimiento de usuarios. En tal sentido, en este atributo configuraremos el nombre del campo dentro del documento perfil que indica si se puede **true** o no **false** operar con esta App.  Ejemplo: `allowUsersCrudAttribute : "allow_users_crud"`

> createOrEditUserProfileDocument

Si queremos que al momento de crear un usuario se cree un documento de perfil en el DMS pondremos a **true** esta variable (Ejemplo `createOrEditUserProfileDocument : true`). Sería lógico que esta variable esté a **true** cuando hayamos configurado `getUserProfileDocument : true`

> userProfileDocumentsParentIdContainer

Si se activa la creación y/o edición de documentos de perfil de usuario (entrada anterior), aquí deberá especificarse el ID del documento del DMS que hará las veces de contenedor de documentos de perfiles de usuarios. Ejemplo: `userProfileDocumentsParentIdContainer : "11232398623012"`

> userProfileAttributes

Aquí se configuran los atributos que conforman el documento de perfil del usuario, para las tareas de creación y edición de documentos de perfil ( funciona cuando createOrEditUserProfileDocument es **true** )

Se trata de un array [] de objectos {}, siendo cada objecto un atributo.

Los atributos configurados, además de usarse para la creación del documento de perfil, se utilizan para el armado dinámico de la página de edición de perfiles de usuarios.

**Ejemplos**

    {
        "name" : "user_name",
        "completion" : "auto",
        "defaultValue" : "",
        "completionAutoFunction" : "fn_user",
        "editable" : false,
        "htmlControl" : "input",
        "htmlLabeli18nId" : "PROFILE_ATTRIBUTE_LABEL_USERNAME",
        "selectConfig" : {}
    }


* **name:** *nombre del campo en el documento de perfil*

* **completion:** *como se va a completar este campo*
    * **"auto" :** lo completa automáticamente la aplicación al crear o editar un documento, basado en la función configurada en el campo `completionAutoFunction`
    * **"default" :** usa el valor configurado en `defaultValue` o el ingresado por el operador en la pantalla de edición del perfil.

* **completionAutoFunction:** el nombre de la función que efectuará el completado del campo. Estas funciones por ahora son dos:
    * **"fn_user" :** completa el campo con el nombre del usuario que se está creando o editando.
    * **"fn_last_password_update" :** guarda la fecha en formato yyyymmdd.  Esta fecha, por ahora, se toma del navegador pero por cuestiones de seguridad la idea es que se obtenga del servidor con el verbo dmsInfo del API del DMS (modificación del API en curso)
 

* **editable:** en la página para modificar el perfil de un usuario, este campo aparecerá como habilitado ( cuando editable=true ) o deshabilitado cuando sea false

* **htmlControl:** el tipo de control HTML que se utilizará para mostrar el campo y, eventualmente, permitir editar sus valores en la página de edición del perfil de usuario.  Los valores posibles son:
    * **"input" :** caja de texto
    * **"select" :** combo de selección simple
    * **"select-multiple" :** combo de selección múltiple

* **htmlLabeli18nId:** Aquí se especifica el ID de la traducción para la etiqueta (label HTML) de cada uno de los campos que forman parte de la página de edición del perfil de usuario. Si no se especifica nada ("") se utilizará el nombre del campo (name) como texto de la etiqueta. Si bien ya se mencionó mas arriba al hablar de **internacionalización de la App**, las traducciones para estos ID's las debe hacer el usuario en los ficheros [lang].json que se encuentran en `/locales`


**Select / Combos**

En el caso de que en `htmlControl` se haya escogido `select` o `select-multiple` , habrá que setear para estos atributos el campo `selectConfig`

Ejemplo:

        "selectConfig" : {
            "name" : "select-operations",
            "items" : [
                {
                    "valueAttribute" : "Expediente_Vehiculos",
                    "i18nTextId" : ""
                },
                {
                    "valueAttribute" : "Expediente_Impedidos",
                    "i18nTextId" : ""
                },
                {
                    "valueAttribute" : "Expediente_Medico",
                    "i18nTextId" : ""
                }                    
            ]
        }
         

* **name:** el nombre del campo a setear en la propiedad "name" de la etiqueta/control select

* **items:** es una lista/array de los campos del select, conteniendo:
    * **"valueAttribute" :** el valor de la opción ( atribute value del option ) de un item del control select. 
    * **"i18nTextId" :** es el texto de la opción que verá el usuario; en el caso de que se quiera internacionalizar este valor, se podría especificar aquí el ID de un texto traducido en los ficheros `/locales/*.json`. Si se deja en blanco se utlizará lo mismo que se configuró en `valueAttribute`


> controlPasswordExpiration

Indica si cuando un usuario se autentica se controla **true** o no **false** la fecha desde la última actualización de la password, para determinar si ha expirado. Para esto se apoya en la variable `passwordExpirationDateAttribute` y `maximumPasswordAge`, conjuntamente con la fecha actual la cual se obtiene del servidor a partir del verbo GET dms/info.

**IMPORTANTE** : si un usuario se autentica y se determina que su password ha vencido, la App lo redireccionará a la página de actualización de contraseña. Si no lo hace no podrá acceder a la página principal (Lista de usuarios).

> passwordExpirationDateAttribute

Indica cual es el campo del documento de perfil del usuario donde se guarda la última vez que el usuario actualizó su contraseña. Ejemplo: `passwordExpirationDateAttribute : "last_password_update"`

> maximumPasswordAge

La cantidad, en días, que como máximo tiene que tener una contraseña desde su última actualización. Ejemplo `maximumPasswordAge : 30`

> expirationAttributeSetValueFunction

Cuando se actualiza la contraseña del propio usuario desde la página de cambio de contraseña o desde la ventana de edición de usuarios para el usuario logueado u otro, la App actualiza el atributo con la última actualización de la contraseña y para completar su valor utiliza la función configurada en este parámetro. Ejemplo: `expirationAttributeSetValueFunction : "fn_last_password_update"`
