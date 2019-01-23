(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.init = function(storedObjects) {
    wanikaniAugmenter.options = storedObjects.options;
    wanikaniAugmenter.data = storedObjects.data;
    console.log("initialized:\n", wanikaniAugmenter.options, "\n", wanikaniAugmenter.data);
    $(window).trigger("dataInitialized");

    $("#dashboardLink").on("click", function() {
      openLink($(this));
    });
    $("#reviewsLink").on("click", function() {
      openLink($(this));
    });
    $("#lessonsLink").on("click", function() {
      openLink($(this));
    });

    var radicalPercent = Math.round(wanikaniAugmenter.data.progress.radicals.complete / wanikaniAugmenter.data.progress.radicals.total * 100) + "%";
    var kanjiPercent = Math.round(wanikaniAugmenter.data.progress.kanji.complete / wanikaniAugmenter.data.progress.kanji.total * 100) + "%";

    $("#radicalBar").css({"width": radicalPercent});
    $("#kanjiBar").css({"width": kanjiPercent});

    $("#radicalPercent").text(radicalPercent);
    $("#kanjiPercent").text(kanjiPercent);

    $("#lessonCount").text(wanikaniAugmenter.data.available.lessons);
    $("#reviewCount").text(wanikaniAugmenter.data.available.reviews);

    if(wanikaniAugmenter.data.available.reviews === 0) $("#reviewCount").parent().addClass("disabled");
    if(wanikaniAugmenter.data.available.lessons === 0) $("#lessonCount").parent().addClass("disabled");

  };

  wanikaniAugmenter.refresh = function(storedObjects) {
    if(storedObjects.options)   $.extend(true, wanikaniAugmenter.options, storedObjects.options.newValue);
    if(storedObjects.data)      $.extend(true, wanikaniAugmenter.data, storedObjects.data.newValue);
    console.log("options:\n", wanikaniAugmenter.options, "\n", storedObjects.options);
    console.log("data:\n", wanikaniAugmenter.data, "\n", storedObjects.data);
    $(window).trigger("dataUpdated");
  };

  function openLink(linkElement) {
    var url = linkElement.attr("href");
    return chrome.tabs.query({url: "*://*.wanikani.com/*"}, function(tabs) {
      if(typeof tabs[0] !== "undefined") {
        chrome.tabs.update(tabs[0].id,{url: url, active: true});
      } else {
        chrome.tabs.create({url: url});
      }
    });
  }

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

chrome.storage.local.get(null, wanikaniAugmenter.init);

chrome.storage.onChanged.addListener(wanikaniAugmenter.refresh);
