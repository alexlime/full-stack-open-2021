import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'



const getAll = () => {
  const request = axios.get(baseUrl)
  // const nonExisting = {
  //         name: "xxx",
  //         number: "12-43-234345",
  //         id: 1000
  //       }
  // return request.then(response => response.data.concat(nonExisting))
  return request.then(response => response.data)
}  

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const del = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const noteServises = {getAll, create, update, del}

export default noteServises