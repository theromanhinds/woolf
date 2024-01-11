import React from 'react'

function GameBoard({words}) {
  return (
    <div>
        <h3>GameBoard</h3>
        <div className="BoardContainer">
            {words.map((word, index) => (
            <div key={index} className="BoardWord">
            {word} </div>
            ))}
        </div>
    </div>
  )
}

export default GameBoard