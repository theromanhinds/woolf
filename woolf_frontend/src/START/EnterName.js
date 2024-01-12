import React from 'react'
import '../App.css';
import { useGameContext } from '../GameContext';

function EnterName({onNextStep}) {

  const { userName, handleNameUpdate } = useGameContext();

  const handleNameChange = (event) => { handleNameUpdate(event.target.value); };

  const handleNextButtonClick = () => { 
    if (userName.trim().length >= 1) { onNextStep(); }
  };

  return (
    <div className='Container'>
        Enter Name:
        <input input="text" value={userName} maxLength="8" onChange={handleNameChange}/>
        <button className='NextButton' onClick={handleNextButtonClick}>NEXT</button>
    </div>
  )
}

export default EnterName