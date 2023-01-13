import * as getters from './users-getters'
import * as mutations from './users-mutations'
import * as actions from './users-actions'
import { initialStateUsersState } from '../../helpers'

const moduleUsers = {
  namespaced: true,
  state: initialStateUsersState(),
  getters,
  mutations,
  actions
}

export default moduleUsers
