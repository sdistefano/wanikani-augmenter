$(document).ready(function() {
  $(window).on("dataInitialized", function() {
    var dateString = new Date(wanikaniAugmenter.data.updatedAt).toLocaleDateString("en-US", {day: "2-digit", month: "short", hour12: false, hour: "2-digit", minute: "2-digit"});
    $("#refreshButton").html("Update data <br>(last: " + dateString + ")").on("click", function() {
      wanikaniAugmenter.data.updateRequired = true;
      save();
    });

    if(wanikaniAugmenter.data.apiKey !== "") {
      $("input#apiKey")
        .val(
          wanikaniAugmenter.data.apiKey
        ).on(
          "input", function() {
            wanikaniAugmenter.data.apiKey = $(this).val();
            save();
          }
        );
    }

    $("#dashboardChartEnabled")
      .val(
        wanikaniAugmenter.options.chart.enabled + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.chart.enabled = ($(this).val() === "true" ? true : false);
          save();
        }
      );

   $("#realNumbersEnabled")
      .val(
        wanikaniAugmenter.options.realNumbers.enabled + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.realNumbers.enabled = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#priorityList")
      .val(
        wanikaniAugmenter.options.lesson.priority.join(",")
      ).on(
        "input", function() {
          priorityArray = $(this).val().split(/,|、/);
          wanikaniAugmenter.options.lesson.priority = priorityArray;
          save();
        }
      );

    $("#lessonReordering")
      .val(
        wanikaniAugmenter.options.lesson.reordering.enabled + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.lesson.reordering.enabled = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $.each(wanikaniAugmenter.options.lesson.reordering.sequence, function(id, value) {
      $("#lessonReorderSequenceList").append($("<li>", {id: value, class: value + " sortable-item ui-state-default", text: value.charAt(0).toUpperCase() + value.slice(1)}));
    });

    $("#lessonReorderSequenceList").sortable({
      "items": "> .sortable-item",
      "axis": "y",
      "tolerance": "intersect",
      "cursor": "ns-resize",
      "update": function() {
        wanikaniAugmenter.options.lesson.reordering.sequence = $(this).sortable("toArray");
        save();
      }
    });

    $("#reviewReordering")
      .val(
        wanikaniAugmenter.options.review.reordering.enabled + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.reordering.enabled = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#mistakeDeletion")
      .val(
        wanikaniAugmenter.options.review.deletion + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.deletion = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#derandomizer")
      .val(
        wanikaniAugmenter.options.review.derandomizer + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.derandomizer = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#reviewInformationSRS")
      .val(
        wanikaniAugmenter.options.review.information.srs + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.information.srs = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#reviewInformationRadicals")
      .val(
        wanikaniAugmenter.options.review.information.radicals + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.information.radicals = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#reviewInformationKanji")
      .val(
        wanikaniAugmenter.options.review.information.kanji + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.information.kanji = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $("#reviewInformationVocabulary")
      .val(
        wanikaniAugmenter.options.review.information.vocabulary + ""
      ).on(
        "change", function() {
          wanikaniAugmenter.options.review.information.vocabulary = ($(this).val() === "true" ? true : false);
          save();
        }
      );

    $.each(wanikaniAugmenter.options.review.reordering.sequence, function(id, value) {
      var splitWords = value.split(" ");
      var type = splitWords[0];
      var category = splitWords[1];
      $("#reviewReorderSequenceList")
        .append(
          $("<li>", {id: value, class: "review sortable-item ui-state-default"})
            .append(
              $("<span>", {class: "type " + type , text: type.charAt(0).toUpperCase() + type.slice(1)})
            ).append(
              $("<span>", {class: "category " + category, text: category.charAt(0).toUpperCase() + category.slice(1)})
            ).append(
              $("<span>", {class: "ui-li-count", text: wanikaniAugmenter.data[category][type][0][1].length})
            )
        );
    });

    $("#reviewReorderSequenceList").sortable({
      "items": "> .sortable-item",
      "axis": "y",
      "tolerance": "intersect",
      "cursor": "ns-resize",
      "update": function() {
        wanikaniAugmenter.options.review.reordering.sequence = $(this).sortable("toArray");
        save();
      }
    });

  });

  $(window).on("dataUpdated", function() {
    console.log("data updated");
    var dateString = new Date(wanikaniAugmenter.data.updatedAt).toLocaleDateString("en-US", {day: "2-digit", month: "short", hour12: false, hour: "2-digit", minute: "2-digit"});
    $("#refreshButton").html("Update data <br>(last: " + dateString + ")").on("click", function() {
      wanikaniAugmenter.data.updateRequired = true;
      save();
    });
  });
});

function save() {
  chrome.storage.local.set({"options": wanikaniAugmenter.options, "data": wanikaniAugmenter.data});
}
