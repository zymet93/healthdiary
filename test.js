'use strict';
console.log('the script starts');

function synchronousFunction() {
  let number = 1;
  for(let i = 1; i < 1000; i++){
    number += i;
    console.log('synchronousFunction running');
  }
  console.log('regular function complete', number);
}


function synchronousFunction2() {
    console.log('Vihdoin täällä')
  }
 

  //Suoritetaan asynkronoidusti
async function asynchronousFunction() {

    console.log('ASYNC HAKU ALKAA');
    
    //fetch url option

    //Haetaan ilman async/await rakennetta perinteisesti käyttäen
    // then notaatiota


    fetch('https://reqres.in/api/users?page=2')
    .then((response) => {
        console.log('Vastaus')
        console.log(response)
      if (!response.ok) {
        throw new Error('Verkkovastaus ei ollut kunnossa');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Fetch-operaatiossa ilmeni ongelma:', error);
    });
  
} 

async function asynchronousFunction2() {
    try {
      const response = await fetch('https://reqres.in/api/users?page=2');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Virhe:', error);
    }
  }
  
 

asynchronousFunction2();
//synchronousFunction();
//synchronousFunction2();

asynchronousFunction();