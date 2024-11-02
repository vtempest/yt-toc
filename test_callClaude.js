import callClaude from './callClaude.js';

// from javascript.
async function example() {
  try {
    const response = await callClaude("Hello", " how are you?");
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
}

// OR from command line (uncomment these).
// console.log("starting");
// const response = await example();
// console.log(response);
// console.log("done");
