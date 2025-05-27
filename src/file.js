const button = document.getElementById("user-menu-button");
  const menu = document.getElementById("user-dropdown");

  //Display menu on click
  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  //Hide menu when clicking outside
  window.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });