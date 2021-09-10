"use strict";

// Tabs on edit page
function changeTab(event, itemName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  // console.log(tabcontent.length);

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(itemName).style.display = "block";
  event.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and set as default selected
document.getElementById("defaultOpen").click();

// Sliders on edit page
function ingredientSlider() {
  let count = document.querySelectorAll(".ingredientSlider").length;
  const slider = document.querySelectorAll(".ingredientSlider");
  const output = document.querySelectorAll(".ingredientsOutput");
  for (let i = 0; i < count; i++) {
    output[i].innerHTML = slider[i].value;
    slider[i].oninput = function () {
      output[i].innerHTML = this.value;
    };
  }
}

function toppingsSlider() {
  let count = document.querySelectorAll(".toppingsSlider").length;
  const slider = document.querySelectorAll(".toppingsSlider");
  const output = document.querySelectorAll(".toppingsOutput");
  for (let i = 0; i < count; i++) {
    output[i].innerHTML = slider[i].value;
    slider[i].oninput = function () {
      output[i].innerHTML = this.value;
    };
  }
}

ingredientSlider();
toppingsSlider();
