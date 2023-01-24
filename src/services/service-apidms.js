import { dmsClient } from "@/plugins/axios-config"

export default {
  name: "apiDms",
  async login(payload) {
    const url = "/dms/authenticate"
    return await dmsClient.post(url, payload)
  },
  async logout() {
    const url = "/dms/authenticate"
    return await dmsClient.delete(url)
  },  
  async getUserInfo() {
    const url = "/dms/authenticate"
    return await dmsClient.get(url)
  },
  async getUsers() {
    const url = "/dms/users"
    return await dmsClient.get(url)
  },      
  async getDmsInfo() {
    const url = "/dms/info"
    return await dmsClient.get(url)
  },
  async addUser(payload){    
    const url = "/dms/users"
    return await dmsClient.post(url, payload)
  },
  async updateUser(payload){   
    const url = "/dms/users/" + payload.user
    return await dmsClient.put(url, payload)
  },
  async deleteUser(username){
    const url = "/dms/users/" + username
    return await dmsClient.delete(url)
  },
  async search(headers){
    const url = "/dms/documents"
    return await dmsClient.get(url, {headers})
  },
  async getDocumentById(id){
    const url = "/dms/documents/" + id
    return await dmsClient.get(url)
  },
  async addDocument(partenId, payload){    
    const url = "/dms/documents/" + partenId + "/new"
    return await dmsClient.post(url, payload)
  },
  async deleteDocumentById(id){
    const url = "/dms/documents/" + id
    return await dmsClient.delete(url)
  }
}
