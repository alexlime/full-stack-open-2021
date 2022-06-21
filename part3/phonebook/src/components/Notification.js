

const Notification = ({text, color}) => {
  const notificationColor = {
    color: color
  }
  if (text === null) {
    return null
  }
  return (
    <div className='notification' style={notificationColor}>
      {text}
    </div>

  )
}

export default Notification