import axios from 'axios'

let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  baseUrl = process.env.DEV_URL
} else {
  baseUrl = process.env.BASE_URL || 'https://huntforglory.herokuapp.com/api/quests'
}

const getAll = () => {
  return axios.get(baseUrl)
}

const getOne = (id) => {
  return axios.get(`${baseUrl}/${id}`)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, remove, getOne, update }
