(function( wanikaniAugmenter, $, undefined ) {

  var originalRandomFunction = Math.random;

  wanikaniAugmenter.init = function(storedObjects) {
    wanikaniAugmenter.options = storedObjects.options;
    wanikaniAugmenter.data = storedObjects.data;

    localStorage.setItem("wanikaniAugmenter.options", JSON.stringify(wanikaniAugmenter.options));
    localStorage.setItem("wanikaniAugmenter.data", JSON.stringify(wanikaniAugmenter.data));

    if(wanikaniAugmenter.options.realNumbers.enabled) {
      $("body > div > div.navbar.navbar-static-top > div > div > ul:nth-child(1) > li.lessons.wanikani-tour-1.wanikani-tour-2 > a > span").text(wanikaniAugmenter.data.available.lessons);
      $("body > div > div.navbar.navbar-static-top > div > div > ul:nth-child(1) > li.reviews.wanikani-tour-3 > a > span").text(wanikaniAugmenter.data.available.reviews);
    }

    if(window.location.pathname === "/dashboard" && (document.referrer.indexOf("review") !== -1 || document.referrer.indexOf("lesson") !== -1)) {
      wanikaniAugmenter.data.updateRequired = true;
      chrome.storage.local.set({data: wanikaniAugmenter.data});
    }

    $(window).trigger("dataInitialized");
  };

  wanikaniAugmenter.refresh = function(storedObjects) {
    if(window.location.pathname.indexOf("session") === -1) {
      console.log(window.location.pathname);
      if(storedObjects.options)   $.extend(true, wanikaniAugmenter.options, storedObjects.options.newValue);
      if(storedObjects.data)      $.extend(true, wanikaniAugmenter.data, storedObjects.data.newValue);

      localStorage.setItem("wanikaniAugmenter.options", JSON.stringify(wanikaniAugmenter.options));
      localStorage.setItem("wanikaniAugmenter.data", JSON.stringify(wanikaniAugmenter.data));

      if(wanikaniAugmenter.options.realNumbers.enabled) {
        $("body > div > div.navbar.navbar-static-top > div > div > ul:nth-child(1) > li.lessons.wanikani-tour-1.wanikani-tour-2 > a > span").text(wanikaniAugmenter.data.available.lessons);
        $("body > div > div.navbar.navbar-static-top > div > div > ul:nth-child(1) > li.reviews.wanikani-tour-3 > a > span").text(wanikaniAugmenter.data.available.reviews);
      }

      $(window).trigger("dataUpdated");
    }
  };

  wanikaniAugmenter.injectStyles = function(stylePath) {
    $(document.head).append($("<link>", {href: chrome.extension.getURL(stylePath)}));
  };

  wanikaniAugmenter.injectScript = function(scriptPath) {
    var s = document.createElement('script');
    // TODO: add "script.js" to web_accessible_resources in manifest.json
    s.src = chrome.extension.getURL(scriptPath);
    s.onload = function() {
        Math.random = originalRandomFunction;
        this.parentNode.removeChild(this);
    };
    (document.head||document.documentElement).appendChild(s);
  };

  wanikaniAugmenter.getAPI = function() {
     var apiKey = $("#edit_user > fieldset > div:nth-child(12) > div > input").val();
    chrome.storage.local.set({data: $.extend(wanikaniAugmenter.data, {"apiKey": apiKey})});

    if(confirm("The api key was retreived. You'll be taken to the dashboard now, if you like.")) {
      window.location.href = "https://www.wanikani.com/dashboard";
    }
  };

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

chrome.storage.local.get(null, wanikaniAugmenter.init);

chrome.storage.onChanged.addListener(wanikaniAugmenter.refresh);

$(window).on("dataInitialized", function() {
  if(wanikaniAugmenter.data.apiKey === "" && $(location).attr("href") === "https://www.wanikani.com/account") {
    wanikaniAugmenter.getAPI();
  }
});
