// DARK THEME

function setInitialTheme() {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark");
        checkboxTheme.checked = true;
    } else {
        document.body.classList.remove("dark");
        checkboxTheme.checked = false;
    }
}
function toggleTheme() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}
const checkboxTheme = document.getElementById("themeCheckbox");
checkboxTheme.addEventListener("change", toggleTheme);


//SOUND
const soundCheckbox = document.getElementById('soundCheckbox');
const audioPlayer = document.getElementById('audioPlayer');
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
soundCheckbox.checked = soundEnabled;

function toggleSound() {
    if (soundCheckbox.checked) {
        
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    localStorage.setItem('soundEnabled', soundCheckbox.checked);
}

soundCheckbox.addEventListener("change", toggleSound);

window.addEventListener("pageshow", function (event) {
    setInitialTheme();
    soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    soundCheckbox.checked = soundEnabled;
    toggleSound();
});