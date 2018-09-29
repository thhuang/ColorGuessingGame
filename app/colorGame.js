var squares = document.querySelectorAll(".square");
var colorDisplay = document.querySelector("#colorDisplay");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var easyButton = document.querySelector("#easyButton");
var mediumButton = document.querySelector("#mediumButton");
var hardButton = document.querySelector("#hardButton");
var modeButtons = document.querySelectorAll(".mode");
var hovorButton = document.querySelector("button:hover");

var selectedButton = findSelectedButton();
var numSquares = getSquareNumber(selectedButton);
var bodyBackgroundColor = document.body.style.backgroundColor;
var h1DefaultBackgroundColor = h1.style.backgroundColor;
var h1DefaultColor = h1.style.color;

var colors;
var pickedColor;

init();

function init() {
  setupButtons();
  setupSquares();
  resetColors();
}

function setupSquares () {
  squares.forEach(function(ele, i) {
    ele.addEventListener("click", function() {
      if (ele.style.backgroundColor === pickedColor) {
        // messageDisplay.textContent = "Correct!";
        var textColor = autoTextColor(pickedColor)
        resetButton.textContent = "Play Again";
        selectedButton.style.backgroundColor = pickedColor;
        selectedButton.style.color = textColor;
        h1.style.backgroundColor = pickedColor;
        h1.style.color = textColor;
        changeAllColors();
      } else {
        // messageDisplay.textContent = "Try Again";
        ele.style.backgroundColor = bodyBackgroundColor;
      }
    });
  });
}

function setupButtons() {
  resetButton.addEventListener("click", function() {
    resetColors();
  });

  modeButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      if (!btn.classList.contains("selected")) {
        selectedButton = btn;
        selectMode();
        resetColors(getSquareNumber(btn));
      }
    });
  });
}

function pickColor(colorArray) {
  var randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
}

function changeAllColors() {
  squares.forEach(function(ele) {
    ele.style.backgroundColor = pickedColor;
  });
}

function generateRandomColors(num) {
  var colorArray = [];
  for (var i = 0; i < num; i++) {
    colorArray.push(randomColor());
  }
  return colorArray;
}

function randomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function autoTextColor(color) {
  color = color.split(",");
  var r = color[0].split("(")[1];
  var g = color[1];
  var b = color[2].split(")")[0];
  var luminance = (0.299*r + 0.587*g + 0.114*b) / 256;
  if (luminance < 0.5) {
    return "white";
  } else {
    return "black";
  } 
}

function selectMode() {
  modeButtons.forEach(function(btn) {
    if (selectedButton === btn) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

function resetColors(num) {
  if (num) {
    numSquares = num;
  }
  colors = generateRandomColors(numSquares);
  squares.forEach(function(ele, i) {
    if (colors[i]) {
      ele.style.backgroundColor = colors[i];
      ele.style.display = "block";
    } else {
      ele.style.display = "none";
    }
  });

  pickedColor = pickColor(colors);
  colorDisplay.textContent = pickedColor;
  
  resetButton.textContent = "New Colors";
  h1.style.backgroundColor = null;
  h1.style.color = null;
  modeButtons.forEach(function(ele) {
    ele.style.backgroundColor = null;
    ele.style.color = null;
  });
}

function findSelectedButton() {
  var selectedButton;
  modeButtons.forEach(function(btn) {
    if (btn.classList.contains("selected")) {
      selectedButton = btn;
    }
  });
  return selectedButton;
}

function getSquareNumber(btn) {
  if (btn.textContent === "Easy") {
    return 3;
  } else if (btn.textContent === "Medium") {
    return 6;
  } else {
    return 9;
  }
}