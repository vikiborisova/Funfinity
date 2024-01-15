const words = ["apple", "banana", "cherry", "grape", "kiwi", "lemon", "melon", "orange", "peach", "pear", "plum", "strawberry"];

let word = words[Math.floor(Math.random() * words.length)];
console.log(word);

const submitBtn = document.getElementById("submit");
const guessInput = document.getElementById("guess");
const guessList = document.getElementById("guess_list");
