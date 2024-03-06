// Imported "words" (5 letter words) from another codepen
// Imported "Array.random()" from another codepen that selects a random word from list and returns the word and its associated index

// Clearing console for debugging
console.clear();

const entries = document.querySelectorAll(".entry"),
  letterKeys = document.querySelectorAll(".letter-key"),
  modal = document.querySelector(".modal");
let row = 0,
  col = 0,
  word = [], // correct word
  guess = [], // entered word
  correctLettersGuessed = new Set(),
  hasWon = false,
  gameOver = false;

const Colors = {
  green: getComputedStyle(document.documentElement).getPropertyValue("--green"),
  yellow: getComputedStyle(document.documentElement).getPropertyValue(
    "--yellow"
  ),
  darkGray: getComputedStyle(document.documentElement).getPropertyValue(
    "--darkgray"
  )
};

newWord(); // initial call

// Keyboard button listeners
const keys = document.querySelectorAll(".key");
keys.forEach((key) => {
  key.addEventListener("click", () => {
    keyPress(key.dataset.key);
  });
});
document.addEventListener("keydown", function (event) {
  keyPress(event.key);
});

// Runs when a key is pressed and calls the appropriate command
function keyPress(key) {
  key = key.toLowerCase();
  if (!validateKey(key)) return;
  runPressedAnimationFor(key);
  if (!hasWon && !gameOver) {
    if (key === "enter") {
      submitWord();
    } else if (key === "backspace") {
      backspace();
    } else {
      addLetter(key);
    }
  }
  if (key === "newword") {
    newWord();
  }
  if (key === "giveup") {
    giveUp();
  }
}

// Adds a letter to the DOM and the guess array
function addLetter(letter) {
  if (isLetter(letter) && guess.length < 5) {
    const square = entries[row].children[col];
    runLetterInputAnimationFor(square);
    square.innerHTML = letter.toUpperCase();
    guess.push(letter);
    col++;
  }
}

// Reverse of addLetter bc of position of col
function backspace() {
  if (guess.length > 0) {
    col--;
    guess.pop();
    entries[row].children[col].innerHTML = "";
  }
}

// Called when the submit button or enter is pressed
// Verifies that the guess is a valid length and word
// Checks it against the answer word and updates the DOM accordingly
function submitWord() {
  if (guess.length < 5) {
    runRowShakeAnimation();
    sendMessage("Not enough letters");
  } else if (!words.includes(guess.join("").toLowerCase())) {
    runRowShakeAnimation();
    sendMessage("Not in word list");
  } else {
    const result = checkGuess();
    showResult(result);
    if (row === 5 && !hasWon) {
      gameOver = true;
      setTimeout(() => {
        sendMessage("The word was: " + word.join(""), 0.6);
      }, 2000);
    }
    if (hasWon) {
      let message = "";
      if (row === 0) {
        message = "INCREDIBLE!!!";
      } else if (row === 1) {
        message = "Amazing!!";
      } else if (row === 2) {
        message = "Yippee!";
      } else if (row === 3) {
        message = "Well done";
      } else if (row === 4) {
        message = "Nice";
      } else {
        message = "Phew";
      }
      setTimeout(() => {
        sendMessage(message);
      }, 3300);
    }
    // reset guess
    row++;
    col = 0;
    guess = [];
  }
}

// is the letter correct?
// is letter in the word?
// is letter in right spot?
function checkGuess() {
  const diff = [];
  const letterCount = countLetters();

  // mark correct letters
  for (let i = 0; i < 5; i++) {
    guessLetter = guess[i];
    ansLetter = word[i];
    if (guessLetter === ansLetter) {
      diff.push("correct");
      correctLettersGuessed.add(guessLetter);
      letterCount[guessLetter] -= 1;
    } else {
      diff.push("absent");
    }
  }

  // mark wrong position letters w/o overriding correct letters
  for (let i = 0; i < 5; i++) {
    guessLetter = guess[i];
    if (
      word.includes(guessLetter) &&
      diff[i] !== "correct" &&
      letterCount[guessLetter] > 0
    ) {
      diff[i] = "wrong-position";
      letterCount[guessLetter] -= 1;
    }
  }

  return diff;
}

// Shows the results on the DOM both on the word and keyboard
function showResult(result) {
  for (let i = 0; i < 5; i++) {
    const letter = entries[row].children[i];
    // const key = document.querySelector(`[data-key='${guess[i]}']`);
    // letter.classList.add(result[i]);
    // key.classList.add(result[i]);
    runRevealGuessAnimationFor(result);
  }
  if (word.join("") === guess.join("")) {
    hasWon = true;
    runVictoryAnimation();
  }
}

// Resets the game and chooses a new word
function newWord() {
  entries.forEach((entry) => {
    Array.from(entry.children).forEach((letter) => {
      letter.innerHTML = "";
      letter.className = "letter empty";
    });
  });
  letterKeys.forEach((key) => {
    key.className = "key letter-key";
    key.style.backgroundColor = "white";
    key.style.color = "black";
  });
  row = 0;
  col = 0;
  guess = [];
  correctLettersGuessed = new Set();
  const [randomWord, idx] = words.random();
  word = randomWord.split("");
  index = idx;
  hasWon = false;
  gameOver = false;
  // console.log(word.join("")); // If you see this this uncomment for the answer ;)
}

// gives up :(
function giveUp() {
  sendMessage("The word was: " + word.join(""));
  setTimeout(() => {
    newWord();
  }, 2000);
}

// Sends a message to the screen
function sendMessage(msg, duration = 0.1) {
  modal.innerHTML = msg;
  runModalAnimation(duration);
}

// Utility function to check if the string is actually a valid usable key
// Used so the user cannot input weird characters & mess with things
function validateKey(key) {
  
  if (
    isLetter(key) ||
    key === "enter" ||
    key === "backspace" ||
    key === "newword" ||
    key === "giveup"
  ) {
    return true;
  } else {
    return false;
  }
}

// Helper for above function to check if key is a letter
function isLetter(str) {
  return str.length === 1 && str.match(/[a-zA-Z]/i);
}

// Utility function that creates a map of the frequency of each
// letter in a guess. This is used when checking the guess against
// the real answer
function countLetters() {
  const counts = {};
  for (const letter of word) {
    if (counts[letter]) {
      counts[letter] += 1;
    } else {
      counts[letter] = 1;
    }
  }
  return counts;
}

// GSAP ANIMATIONS :D

function runPressedAnimationFor(key) {
  const keyDOM = document.querySelector(`[data-key='${key}']`);
  const duration = 0.08;
  gsap.to(keyDOM, {
    scale: 0.9,
    duration,
    onComplete: function () {
      gsap.to(keyDOM, {
        scale: 1,
        duration
      });
    }
  });
}

function runLetterInputAnimationFor(square) {
  const duration = 0.08;
  gsap.to(square, {
    scale: 1.15,
    duration,
    onComplete: function () {
      gsap.to(square, {
        scale: 1,
        duration
      });
    }
  });
}

function runRevealGuessAnimationFor(result) {
  const timeline = gsap.timeline();
  const duration = 0.15;
  for (let i = 0; i < 5; i++) {
    const letter = entries[row].children[i];
    timeline
      .to(letter, {
        scaleX: 0,
        duration,
        onComplete: function () {
          letter.classList.add(result[i]);
        }
      })
      .to(letter, {
        scaleX: 1,
        duration
      });
  }
  timeline.add("keys1");
  for (let i = 0; i < 5; i++) {
    const key = document.querySelector(`[data-key='${guess[i]}']`);
    let backgroundColor = key.style.backgroundColor;
    if (result[i] === "correct") {
      backgroundColor = Colors.green;
    }
    if (!correctLettersGuessed.has(guess[i])) {
      if (result[i] === "wrong-position") {
        backgroundColor = Colors.yellow;
      }
      if (result[i] === "absent") {
        backgroundColor = Colors.darkGray;
      }
    }

    timeline
      .to(
        key,
        {
          scale: 0,
          duration: duration
        },
        "keys1"
      )
      .set(key, {
        backgroundColor,
        color: "white"
      });
  }
  timeline.add("keys2");
  for (let i = 0; i < 5; i++) {
    const key = document.querySelector(`[data-key='${guess[i]}']`);
    timeline.to(
      key,
      {
        scale: 1,
        duration: duration
      },
      "keys2"
    );
  }
  timeline.play();
}

function runModalAnimation(duration) {
  gsap.to(modal, {
    scale: 1,
    ease: "elastic.out(1, 0.7)",
    onComplete: function () {
      gsap.to(modal, {
        scale: 0,
        delay: duration,
        ease: "elastic.in(1, 0.7)"
      });
    }
  });
}

function runRowShakeAnimation() {
  const rowDOM = entries[row];
  gsap.to(rowDOM, {
    x: -5,
    duration: 0.05,
    ease: "linear",
    onComplete: function () {
      gsap.to(rowDOM, {
        x: 0,
        duration: 0.5,
        ease: "elastic(4, 0.2)"
      });
    }
  });
}

function runVictoryAnimation() {
  const lettersDOM = entries[row].children;
  const overlayDOM = document.querySelector("#overlay");
  const timeline = gsap.timeline();

  // Makes the letters appear on top of the rest
  for (let i = 0; i < 5; i++) {
    // lettersDOM[i].style.zIndex = 20;
    timeline.set(lettersDOM[i], { zIndex: 20 });
  }

  // Mimics an explosion of letters by setting positions
  timeline.add("explode");
  const startDelay = 1.6;
  const explodePos = [
    { x: -50, y: -40, rotation: -245 },
    { x: -3, y: 60, rotation: -260 },
    { x: 10, y: -50, rotation: -220 },
    { x: 30, y: 80, rotation: 260 },
    { x: 50, y: -10, rotation: 240 }
  ];

  // Creates dark overlay
  overlayDOM.style.display = "flex";
  timeline.to(
    overlayDOM,
    {
      opacity: 0.5,
      duration: 0.5,
      delay: startDelay
    },
    "explode"
  );

  // Tweens the letters to explosion positions
  for (let i = 0; i < 5; i++) {
    timeline.to(
      lettersDOM[i],
      {
        x: explodePos[i].x,
        y: explodePos[i].y,
        rotation: explodePos[i].rotation,
        ease: "power2.out",
        duration: 0.6,
        delay: startDelay
      },
      "explode"
    );
  }

  // Brings letters back together
  timeline.add("together");
  for (let i = 0; i < 5; i++) {
    timeline.to(
      lettersDOM[i],
      {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: "elastic.out(0.7, 0.7)"
      },
      "together"
    );
  }

  // Scales the letters up and widens the gaps
  timeline.add("scale");
  for (let i = 0; i < 5; i++) {
    const factor = 20;
    let x = 0;
    if (i === 0) {
      x = -factor * 2;
    } else if (i === 1) {
      x = -factor;
    } else if (i === 3) {
      x = factor;
    } else if (i === 4) {
      x = factor * 2;
    }
    timeline.to(
      lettersDOM[i],
      {
        scale: 1.2,
        x,
        duration: 0.7,
        delay: 0.1
      },
      "together"
    );
  }

  // Brings everything back to normal
  timeline.add("return");
  for (let i = 0; i < 5; i++) {
    timeline.to(
      lettersDOM[i],
      {
        scale: 1,
        x: 0,
        duration: 0.1
      },
      "return"
    );
  }

  // Removes the dark overlay
  timeline.to(overlayDOM, {
    opacity: 0,
    duration: 0.5
  });

  setTimeout(() => {
    overlayDOM.style.display = "none";
  }, 4000);

  // Resets the z-indexes
  for (let i = 0; i < 5; i++) {
    // setTimeout(() => {
    //   lettersDOM[i].style.zIndex = 10;
    // }, 4000);
    timeline.set(lettersDOM[i], { zIndex: 10, delay: 0.3 });
  }

  // Play the animation
  timeline.play();
}