var squares = document.querySelectorAll(".square");
var colorDisplay = document.querySelector("#colorDisplay");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
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
        colorDisplay.style.color = textColor;
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

  colorDisplay.addEventListener("click", function() {
    colorDisplay.classList.toggle("cmyk");
    colorDisplay.textContent = getColorDisplay();
  });
}

function pickColor() {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function changeAllColors() {
  squares.forEach(function(ele) {
    ele.style.backgroundColor = pickedColor;
  });
}

function generateRandomColors(num) {
  var colorArray = [randomColor()];
  var evilColor;
  if (selectedButton.textContent === "Evil") {
    setupEvilSquares(true);
    while (colorArray.length < num) {
      evilColor = randomColor()
      if (colorError(colorArray[0], evilColor) < 0.3) {
        colorArray.push(evilColor);
      }
    }
  } else if (selectedButton.textContent === "Hard") {
    setupEvilSquares(false);
    while (colorArray.length < num) {
      hardColor = randomColor()
      if (colorError(colorArray[0], hardColor) < 0.8) {
        colorArray.push(hardColor);
      }
    }
  } else {
    setupEvilSquares(false);
    while (colorArray.length < num) {
      colorArray.push(randomColor());
    }
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

  pickedColor = pickColor();
  colorDisplay.textContent = getColorDisplay();
  
  resetButton.textContent = "New Colors";
  h1.style.backgroundColor = null;
  h1.style.color = null;
  colorDisplay.style.color = null;
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
  } else if (btn.textContent === "Hard") {
    return 9;
  } else if (btn.textContent === "Evil") {
    return 16;
  } else {
    return 1;
  }
}

function toCMYK(rgbColor) {
  rgbColor = rgbColor.split(",");
  var r = rgbColor[0].split("(")[1] / 255;
  var g = rgbColor[1] / 255;
  var b = rgbColor[2].split(")")[0] / 255;

  k = 1 - Math.max(r, g, b);
  if (k < 1) {
    c = Math.floor((1 - r - k) / (1 - k) * 100);
    m = Math.floor((1 - g - k) / (1 - k) * 100);
    y = Math.floor((1 - b - k) / (1 - k) * 100);
  } else {
    c = 0;
    m = 0;
    y = 0;
  }
  k = Math.floor(k * 100)
  return "cmyk(" + c + ", " + m + ", " + y + ", " + k + ")";
}

function getColorDisplay() {
  if (colorDisplay.classList.contains("cmyk")) {
    return toCMYK(pickedColor)
  } else {
    return pickedColor;
  }
}

function colorError(color1, color2) {
  color1 = color1.split(",");
  var r1 = color1[0].split("(")[1] / 255;
  var g1 = color1[1] / 255;
  var b1 = color1[2].split(")")[0] / 255;

  color2 = color2.split(",");
  var r2 = color2[0].split("(")[1] / 255;
  var g2 = color2[1] / 255;
  var b2 = color2[2].split(")")[0] / 255;

  return ((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)**0.5
}

function setupEvilSquares (isEvil=false) {
  squares.forEach(function(ele) {
    if (isEvil) {
      ele.classList.add("evilSquare");
    } else {
      ele.classList.remove("evilSquare");
    }
  });
}