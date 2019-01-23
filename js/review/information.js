(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.updateInformation = function() {
    var currentItem = $.jStorage.get("currentItem");

    $("#srsLevel").text(currentItem.srs);

    var radCount = 0, kanCount = 0, vocCount = 0;

    completeSet = $.jStorage.get("activeQueue").concat($.jStorage.get("reviewQueue"));

    for (var i = 0; i < completeSet.length; i++) {
      radCount += (completeSet[i] && completeSet[i].rad === undefined) ? 0 : 1;
      kanCount += (completeSet[i] && completeSet[i].kan === undefined) ? 0 : 1;
      vocCount += (completeSet[i] && completeSet[i].voc === undefined) ? 0 : 1;
    }

    $("#radicalCount").text(radCount);
    $("#kanjiCount").text(kanCount);
    $("#vocabularyCount").text(vocCount);
  };

  wanikaniAugmenter.watchingToUpdateInformation = wanikaniAugmenter.watchingToUpdateInformation || false;
  wanikaniAugmenter.startWatchingToUpdateInformation = function() {
    if(wanikaniAugmenter.watchingToUpdateInformation === false) {
      $.jStorage.listenKeyChange("activeQueue", wanikaniAugmenter.updateInformation);
      wanikaniAugmenter.watchingToUpdateInformation = true;
    }
  }

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

$(document).ready(function() {
  wanikaniAugmenter.updateInformation();
  wanikaniAugmenter.startWatchingToUpdateInformation();
});
