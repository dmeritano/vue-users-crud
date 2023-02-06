import * as getters from './users-getters'
import * as mutations from './users-mutations'
import * as actions from './users-actions'
import { initialStateUsersStore } from './users-helpers'

const moduleUsers = {
  namespaced: true,
  state: initialStateUsersStore(),
  getters,
  mutations,
  actions
}

export default moduleUsers
