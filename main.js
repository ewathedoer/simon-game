var stepNumber = 1;
var not = "";
var pattern = [];
var patternByUser = [];
var mode = "normal";
var usersTurn = false;
var loopObject = null;
var mistakenSound = false;
var strictFlag = false;

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

  //Start Loop
  function startLoop() {
    timeout = setTimeout(createLoop, 0);
    lastTime = Date.now();
    return lastTime;
  }

  //Stop Loop
  function stopLoop() {
    clearTimeout(timeout);
    return lastTime;
  }

  //The actual loop
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
    displayNotification(mistakenSound ? "Try harder, listen!" : "You're good!");
  } 
  
  loopThroughArray(pattern, function (arrayElement) {
    //this part is executed for each pattern element
    $("#btn-" + arrayElement).trigger("play");
    $(".btn-" + arrayElement).addClass("animated flash attention-btn");
    setTimeout(function(){
      $(".buttons a").removeClass("animated flash attention-btn");
    }, 500); 
  }, function() {
    //this part is executed when pattern play has finished
    mistakenSound = false;
    displayNotification("Good luck!");
    patternByUser = [];
    $(".buttons a").removeClass("disabled");
    usersTurn = true;
  }, 1000);
  //prevent user from clicking while pattern being played
  usersTurn = false;
  $(".buttons a").addClass("disabled");
}

function displayNotification(hint) {
  $("#not").text(hint);
}

function restart(restartBtnPressed) {
  //stop previous pattern
  loopObject.stop();

  mistakenSound = false;
  
  //mode restart only after restart button pressed
  
  if (restartBtnPressed) {
    strictFlag = false;
    $('.strict-tgl input[type=checkbox]').bootstrapToggle('off');
  }
  
  generatePlayPattern();
  stepNumber = 1;
  playPattern();
  patternByUser = [];
}

function userMadeMistake() {
  //prevent user from clicking while pattern being played
  usersTurn = false;
  $(".buttons a").addClass("disabled");
  
  mistakenSound = true;

  //notify about mistake and repeat the pattern
  setTimeout(function() {
    $("#mistake").trigger("play");
    displayNotification("Upss...");
  }, 1000);

  //mode variations
  if (strictFlag) {
    setTimeout(function() {
      restart(false);  
    }, 2000);

  } else {
    setTimeout(function() {
      playPattern();
    }, 3000);
  }
}

//allow to play the same sound simultaneously 
//hack based on the accepted answer to http://stackoverflow.com/questions/6893080/html5-audio-play-sound-repeatedly-on-click-regardless-if-previous-iteration-h
function playAudio(audioElement) {
  var audio = document.createElement("audio");
  audio.src = audioElement.attr("src");
  audio.addEventListener("ended", function() {
    document.body.removeChild(this);
  }, false);
  document.body.appendChild(audio);
  audio.play();
}

//make toggle accessible
function accessibleToggle(checkbox, ariaLabel, label) {
  var targetItem = checkbox.parent(".toggle.btn");
  targetItem.attr({
    "tabindex": 1,
    "aria-label": ariaLabel
  });
  targetItem.on("keyup", function(e) {
    //keyup in ASCII code == which
    if(e.which == 13) {
      checkbox.bootstrapToggle("toggle");  
    }
  });
  label.on("click", function() {
    checkbox.bootstrapToggle("toggle"); 
  });
}


$(document).ready(function() {
  generatePlayPattern();
  accessibleToggle($(".strict-tgl input"), "strict mode", $("#toggle-label"));
  
  $("#play-btn").on("click", function() {
    $(".start").addClass("hidden");
    //show restart
    $(".restart").removeClass("invisible");
  
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
        //$("#"+$(this).data("id")).trigger("play");
        playAudio($("#"+$(this).data("id")));
            
        $("."+$(this).data("id")).addClass("animated flash attention-btn");
        setTimeout(function(){
          $(".buttons a").removeClass("animated flash attention-btn");
        }, 500);
        
      //save pattern numbers played by a user
        patternByUser.push(parseInt($(this).data("id").slice(4)));
      } 
      
      //check the user's choices with the pattern
      var differentElement = false;
      for (var i=0; i<patternByUser.length; i++) {
        if (patternByUser[i] != pattern[i]) {
          differentElement = true;
        }   
      }
      //few steps are still missing and a user made a mistake (regular mode)
      if (differentElement) {
        userMadeMistake();
        return false;
      }
      
      if (patternByUser.length == stepNumber) {
        $(".buttons a").addClass("disabled");
        
        //it's the last step and a user got it right
        if (!differentElement && stepNumber == 20) {
          displayNotification("Congrats! You won!");
          
          setTimeout(function() {
            $("#victory").trigger("play");
          }, 1000);
          
          setTimeout(function(){
            restart(false);
          }, 7000);
        } 
        //few steps are still missing and a user got correct
        else if (!differentElement && stepNumber < 20) {
          //add new step and play the pattern
          stepNumber += 1;
          
          setTimeout(function() {
            playPattern();
          }, 1000);
        } 
      }
    }
    return false;
  });
  
  //restart
  $(".restart").on("click", function() {
    restart(true);
    $("#step-count").text(stepNumber);
  })
  
  $("#step-count").text(stepNumber);
  displayNotification();
  
  //strict mode toggle
  $('.strict-tgl input[type=checkbox]').on("change", function() {
    strictFlag = $(this).prop('checked');
  });
  
});
