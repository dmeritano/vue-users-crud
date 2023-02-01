<template>
    <div class="container px-5">
        <h3 class="my-4">Datos del perfil del usuario</h3>
        <p class="text-primary">Username: <em>{{username}}</em></p>
    </div>    
</template>

<script>
export default {
    data(){
        return {
            "username" : this.$route.params.username
        }
    }
}
</script>