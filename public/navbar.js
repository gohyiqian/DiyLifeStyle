// Navbar Button Toggler for Phone screen size
const navbarBtn = document.querySelector(".navbar");

function navToggle(e) {
  //   console.log("hello");
  const tabTarget = document.querySelector(".navbar-collapse");
  tabTarget.classList.toggle("collapse");
}

navbarBtn.removeEventListener("click", navToggle);
navbarBtn.addEventListener("click", navToggle);
