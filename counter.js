export function setupCounter(element) {
  
  
  let counter = 0
  const setCounter = (count) => {
  console.log(' I am here');
  }
  element.addEventListener('click', () => setCounter());
}