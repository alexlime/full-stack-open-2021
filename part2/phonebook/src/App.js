import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import personsService from './services/persons'
import Notification from './components/Notification'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import './index.css'



const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setNewSearchName ] = useState('')
  const [notification, setNotification] = useState({
    text: null,
    color: 'green' 
  })


  useEffect(() => {
    personsService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
      .catch(error => {
        console.log('fail')
      })
  },[])


  /* If value received from search input 
     then filter persons list */
  const personsToShow = searchName
    ? persons.filter(i => (
        i.name
          .toLowerCase()
          .includes(searchName.toLowerCase()))
      )
    : persons


  const handleName = (event) => {
    setNewName(event.target.value)
  }


  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }


  const handleSearch = (event) => {
    setNewSearchName(event.target.value)
  }


  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    const confirmString = `${newName} is already added to phonebook, replace the old number with the new one?`
    const newPerson = { 
      name: newName,
      number: newNumber
    }

    if (person === undefined) {
      // No person exist, Add new
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson)) 
          setNotification({...notification, text: `Added ${newPerson.name}`})
          setTimeout(() => {
            setNotification({...notification, text: null})
          }, 4000)
        })
    } 
    else {
      // Person exists, ask to update
      if (window.confirm(confirmString)) {
        personsService
          .update(person.id, newPerson) 
          .then(returnedPerson => { 
            setPersons(persons.filter(p => p !== person).concat(returnedPerson))
            setNotification({...notification, text:`Updated ${newPerson.name}`})
            setTimeout(() => {
              setNotification({...notification, text: null})
            }, 4000)
          })
          .catch(error => { 
            setNotification({
              text: `Information of ${newPerson.name} has already been removed from server`,
              color: 'red'
            })
            setTimeout(() => {
              setNotification({...notification, text: null})
            }, 4000)
            setPersons(persons.filter(p => p !== person))
          })
      }
    }
    setNewName('') 
    setNewNumber('') 
  }


  const deletePerson = (id) => {
    /* delete person, if person doesn't exist show alert and rerender */
    const personToDelete = persons.find(p => p.id === id)
    const confirmString = `Do you really want to delete ${personToDelete.name} from the Phonebook?`

    if (window.confirm(confirmString)) {
      personsService
        .del(id)
        .then( () => {
          setPersons(persons.filter(p => p.id !== id)) 
          setNotification({...notification, text: `Deleted: ${personToDelete.name}`})
          setTimeout(() => {
            setNotification({...notification, text: null})
          }, 4000)
        })
        .catch(error => { 
          console.log(`${personToDelete.name} has not been found on server, rerender...`)
          setPersons(persons.filter(p => p.id !== id)) 
        }) 
    }
  }


  // passed to PersonForm component inputs
  const formInputs = [
    {label: "names: ", value: newName, onChange: handleName},
    {label: "numbers: ", value: newNumber, onChange: handleNumber}
  ]


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification text={notification.text} color={notification.color} />
      <Filter 
        label="filter persons: "
        value={searchName} 
        handle={handleSearch} 
      />

      <h2>Add new person</h2>

      <PersonForm 
        inputs={formInputs}
        onSubmit={addPerson}
      />

      <h2>Numbers</h2>
      <Persons 
        persons={personsToShow} 
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App