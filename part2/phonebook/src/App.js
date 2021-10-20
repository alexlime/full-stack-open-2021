import React, {useState} from 'react'




const Person = ({person}) => (
  <li>{person.name} {person.number}</li>
)

const Contacts = ({persons}) => {
  return (
    <ul>
      {persons.map(eachPerson =>
        <Person key={eachPerson.name} person={eachPerson} />
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
  console.log(inputs)
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
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-1234567' },
    { name: 'Alex Limenko', number: '040-1253467' },
    { name: 'Jeffrey Way', number: '040-13333567' },
    { name: 'Jef Bezos', number: '040-7777777' },
    { name: 'John Doe', number: '040-779777' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setNewSearchName ] = useState('')

  /* If value received from search input 
     then filter persons list */
  const contactsToShow = searchName
    ? persons.filter(i => (
        i.name.toLowerCase().includes(searchName.toLowerCase()))
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

  const addContact = (event) => {
    event.preventDefault()

    // check matches in array of objects
    const checkName = obj => obj.name === newName
    const nameExists = persons.some(checkName)

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = { 
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(newPerson))  
    }
    setNewName('') 
    setNewNumber('') 
  }

  // data for PersonForm component inputs
  const formInputs = [
    {label: "names: ", value: newName, onChange: handleName},
    {label: "numbers: ", value: newNumber, onChange: handleNumber},
  ]

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        label="filter contacts: "
        value={searchName} 
        handle={handleSearch} 
      />

      <h2>Add new contact</h2>

      <PersonForm 
        onSubmit={addContact}
        inputs={formInputs}
      />

      <h2>Contacts</h2>
      <Contacts persons={contactsToShow} />
    </div>
  )
}

export default App