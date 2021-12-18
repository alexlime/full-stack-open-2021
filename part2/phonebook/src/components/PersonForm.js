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

export default PersonForm