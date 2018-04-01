import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import notificationReducer from './reducers/notificationReducer'
import activationCodeReducer from './reducers/activationCodeReducer'
import questReducer from './reducers/questReducer'
import usersReducer from './reducers/usersReducer'
import loggedUserReducer from './reducers/loggedUserReducer'
import courseReducer from './reducers/courseReducer'
import filterReducer from './reducers/filterReducer'
import fieldToFilterReducer from './reducers/fieldToFilterReducer'
import errorMessageReducer from './reducers/errorMessageReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  activationCode: activationCodeReducer,
  quests: questReducer,
  users: usersReducer,
  loggedUser: loggedUserReducer,
  courses: courseReducer,
  filter: filterReducer,
  fieldToFilter: fieldToFilterReducer,
  errorMessage: errorMessageReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store