const checkboxTheme = document.getElementById("themeCheckbox");

checkboxTheme.addEventListener("change", () => {
    document.body.classList.toggle("dark", checkboxTheme.checked());
});
