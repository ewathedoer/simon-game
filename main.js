var stepNumber = 5;
var not = "";
var pattern = [];
var patternByUser = [];
var mode = "normal";
var user;
var computer;
var turn = "C";
var loopObject = null;

// random from min-max excluding max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// preset the expected pattern for a round
function generatePlayPattern() {
  pattern = [];
  for(var i = 0; i<20; i++) {
    pattern.push(getRandomInt(1,5));
  }
  console.log(pattern);
}

// setting timeout for playing sounds in a row in playPattern()
function loopThroughArray(array, callbackElement, callbackFinished, interval) {
  var currentArray = array.slice(0, stepNumber);
  loopObject = new LoopTimer(function (time) {
    if (currentArray.length > 0) {
      var element = currentArray.shift();
      callbackElement(element);
    }
    else {
      callbackFinished();
      loopObject.stop();
    }
  }, interval);
  var start = loopObject.start();
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
  loopThroughArray(pattern, function (arrayElement) {
    // this part is executed for each pattern element
    $("#btn-" + arrayElement).trigger("play");
    console.log(arrayElement);  
  }, function() {
    // this part is executed when pattern play has finished
    console.log("loop finished");
    $(".buttons a").removeClass("disabled");
  }, 1000);
  // prevent user from clicking while pattern being played
  $(".buttons a").addClass("disabled");
}

function displayNotification() {
  
}

function restart() {
  // stop previous pattern
  loopObject.stop();

  generatePlayPattern();
  stepNumber = 1;
  playPattern();
}

function timeOver() {
  
}

function strictMode() {
  
}



$(document).ready(function() {
  generatePlayPattern();
  
  $("#play-btn").on("click", function() {
    $(".start").addClass("hidden");
    $(".info").removeClass("hidden");
    
    playPattern();
  });
  
  // trigger sound while the buttons clicked
  $(".buttons a").on("click", function() {
    if ($(".buttons a").hasClass("disabled")) { 
      return false;
    } else {
      $("#"+$(this).data("id")).trigger("play");
      console.log($("#"+$(this).data("id")));
    }
  });
  
  // restart
  $(".restart").on("click", function() {
    restart();
    $("#step-count").text(stepNumber);
  })
  
  $("#step-count").text(stepNumber);
  $("#not").text(not);
  
  
  
  
});
