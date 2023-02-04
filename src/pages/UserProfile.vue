<template>
    <div class="container px-5">
        <h3 class="mt-4 mb-0">{{$t("USERPROFILE_MAIN_TITLE")}} <em class="text-default">{{userName}}</em></h3>
        <small class="text-secondary">{{extraUserInfo}}</small>

        <div class="row my-3">
            <div class="col-md-12">
                <p class="text-danger" v-if="error.hasError">{{error.i18nMsg}}</p>
            </div>
        </div>
        <form id="form-profile" class="row g-3" @submit.prevent>
            <div class="col-md-4" v-for="(repoValue,repoKey,index) in attributes" :key="index">            
                <label class="form-label">{{getLabelText(repoKey)}}</label>
                <span v-if="isSelectControlMultiple(repoKey)">
                    <a class="text-default ms-2 custom-link" 
                        href="#" 
                        @click="deselectAllOptions(repoKey)">[ x ]
                    </a>
                </span>
                <div v-if="isSelectControl(repoKey)">
                    <select :disabled="isDisabled(repoKey)" 
                            :name="getSelectName(repoKey)"
                            v-model="attributes[repoKey]"
                            class="form-select" 
                            :id="repoKey">
                        <option v-for="(cfgValue,cfgKey,index) in getSelectItems(repoKey)" 
                            :key="index" 
                            :value="cfgValue.valueAttribute"
                            :selected="cfgValue.valueAttribute === repoValue">
                            {{getOptioni18nText(cfgValue.i18nTextId,cfgValue.valueAttribute)}}                            
                        </option>
                    </select>
                </div>
                <div v-else-if="isSelectControlMultiple(repoKey)">
                    <select :disabled="isDisabled(repoKey)" 
                            :name="getSelectName(repoKey)"
                            v-model="attributes[repoKey]"
                            class="form-select" 
                            :id="repoKey"
                            multiple>
                        <option v-for="(cfgValue,cfgKey,index) in getSelectItems(repoKey)" 
                            :key="index" 
                            :value="cfgValue.valueAttribute"
                            :selected="repoValue.indexOf(cfgValue.valueAttribute) >= 0">
                            {{getOptioni18nText(cfgValue.i18nTextId,cfgValue.valueAttribute)}}                            
                        </option>
                    </select>                    
                </div>
                <div v-else> <!-- input -->
                    <input class="form-control" type="text" :id="repoKey" v-model="attributes[repoKey]" :disabled="isDisabled(repoKey)" />
                </div>            
            </div>
            <div class="col-12 mt-5">
                <button type="submit" @click="saveProfile(this)" class="btn btn-default">{{$t("GENERAL_SAVE_BTN")}}</button>
            </div>            
        </form>
    </div>
    <alert-modal v-if="showAlertDialog" :messageType="dialogAlertMessageType" :message="alertDialogText" @closeAlert="showAlertDialog=false"/>
</template>

<script>

import { mapActions, mapGetters } from "vuex"
import AlertModal from '../components/AlertModal.vue'
import { alertModalErrorTypes } from '../helpers'

export default {
    components: {
        'alert-modal' : AlertModal
    },    
    data(){
        return {
            userName : this.$route.params.username,
            attributes : {},
            profileDocId : null,
            showAlertDialog : false,
            dialogAlertMessageType : alertModalErrorTypes.DEFAULT,
            alertDialogText : "",            
        }
    },
    computed:{
        ...mapGetters({error: 'moduleUsers/error'}),
        extraUserInfo(){
            let aux = " (" + this.$t("EDITUSER_SURNAME") + ": "
            if (this.$route.query.surname){
                aux += this.$route.query.surname + " "
            }else{
                aux += this.$t("GENERAL_DATA_UNDEFINED") + " "
            }
            aux += this.$t("EDITUSER_NAME") + ": "
            if (this.$route.query.name){
                aux += this.$route.query.name
            }else{
                aux += this.$t("GENERAL_DATA_UNDEFINED")
            }            
            return aux + ")"
        },
    },
    methods:{
        ...mapActions({
            getUserProfile: "moduleUsers/getUserProfileDocument",
            saveUserProfile: "moduleUsers/updateUserProfileDocument"
        }),
        getLabelText(attribute){
            const configuredAttrs = this.$AppConfig.userProfileAttributes            
            let elem = configuredAttrs.filter(e => {return e.name === attribute})
            let i18nText = attribute
            if (elem){                                
                i18nText = this.$t(elem[0].htmlLabeli18nId,attribute) //attribute => default (if not exist key)
            }
            return i18nText
        },
        isDisabled(attribute){          
            const configuredAttrs = this.$AppConfig.userProfileAttributes            
            let elem = configuredAttrs.filter(e => {return e.name === attribute})
            if (elem){
                return elem[0].editable ? false : true
            }else{
                return true
            }            
        },
        isSelectControl(attribute){
            const configuredAttrs = this.$AppConfig.userProfileAttributes            
            let elem = configuredAttrs.filter(e => {return e.name === attribute})
            if (elem){
                if (elem[0].htmlControl.toLowerCase() === "select"){
                    return true
                }
                return false
            }else{
                return false
            }            
        },
        isSelectControlMultiple(attribute){
            const configuredAttrs = this.$AppConfig.userProfileAttributes            
            let elem = configuredAttrs.filter(e => {return e.name === attribute})
            if (elem){
                if (elem[0].htmlControl.toLowerCase() === "select-multiple"){
                    return true
                }
                return false
            }else{
                return false
            }            
        },
        getSelectName(attribute){
            const configuredAttrs = this.$AppConfig.userProfileAttributes            
            let elem = configuredAttrs.filter(e => {return e.name === attribute})
            if (elem){
                return elem[0].selectConfig.name                
            }else{
                return attribute + Math.floor(Math.random() * 100);
            }
        },
        getSelectItems(attribute){
            const configuredAttrs = this.$AppConfig.userProfileAttributes            
            let elem = configuredAttrs.filter(e => {return e.name === attribute})
            if (elem){
                return elem[0].selectConfig.items
            }else{
                return {}
            }
        },
        getOptioni18nText(translationId, defaultText){
            if (translationId && translationId.trim().length > 0){
                return this.$t(translationId.trim())
            }else{
                return defaultText
            }
        },
        deselectAllOptions(attribute){
            this.attributes[attribute] = []         
        },
        async saveProfile(){
            const profileAttributes = {}
            const formElements = document.querySelectorAll('#form-profile input,select')
            formElements.forEach(elem => {
                if (!this.isDisabled(elem.id)){
                    if (elem.tagName === "SELECT" && elem.multiple){
                        let options = Array.from(elem.selectedOptions).map(el => el.value)
                        profileAttributes[elem.id] = options.join(',')    
                    }
                    else{
                        profileAttributes[elem.id] = elem.value.trim()
                    }                    
                }                 
            })
            await this.saveUserProfile({
                "attributes" : profileAttributes,
                "id" : this.profileDocId,
                "user" : this.userName
            })
            if (!this.error.hasError){
                this.alertDialogText = this.$t("USERPROFILE_PROFILE_UPDATED")
                this.showAlertDialog = true                                 
            }            
        }
    },
    created(){
        this.getUserProfile(this.userName)
            .then((response) => {
                /* For attributes set to "select-multiple", which in the dms save as a string with 
                comma separated values, I have to convert (split) the string to an array so that
                the v-model associated with the SELECT control of type "multiple" works. correctly */
                for (const [key, value] of Object.entries(response.profileAttributes)) {
                    const configuredAttrs = this.$AppConfig.userProfileAttributes            
                    let elem = configuredAttrs.filter(e => {return e.name === key})                    
                    if (elem && elem[0].htmlControl.toLowerCase() === "select-multiple"){
                        response.profileAttributes[key] = value.split(",")
                    }
                }
                this.attributes = response.profileAttributes
                this.profileDocId = response.id
        })        
    }
}
</script>

<style scoped>
.custom-link{
  font-size: smaller;
  text-decoration: none;
}
</style>