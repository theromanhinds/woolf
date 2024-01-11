import React, { useState } from 'react'
import '../App.css';
import { useNavigate } from 'react-router-dom';


function A_EnterName({userName, onNameUpdate}) {

  const handleNameChange = (event) => { onNameUpdate(event.target.value); };

  const navigate = useNavigate();

  const handleNextButtonClick = () => { 
    if (userName.trim().length >= 1) {
      navigate('/join_game'); 
    }
  };

  return (
    <div className='Container'>
        Woolf
        <input input="text" value={userName} maxLength="8" onChange={handleNameChange}/>
        <button className='NextButton' onClick={handleNextButtonClick}>NEXT</button>
    </div>
  )
}

export default A_EnterName