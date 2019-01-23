(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.options = JSON.parse(localStorage.getItem("wanikaniAugmenter.options"));
  wanikaniAugmenter.data = JSON.parse(localStorage.getItem("wanikaniAugmenter.data"));

  wanikaniAugmenter.originalRandomFunction;
  wanikaniAugmenter.randomDisabled;
  wanikaniAugmenter.newRandomFunction = function() {return 0;};

  if(!wanikaniAugmenter.options.review.derandomizer && Math.random() === 0) {
    Math.random = wanikaniAugmenter.originalRandomFunction;
    wanikaniAugmenter.randomDisabled = false;
  }

  if(wanikaniAugmenter.originalRandomFunction === undefined) {
    wanikaniAugmenter.originalRandomFunction = Math.random;
  }

  if(wanikaniAugmenter.randomDisabled) {
    $("#derandomizerButton i").removeClass("icon-long-arrow-right").addClass("icon-random");
  } else {
    $("#derandomizerButton i").addClass("icon-long-arrow-right").removeClass("icon-random");
  }

  wanikaniAugmenter.toggleRandomeness = function(toggleButton) {
    if(Math.random() === 0) {
      Math.random = wanikaniAugmenter.originalRandomFunction;
      wanikaniAugmenter.randomDisabled = false;
    } else {
      Math.random = wanikaniAugmenter.newRandomFunction;
      wanikaniAugmenter.randomDisabled = true;
    }
    toggleButton.toggleClass("icon-long-arrow-right").toggleClass("icon-random");
  }


}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

$("#derandomizerButton").on("click", function(event) {
  wanikaniAugmenter.toggleRandomeness($(this).children(":first"));
});
