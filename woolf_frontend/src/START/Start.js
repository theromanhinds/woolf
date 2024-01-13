import React from 'react'
import { useState } from 'react'

import EnterName from './EnterName'
import CreateJoin from './CreateJoin'
import EnterRoom from './EnterRoom'

import logo from '../Assets/WoolfLogo.png';

function Start() {

    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    //name entered? 
        //false then show EnterName
        //true then show CreateJoin

    //Game created?
        //false then show EnterRoom
        //true then navigate to Game

    //Room entered?
        //then navigate to Game

  return (
    <div className='StartContainer'>
      <img src={logo} className='StartLogo'/>
      {currentStep === 1 && <EnterName onNextStep={handleNextStep} />}
      {currentStep === 2 && <CreateJoin onNextStep={handleNextStep} />}
      {currentStep === 3 && <EnterRoom />}
    </div>
  )
}

export default Start