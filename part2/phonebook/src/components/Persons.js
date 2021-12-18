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

export default Persons


