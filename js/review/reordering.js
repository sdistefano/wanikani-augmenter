(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.radicals = [];
  wanikaniAugmenter.kanji = [];
  wanikaniAugmenter.vocabulary = [];

  wanikaniAugmenter.currentRadicals;
  wanikaniAugmenter.currentKanji;
  wanikaniAugmenter.currentVocabulary;

  wanikaniAugmenter.unburnedRadicals;
  wanikaniAugmenter.unburnedKanji;
  wanikaniAugmenter.unburnedVocabulary;

  wanikaniAugmenter.burnableRadicals;
  wanikaniAugmenter.burnableKanji;
  wanikaniAugmenter.burnableVocabulary;

  wanikaniAugmenter.reorder = function() {
    if($.jStorage.get("r/wrap-up")) return 0;
    completeSet = $.jStorage.get("activeQueue").concat($.jStorage.get("reviewQueue"));

    wanikaniAugmenter.radicals.length = 0; wanikaniAugmenter.kanji.length = 0; wanikaniAugmenter.vocabulary.length = 0;
    $.each(completeSet, function(id, element) {
      if(element !== null) {
        if(element.rad) wanikaniAugmenter.radicals.push(element);
        if(element.kan) wanikaniAugmenter.kanji.push(element);
        if(element.voc) wanikaniAugmenter.vocabulary.push(element);
      }
    });

    wanikaniAugmenter.currentRadicals     = wanikaniAugmenter.radicals.filter(narrowResultsBy("rad", wanikaniAugmenter.data.radicals.current[0][1])).sort(sortBySrs);
    wanikaniAugmenter.currentKanji        = wanikaniAugmenter.kanji.filter(narrowResultsBy("kan", wanikaniAugmenter.data.kanji.current[0][1])).sort(sortBySrs);
    wanikaniAugmenter.currentVocabulary   = wanikaniAugmenter.vocabulary.filter(narrowResultsBy("voc", wanikaniAugmenter.data.vocabulary.current[0][1])).sort(sortBySrs);
    wanikaniAugmenter.unburnedRadicals    = wanikaniAugmenter.radicals.filter(narrowResultsBy("rad", wanikaniAugmenter.data.radicals.unburned[0][1])).sort(sortBySrs);
    wanikaniAugmenter.unburnedKanji       = wanikaniAugmenter.kanji.filter(narrowResultsBy("kan", wanikaniAugmenter.data.kanji.unburned[0][1])).sort(sortBySrs);
    wanikaniAugmenter.unburnedVocabulary  = wanikaniAugmenter.vocabulary.filter(narrowResultsBy("voc", wanikaniAugmenter.data.vocabulary.unburned[0][1])).sort(sortBySrs);
    wanikaniAugmenter.burnableRadicals    = wanikaniAugmenter.radicals.filter(narrowResultsBy("rad", wanikaniAugmenter.data.radicals.burnable[0][1])).sort(sortBySrs);
    wanikaniAugmenter.burnableKanji       = wanikaniAugmenter.kanji.filter(narrowResultsBy("kan", wanikaniAugmenter.data.kanji.burnable[0][1])).sort(sortBySrs);
    wanikaniAugmenter.burnableVocabulary  = wanikaniAugmenter.vocabulary.filter(narrowResultsBy("voc", wanikaniAugmenter.data.vocabulary.burnable[0][1])).sort(sortBySrs);

    var completeQueue = [];
    for (var i = 0; i < wanikaniAugmenter.options.review.reordering.sequence.length; i++) {
      var splitString = wanikaniAugmenter.options.review.reordering.sequence[i].split(" ");

      var type = splitString[0];
      var category = splitString[1].charAt(0).toUpperCase() + splitString[1].slice(1);

      completeQueue = completeQueue.concat(wanikaniAugmenter[type + category]);
    }

    var newActiveQueue = completeQueue.splice(0, 10);
    var newCurrentItem = newActiveQueue[0];

    $.jStorage.set("reviewQueue", completeQueue);
    $.jStorage.set("currentItem", newCurrentItem);
    $.jStorage.set("activeQueue", newActiveQueue);

    if(newCurrentItem.rad) {
      var element = $("#user-response");
      $.jStorage.set("questionType", "meaning");
      wanakana.unbind(element[0]);
      element.attr("placeholder", "Your Response");
      element.removeAttr("lang");
    }
  }

  function sortBySrs(a, b) {
    return a.srs > b.srs ? 1 : -1;
  }

  function narrowResultsBy(type, containingArray) {
    return function(element, id, array) {
      if(element && $.inArray((type == "rad" ? element.en[0] : element[type]), containingArray) >= 0) {
        return element;
      }
    };
  }

  wanikaniAugmenter.watchingToDetermineReorder = wanikaniAugmenter.watchingToDetermineReorder || false;
  wanikaniAugmenter.startWatching = function() {
    if(wanikaniAugmenter.watchingToDetermineReorder === false) {
      $.jStorage.listenKeyChange("currentItem", function() {
        wanikaniAugmenter.reorderDetermination();
      });
      wanikaniAugmenter.watchingToDetermineReorder = true;
    }
  }

  wanikaniAugmenter.changedTimes = wanikaniAugmenter.changedTimes || 0;
  wanikaniAugmenter.reorderDetermination = function() {
    wanikaniAugmenter.changedTimes++;
    if(wanikaniAugmenter.changedTimes === 8) {
      wanikaniAugmenter.reorder();
      wanikaniAugmenter.changedTimes = 0;
    }
  }

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

$("#reorderingButton").on("click", function(event) {
  wanikaniAugmenter.reorder();
  wanikaniAugmenter.startWatching();
});
