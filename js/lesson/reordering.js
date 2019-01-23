(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.options = JSON.parse(localStorage.getItem("wanikaniAugmenter.options"));
  wanikaniAugmenter.data = JSON.parse(localStorage.getItem("wanikaniAugmenter.data"));

  wanikaniAugmenter.toggleReorderButton = function(override) {
    if($("#quiz").css("display") === "none" && override === "on") {
      reorderItems();
    } else {
      $("#reorderingButton").css({"display": "none"});
    }
  };

  wanikaniAugmenter.reorderItems = function() {
    wanikaniAugmenter.toggleReorderButton("off");

    var lessonIndex = $.jStorage.get("l/lessonIndex");
    var lastRead = $.jStorage.get("l/lastRead");
    var currentLesson = $.jStorage.get("l/currentLesson");
    var batchSize = $.jStorage.get("l/batchSize");

    var activeQueue = $.jStorage.get("l/activeQueue");
    var lessonQueue = $.jStorage.get("l/lessonQueue");
    var completeQueue = activeQueue.concat(lessonQueue);

    priorityQueue = [];
    $.each(wanikaniAugmenter.options.lesson.priority, function(id, value) {
      position = completeQueue.map(function(element) { return element.kan || element.voc; }).indexOf(value);
      priorityQueue.push(completeQueue.splice(position,1)[0]);
    });

    radicalsQueue = completeQueue.filter(filterByType("rad")) || {};
    kanjiQueue = completeQueue.filter(filterByType("kan")) || {};
    vocabularyQueue = completeQueue.filter(filterByType("voc")) || {};

    completeQueue = priorityQueue;
    for (var i = 0; i < wanikaniAugmenter.options.lesson.reordering.sequence.length; i++) {
      completeQueue = completeQueue.concat(window[wanikaniAugmenter.options.lesson.reordering.sequence[i] + "Queue"]);
    }

    var newActiveQueue = completeQueue.splice(0,batchSize);
    var newLessonQueue = completeQueue;
    var newCurrentLesson = newActiveQueue[0];

    $.jStorage.set("l/activeQueue", newActiveQueue);
    $.jStorage.set("l/lessonQueue", newLessonQueue);
    $.jStorage.set("l/currentLesson", newCurrentLesson);
    $.jStorage.set("l/lastRead", -1);
    $.jStorage.set("l/lessonIndex", 0);
  };

  function filterByType(type) {
    return function(element, id, array) {
      if(element !== null && typeof element[type] === 'string') {
        return element;
      }
    };
  }

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

$("#reorderingButton").on("click", function() {
  wanikaniAugmenter.reorderItems();
});
