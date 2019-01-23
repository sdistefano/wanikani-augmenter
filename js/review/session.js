(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.toggleReviewElements = function() {
    if($("#wanikaniAugmenterInformation").length < 1) {
      $("#stats")
        .prepend(
          $("<span>", {id: "wanikaniAugmenterInformation"})
        );
    } else {
      $("#wanikaniAugmenterInformation").empty();
    }

    if(wanikaniAugmenter.options.review.reordering.enabled) {
      $("#wanikaniAugmenterInformation")
        .append(
          $("<span>", {id: "reorderingButton"})
            .prepend(
              $("<i>", {class: "icon-refresh"})
            ).css(
              {"cursor": "pointer"}
            )
        );
    } else {
      $("#reorderingButton").remove();
    }

    if(wanikaniAugmenter.options.review.deletion) {
      $("#answer-form > form > fieldset")
        .prepend(
          $("<button>", {id: "deleteButton"})
            .css(
              {
                "position": "absolute",
                "padding": "0 20px",
                "top": "10px",
                "left": "10px",
                "height": "3em",
                "background-color": "#fff",
                "font-size": "1.5em",
                "line-height": "1em",
                "border": "none"
              }
            ).append(
              $("<i>", {class: "icon-remove"})
            )
        );

      $("#question-type")
        .before(
          $("<div>", {id: "errorDisplay"})
            .append(
              $("<span>", {id: "meaningErrors"})
            ).append(
              $("<span>", {id: "readingErrors"})
            )
        );
    } else {
      $("#deleteButton").remove();
      $("#errorDisplay").remove();
      $(document).off("keydown.inReviews");
    }

    if(wanikaniAugmenter.options.review.derandomizer) {
      $("#wanikaniAugmenterInformation")
        .append(
          $("<span>", {id: "derandomizerButton"})
            .prepend(
              $("<i>", {class: "icon-long-arrow-right"})
            ).css(
              {"cursor": "pointer"}
            )
        );
    } else {
      $("#derandomizerButton").remove();
    }

    if(wanikaniAugmenter.options.review.information.srs) {
      $("#wanikaniAugmenterInformation")
        .append(
          $("<span>", {id: "srsInformation", text: "SRS "}).prepend($("<i>", {class: "icon-tasks"})).append($("<span>", {id: "srsLevel"}))
        );
    } else {
      $("#srsInformation").remove();
    }

    if(wanikaniAugmenter.options.review.information.radicals) {
      $("#wanikaniAugmenterInformation")
        .append(
          $("<span>", {id: "radicalInformation", text: "R "}).prepend($("<i>", {class: "icon-inbox"})).append($("<span>", {id: "radicalCount"}))
        );
    } else {
      $("#radicalInformation").remove();
    }

    if(wanikaniAugmenter.options.review.information.kanji) {
      $("#wanikaniAugmenterInformation")
        .append(
          $("<span>", {id: "kanjiInformation", text: "K "}).prepend($("<i>", {class: "icon-inbox"})).append($("<span>", {id: "kanjiCount"}))
        );
    } else {
      $("#kanjiInformation").remove();
    }

    if(wanikaniAugmenter.options.review.information.vocabulary) {
      $("#wanikaniAugmenterInformation")
        .append(
          $("<span>", {id: "vocabularyInformation", text: "V "}).prepend($("<i>", {class: "icon-inbox"})).append($("<span>", {id: "vocabularyCount"}))
        );
    } else {
      $("#vocabularyInformation").remove();
    }
  };

  wanikaniAugmenter.toggleLessonElements = function() {
    if($("#wanikaniAugmenterContainer").length < 1) {
      $("#stats ul")
        .prepend(
          $("<li>", {id: "wanikaniAugmenterContainer"})
        );
    } else {
      $("#wanikaniAugmenterContainer").empty();
    }

    if(wanikaniAugmenter.options.lesson.reordering.enabled) {
      $("#wanikaniAugmenterContainer")
        .append(
          $("<button>", {id: "reorderingButton"})
            .prepend(
              $("<i>", {class: "icon-refresh"})
            ).css(
              {"cursor": "pointer"}
            )
        );
    } else {
      $("#reorderingButton").remove();
    }
  };

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

$(window).on("dataInitialized", function() {
  $(document).ready(function() {
    if(window.location.href.indexOf("review") > -1) {
      wanikaniAugmenter.toggleReviewElements();
      wanikaniAugmenter.injectScript("/js/review/randomOverride.js");
      wanikaniAugmenter.injectScript("/js/review/information.js");
      wanikaniAugmenter.injectScript("/js/review/reordering.js");
      wanikaniAugmenter.injectScript("/js/review/deletion.js");
    }

    if(window.location.href.indexOf("lesson") > -1) {
      wanikaniAugmenter.toggleLessonElements();
      wanikaniAugmenter.injectScript("/js/lesson/reordering.js");
    }
  });
});

$(window).on("dataUpdated", function() {
  if(window.location.href.indexOf("review") > -1) {
    wanikaniAugmenter.toggleReviewElements();
    wanikaniAugmenter.injectScript("/js/review/randomOverride.js");
    wanikaniAugmenter.injectScript("/js/review/information.js");
    wanikaniAugmenter.injectScript("/js/review/reordering.js");
    wanikaniAugmenter.injectScript("/js/review/deletion.js");
  }

  if(window.location.href.indexOf("lesson") > -1) {
    wanikaniAugmenter.toggleLessonElements();
    wanikaniAugmenter.injectScript("/js/lesson/reordering.js");
  }
});
