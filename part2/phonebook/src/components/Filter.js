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

export default Filter