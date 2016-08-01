var stepNumber = 1;
var not = "";
var pattern = [];
var patternByUser = [];
var mode = "normal";
var usersTurn = false;
var loopObject = null;
var mistakenSound = false;

//random from min-max excluding max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//preset the expected pattern for a round
function generatePlayPattern() {
  pattern = [];
  for(var i=0; i<20; i++) {
    pattern.push(getRandomInt(1,5));
  }
  console.log(pattern);
}

//setting timeout for playing sounds in a row in playPattern()
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

//Timer 
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
  $("#step-count").text(stepNumber);
  
  if (stepNumber == 1) {
    displayNotification(mistakenSound ? "This sound." : "Let's start!");
  } else if(stepNumber <= 10) {
    displayNotification(mistakenSound ? "Listen again!" : "Great, listen now!");
  } else if (stepNumber > 10 && stepNumber <= 20) {
    displayNotification(mistakenSound ? "Try harder, listen!" : "You're better and better!");
  } 
  
  loopThroughArray(pattern, function (arrayElement) {
    // this part is executed for each pattern element
    $("#btn-" + arrayElement).trigger("play");
    console.log(arrayElement);  
  }, function() {
    // this part is executed when pattern play has finished
    console.log("loop finished");
    mistakenSound = false;
    displayNotification("Good luck!");
    patternByUser = [];
    $(".buttons a").removeClass("disabled");
    usersTurn = true;
  }, 1000);
  //prevent user from clicking while pattern being played
  $(".buttons a").addClass("disabled");
}

function displayNotification(hint) {
  $("#not").text(hint);
}

function restart() {
  // stop previous pattern
  loopObject.stop();

  generatePlayPattern();
  stepNumber = 1;
  playPattern();
  patternByUser = [];
}

function timeOver() {
  
}

function strictMode() {
  
}

function nowUser() {
  //check if they can play
  
  //each move checked with pattern
  
  //next move added
  
}



$(document).ready(function() {
  generatePlayPattern();
  
  $("#play-btn").on("click", function() {
    $(".start").addClass("hidden");
    $(".info").removeClass("hidden");
    
    playPattern();
  });
  
  //trigger sound while the buttons clicked
  $(".buttons a").on("click", function() {
    if ($(".buttons a").hasClass("disabled")) { 
      return false;
    } else if (usersTurn) {
      
      //when user starts clicking the buttons patternByUser equals an empty array
      if (patternByUser.length < stepNumber) {
        $("#"+$(this).data("id")).trigger("play");
      //save pattern numbers played by a user
        patternByUser.push(parseInt($(this).data("id").slice(4)));
      } 
      
      if (patternByUser.length == stepNumber) {
        $(".buttons a").addClass("disabled");
        //check the user's choices with the pattern
        var differentElement = false;
        for (var i=0; i<patternByUser.length; i++) {
          if (patternByUser[i] != pattern[i]) {
            differentElement = true;
          }   
        }
        
        //it's the last step and a user got it right
        if (!differentElement && stepNumber == 20) {
          displayNotification("Congratulations! You won!");
          
          setTimeout(function() {
            $("#victory").trigger("play");
          }, 1000);
          
          setTimeout(function(){
            restart();
          }, 9500);
        } 
        //few steps are still missing and a user got correct
        else if (!differentElement && stepNumber < 20) {
          console.log(differentElement);
          //add new step and play the pattern
          stepNumber += 1;
          
          setTimeout(function() {
            playPattern();
          }, 1000);
        } 
        //few steps are still missing and a user made a mistake (regular mode)
        else {
          mistakenSound = true;

          //notify about mistake and repeat the pattern
          setTimeout(function() {
            $("#mistake").trigger("play");
            displayNotification("Upss...");
          }, 1000);

          setTimeout(function() {
            playPattern();
          }, 3000);
        }
        
      }
      
      
      console.log($("#"+$(this).data("id")));
    }
  });
  
  //restart
  $(".restart").on("click", function() {
    restart();
    $("#step-count").text(stepNumber);
  })
  
  $("#step-count").text(stepNumber);
  displayNotification();
  
  
  
});
