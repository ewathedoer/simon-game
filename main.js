var stepNumber = 5;
var notification = "";
var pattern = [];
var patternByUser = [];
var mode = "normal";
var user;
var computer;
var turn = "C";

// random from min-max excluding max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// preset the expected pattern for a round
function generatePlayPattern() {
  for(var i = 0; i<20; i++) {
    pattern.push(getRandomInt(1,5));
  }
}

// setting timeout for playing sounds in a row in playPattern()
function loopThroughArray(array, callback, interval) {
  var currentArray = array.slice(0, stepNumber);
  var newLoopTimer = new LoopTimer(function (time) {
    if (currentArray.length > 0) {
      var element = currentArray.shift();
      callback(element, time - start);
    }
  }, interval);
  var start = newLoopTimer.start();
};

// Timer 
function LoopTimer(render, interval) {
  var timeout;
  var lastTime;

  this.start = startLoop;
  this.stop = stopLoop;

  // Start Loop
  function startLoop() {
    timeout = setTimeout(createLoop, 0);
    lastTime = Date.now();
    return lastTime;
  }

  // Stop Loop
  function stopLoop() {
    clearTimeout(timeout);
    return lastTime;
  }

  // The actual loop
  function createLoop() {
    var thisTime = Date.now();
    var loopTime = thisTime - lastTime;
    var delay = Math.max(interval - loopTime, 0);
    timeout = setTimeout(createLoop, delay);
    lastTime = thisTime + delay;
    render(thisTime);
  }
}

function playPattern() {
  //for (var i = 0; i < stepNumber; i++) {
    loopThroughArray(pattern, function (arrayElement, loopTime) {
      $("#btn-" + arrayElement).trigger("play");
      console.log(arrayElement);  
    }, 1000);

  //}
}

function compiMove() {
  
}

function reset() {
  
}

function timeOver() {
  
}

function strictMode() {
  
}



$(document).ready(function() {
  $("#play-btn").on("click", function() {
    $(".start").addClass("hidden");
    $(".info").removeClass("hidden");
  });
  
  // trigger sound while the buttons clicked
  $(".buttons a").on("click", function() {
    $("#"+$(this).data("id")).trigger("play");
  });
  
  generatePlayPattern();
  console.log(pattern);
  
  playPattern();
});
