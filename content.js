
// press space to go to next
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.stopPropagation();
    e.preventDefault();

    alert("Space pressed");
  }
});
