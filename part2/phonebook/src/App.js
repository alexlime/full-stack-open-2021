import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import personsService from './services/persons'


const Persons = ({persons, deletePerson}) => {
  return (
    <ul>
      {persons.map(eachPerson =>
        <li key={eachPerson.name}> 
          {eachPerson.name} {eachPerson.number}
          <button onClick={() => deletePerson(eachPerson.id)}>
            delete
          </button>
        </li>
      )}
    </ul>   
  )
}


const Filter = ({label, value, handle}) => {
  return (
    <div>
      <label>
        {label}
        <input value={value} onChange={handle} />
      </label>
    </div>
  )
}


const PersonForm = ({onSubmit, inputs}) => {
  return (
    <form onSubmit={onSubmit}>
      {inputs.map(i =>
        <div key={i.label}>
          <label>
            {i.label}
            <input value={i.value} onChange={i.onChange} />
          </label>
        </div>
      )}
      <div>
      <button type="submit">add</button>
      </div>
    </form>
  )
}


const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setNewSearchName ] = useState('')

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
    // check matches in array of objects
    // const checkName = obj => obj.name === newName
    // const nameExists = persons.some(checkName)
    const person = persons.find(person => person.name === newName)

    const confirmString = `${newName} is already added to phonebook, replace the old number with the new one?`

    const newPerson = { 
      name: newName,
      number: newNumber
    }

    if (person === undefined) {
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson)) 
        })
    } 
    else {
      if (window.confirm(confirmString)) {
        personsService
          .update(person.id, newPerson) 
          .then(returnedPerson => { 
            setPersons(persons.filter(p => p !== person).concat(returnedPerson))
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
        .catch(error => { 
          console.log(`${personToDelete.name} is not found on server`)
        }) 
        .then( () => setPersons(persons.filter(p => p.id !== id)) )
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