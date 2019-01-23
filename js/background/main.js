var radicals = []; var kanji = []; var vocabulary = [];

String.prototype.dedashAndCapitalize = function() {
    var string = this.replace(/-/g, ' ');
    string = string.replace(/\b./g, function(m){ return m.toUpperCase(); });
    return string;
};

(function( wanikaniAugmenter, $, undefined ) {

  wanikaniAugmenter.options = {
    chart: {
      enabled: true,
      length: 24
    },
    realNumbers: {
      enabled: true
    },
    lesson: {
      priority: [
      ],
      reordering: {
        enabled: true,
        sequence: [
          "radicals",
          "kanji",
          "vocabulary"
        ]
      }
    },
    review: {
      derandomizer: true,
      deletion: true,
      reordering: {
        enabled: true,
        sequence: [
          "current radicals",
          "current kanji",
          "unburned radicals",
          "unburned kanji",
          "current vocabulary",
          "unburned vocabulary",
          "burnable radicals",
          "burnable kanji",
          "burnable vocabulary"
        ]
      },
      information: {
        srs: true,
        radicals: true,
        kanji: true,
        vocabulary: true
      }
    }
  };

  wanikaniAugmenter.data = {
    apiKey: "",
    updateRequired: false,
    updatedAt: null,
    user: {
      level: 0
    },
    progress: {
      lastUpdate: null,
      radicals: {
        complete: 0,
        total: 0
      },
      kanji: {
        complete: 0,
        total: 0
      }
    },
    available: {
      lastUpdate: null,
      lessons: null,
      reviews: null
    },
    radicals: {
      lastUpdate: null,
      current: [],
      unburned: [],
      burnable: []
    },
    kanji: {
      lastUpdate: null,
      current: [],
      unburned: [],
      burnable: []
    },
    vocabulary: {
      lastUpdate: null,
      current: [],
      unburned: [],
      burnable: []
    }
  };

  wanikaniAugmenter.init = function(storedObjects) {
    $.extend(true, wanikaniAugmenter.options, storedObjects.options);
    $.extend(true, wanikaniAugmenter.data, storedObjects.data);

    chrome.storage.local.set({options: wanikaniAugmenter.options, data: wanikaniAugmenter.data}, function() {
      chrome.storage.onChanged.addListener(wanikaniAugmenter.refresh);
    });

    wanikaniAugmenter.checkApi();
  };

  wanikaniAugmenter.refresh = function(storedObjects) {
    if(storedObjects.options)   $.extend(true, wanikaniAugmenter.options, storedObjects.options.newValue);
    if(storedObjects.data)      $.extend(true, wanikaniAugmenter.data, storedObjects.data.newValue);
    if(storedObjects.data && storedObjects.data.oldValue && storedObjects.data.newValue && storedObjects.data.newValue.apiKey !== storedObjects.data.oldValue.apiKey) {
      wanikaniAugmenter.checkApi();
    }
    if(wanikaniAugmenter.data.updateRequired) {
      wanikaniAugmenter.updateData();
    }
  };

  wanikaniAugmenter.checkApi = function() {
    if(wanikaniAugmenter.data.apiKey === "") {
      if (confirm("We need to get your API key before Wanikani-Helper can function correctly. We can do it automatically now, if you like?")) {
        chrome.tabs.query(
          {
            url: "*://*.wanikani.com/*"
          },
          function(tabArray) {
            var tabOptions = {
              active: true,
              url: "https://www.wanikani.com/account"
            };
            if(tabArray.length > 0) {
              chrome.tabs.update(tabArray[0].id, tabOptions);
            } else {
              chrome.tabs.create(tabOptions);
            }
          }
        );
      }
    } else {
      $.getJSON("https://www.wanikani.com/api/user/" + wanikaniAugmenter.data.apiKey + "/study-queue").done(function(responseData) {
        wanikaniAugmenter.data.user.level = responseData.user_information.level;

        wanikaniAugmenter.data.available.lessons = responseData.requested_information.lessons_available;
        wanikaniAugmenter.data.available.reviews = responseData.requested_information.reviews_available;
        wanikaniAugmenter.data.available.lastUpdate = now();

        chrome.storage.local.set({"data": wanikaniAugmenter.data});

        chrome.alarms.get("updateDataJob", function(alarm) {
          if(alarm === undefined) {
            wanikaniAugmenter.startAlarm();
          } else {
            wanikaniAugmenter.updateData();
          }
        });
      });
    }
  };

  var now = function() {
    return new Date().getTime();
  };

  var lastQuarterHour = function() {
    var currentTime = now();
    return currentTime - (currentTime % (15 * 60 * 1000));
  };

  var nextQuarterHour = function() {
    var currentTime = now();
    return currentTime - (currentTime % (15 * 60 * 1000)) + (15 * 60 * 1000);
  };

  wanikaniAugmenter.startAlarm = function() {
    if(wanikaniAugmenter.data.apiKey !== "") {
      chrome.alarms.create("updateDataJob", {
        when: nextQuarterHour() + (60 * 1000),
        periodInMinutes: 15
      });

      wanikaniAugmenter.updateData();
    }
  };

  chrome.alarms.onAlarm.addListener(function(alarm) {
    wanikaniAugmenter.updateData();
  });

  wanikaniAugmenter.updateData = function(override) {
    if(wanikaniAugmenter.data.updateRequired === true) {
      override = true;
      wanikaniAugmenter.data.updateRequired = false;
    }
    wanikaniAugmenter.getAvailableCounts(override).getLevelProgress(override).update("radicals", override).update("kanji", override).update("vocabulary", override);
    // wanikaniAugmenter.getLevelProgress();
    // wanikaniAugmenter.update("radicals");
    // wanikaniAugmenter.update("kanji");
    // wanikaniAugmenter.update("vocabulary");
  };

  wanikaniAugmenter.getAvailableCounts = function(override) {
    if(wanikaniAugmenter.data.available.lastUpdate < lastQuarterHour() || override) {
      $.getJSON("https://www.wanikani.com/api/user/" + wanikaniAugmenter.data.apiKey + "/study-queue").done(function(responseData) {
        wanikaniAugmenter.data.user.level = responseData.user_information.level;

        wanikaniAugmenter.data.updatedAt = now();

        wanikaniAugmenter.data.available.lessons = responseData.requested_information.lessons_available;
        wanikaniAugmenter.data.available.reviews = responseData.requested_information.reviews_available;
        wanikaniAugmenter.data.available.lastUpdate = now();
        chrome.storage.local.set({"data": wanikaniAugmenter.data});
      });
    }
    return this;
  };

  wanikaniAugmenter.getLevelProgress = function(override) {
    if(wanikaniAugmenter.data.progress.lastUpdate < lastQuarterHour() || override) {
      $.getJSON("https://www.wanikani.com/api/user/" + wanikaniAugmenter.data.apiKey + "/level-progression").done(function(responseData) {
        wanikaniAugmenter.data.user.level = responseData.user_information.level;

        wanikaniAugmenter.data.updatedAt = now();

        wanikaniAugmenter.data.progress.radicals.complete = responseData.requested_information.radicals_progress;
        wanikaniAugmenter.data.progress.radicals.total = responseData.requested_information.radicals_total;
        wanikaniAugmenter.data.progress.kanji.complete = responseData.requested_information.kanji_progress;
        wanikaniAugmenter.data.progress.kanji.total = responseData.requested_information.kanji_total;
        wanikaniAugmenter.data.progress.lastUpdate = now();
        chrome.storage.local.set({"data": wanikaniAugmenter.data});
      });
    }
    return this;
  };

  wanikaniAugmenter.update = function(dataType, override) {
    if(wanikaniAugmenter.data[dataType].lastUpdate < lastQuarterHour() || override) {
      window[dataType].length = 0;
      var queryCount = Math.ceil(wanikaniAugmenter.data.user.level / 10);

      var queryArray = Array.apply(null, Array(wanikaniAugmenter.data.user.level + 1)).map(function(_, index) {return index;});
      var levelsArray = [];
      for(i = 1; i <= queryCount; i++) {
        levelsArray.push(queryArray.splice(1, 10));
      }

      var queryUrls = $.map(levelsArray, function(levels) {
        return "https://www.wanikani.com/api/user/" + wanikaniAugmenter.data.apiKey + "/" + dataType + "/" + levels.join(",");
      });

      var deferreds = $.map(queryUrls, function(currentUrl) {
        return $.getJSON(currentUrl).done(function(responseData) {
          window[dataType] = window[dataType].concat(responseData.requested_information);
        });
      });
      $.when.apply($, deferreds).then(function() {
          processData(dataType);
      });
    }
    return this;
  };

  function processData(dataType) {
    wanikaniAugmenter.data[dataType].current = window[dataType].filter(filterByLevel(wanikaniAugmenter.data.user.level));
    wanikaniAugmenter.data[dataType].current.sort(sortByTime);
    wanikaniAugmenter.data[dataType].current = groupBy(wanikaniAugmenter.data[dataType].current, "available_date", dataType)[0];
    wanikaniAugmenter.data[dataType].current = $.map(wanikaniAugmenter.data[dataType].current, function(count, time) {
      return [[time * 1, count]];
    });

    wanikaniAugmenter.data[dataType].unburned = window[dataType].filter(filterByRange(wanikaniAugmenter.data.user.level, "enlighten"));
    wanikaniAugmenter.data[dataType].unburned.sort(sortByTime);
    wanikaniAugmenter.data[dataType].unburned = groupBy(wanikaniAugmenter.data[dataType].unburned, "available_date", dataType)[0];
    wanikaniAugmenter.data[dataType].unburned = $.map(wanikaniAugmenter.data[dataType].unburned, function(count, time) {
      return [[time * 1, count]];
    });

    wanikaniAugmenter.data[dataType].burnable = window[dataType].filter(filterBySRS("enlighten"));
    wanikaniAugmenter.data[dataType].burnable.sort(sortByTime);
    wanikaniAugmenter.data[dataType].burnable = groupBy(wanikaniAugmenter.data[dataType].burnable, "available_date", dataType)[0];
    wanikaniAugmenter.data[dataType].burnable = $.map(wanikaniAugmenter.data[dataType].burnable, function(count, time) {
      return [[time * 1, count]];
    });

    wanikaniAugmenter.data[dataType].lastUpdate = now();

    wanikaniAugmenter.data.updatedAt = now();

    chrome.storage.local.set({"data": wanikaniAugmenter.data});

    return this;
  }

  function filterByLevel(level) {
    return function(element, id, array) {
      if(element && element.level === level) {
        return element;
      }
    };
  }

  function filterBySRS(srs) {
    return function(element, id, array) {
      if(element.user_specific && element.user_specific.srs === srs) {
        return element;
      }
    };
  }

  function filterByRange(level, srs) {
    return function(element, id, array) {
      if(element.level < level && element.user_specific && element.user_specific.burned === false && element.user_specific.srs !== srs) {
        return element;
      }
    };
  }

  function sortByTime(a, b) {
    if(a.user_specific && b.user_specific) {
      return a.user_specific.available_date > b.user_specific.available_date ? 1 : -1;
    }
  }

  function groupBy(data, attr, dataType) {
    var sum = {};
    var currentTime = lastQuarterHour();

    sum[currentTime] = [];

    $.each(data, function(id, obj) {
      if (obj.user_specific && obj.user_specific.available_date * 1000 < currentTime) {
        sum[currentTime].push((dataType == "radicals" ? obj.meaning.dedashAndCapitalize() : obj.character));
      } else if(obj.user_specific && typeof sum[obj.user_specific[attr] * 1000] == 'undefined') {
        sum[obj.user_specific[attr] * 1000]= [(dataType == "radicals"  ? obj.meaning.dedashAndCapitalize() : obj.character)];
      } else if(obj.user_specific) {
        sum[obj.user_specific[attr] * 1000].push((dataType == "radicals" ? obj.meaning.dedashAndCapitalize() : obj.character));
      }
    });

    return [sum];
  }

  wanikaniAugmenter.showStorage = function() {
    chrome.storage.local.get(null, function(storedObjects) {
    });
  };

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

chrome.storage.local.get(null, wanikaniAugmenter.init);
