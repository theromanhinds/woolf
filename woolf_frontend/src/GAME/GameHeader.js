import React from 'react'

function GameHeader({roomID, userName}) {
  return (
    <div className='GameHeader'>
        <p>WOOLF</p>
        <p>Your name is {userName}</p>
        <p>This room is {roomID}</p>
    </div>
  )
}

export default GameHeader