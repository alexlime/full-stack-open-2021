import React, {useState} from 'react'


const Header = ({text}) => <h1>{text}</h1>


const Button = ({click, text}) => (
    <button onClick={click}>
      {text}
    </button>
)


const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({stats}) => {
  const [good, neutral, bad] = stats

  let all = good + bad + neutral
  let average = (good - bad) / all 
  let positive = good / all * 100  

  if (all === 0 ) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + ' %'} />
      </tbody>
    </table>
  )
}


const App = (props) => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)
  
  return (
    <div>
      <Header text="Give feedback" />

      <Button 
        click={handleGood} 
        text={"good"}
      />      
      <Button 
        click={handleNeutral} 
        text={"neutral"}
      />
      <Button 
        click={handleBad} 
        text={"bad"}
      />

      <Header text="Statistics"/>
      
      <Statistics stats={[good, neutral, bad]} />
    </div>
  )
}

export default App
