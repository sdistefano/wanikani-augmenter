(function( wanikaniAugmenter, $, undefined ) {

  var chart;
  var now = new Date().getTime();

  wanikaniAugmenter.init = function(storedObjects) {
    wanikaniAugmenter.options = storedObjects.options;
    wanikaniAugmenter.data = storedObjects.data;

    localStorage.setItem("wanikaniAugmenter.options", JSON.stringify(wanikaniAugmenter.options));
    localStorage.setItem("wanikaniAugmenter.data", JSON.stringify(wanikaniAugmenter.data));

    $(window).trigger("dataInitialized");

    if(wanikaniAugmenter.options.chart.enabled) {
      wanikaniAugmenter.addChart().updateChart();
    }
  };

  wanikaniAugmenter.refresh = function(storedObjects) {
    if(storedObjects.options)   $.extend(true, wanikaniAugmenter.options, storedObjects.options.newValue);
    if(storedObjects.data)      $.extend(true, wanikaniAugmenter.data, storedObjects.data.newValue);

    localStorage.setItem("wanikaniAugmenter.options", JSON.stringify(wanikaniAugmenter.options));
    localStorage.setItem("wanikaniAugmenter.data", JSON.stringify(wanikaniAugmenter.data));

    wanikaniAugmenter.updateChart();

    $(window).trigger("dataUpdated");
  };

  wanikaniAugmenter.addChart = function() {
    timeFormats = {
      minute: '%H:%M',
      hour: '%H',
      day: '%b_%e'
    };

    $(".review-status")
      .prepend(
        $("<div>", {id: "chart"})
      ).prepend(
        $("<section>", {id: "updateTimes"})
          .css(
            {
              "margin":"0",
              "text-align": "center"
            }
          ).append(
            $("<aside>", {id: "radicalUpdate", text: "Radicals updated: "})
            .append(
              $("<small>", {id:"radicalUpdateTime"})
            ).css(
              {
                "display":"inline-block",
                "padding":"0 2em"
              }
            )
          ).append(
            $("<aside>", {id: "kanjiUpdate", text: "Kanji updated: "})
            .append(
              $("<small>", {id:"kanjiUpdateTime"})
            ).css(
              {
                "display":"inline-block",
                "padding":"0 2em"
              }
            )
          ).append(
            $("<aside>", {id: "vocabularyUpdate", text: "Vocabulary updated: "})
            .append(
              $("<small>", {id:"vocabularyUpdateTime"})
            ).css(
              {
                "display":"inline-block",
                "padding":"0 2em"
              }
            )
          )
      ).prepend(
        $("<section>", {id: "chartFunctions"})
          .css(
            {
              "text-align": "center",
              "margin-bottom":"0px"
            }
          ).append(
            $("<a>", {id: "twelveHours", text: "12 Hours"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"1.5em"
                }
              ).on("click", function() {
                chrome.storage.local.set({options: $.extend(wanikaniAugmenter.options, {chart: { length: 12 }}) });
              })
          ).append(
            $("<a>", {id: "twentyFourHours", text: "24 Hours"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"1.5em"
                }
              ).on("click", function() {
                chrome.storage.local.set({options: $.extend(wanikaniAugmenter.options, {chart: { length: 24 }}) });
              })
          ).append(
            $("<a>", {id: "thirtySixHours", text: "36 Hours"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"1.5em"
                }
              ).on("click", function() {
                chrome.storage.local.set({options: $.extend(wanikaniAugmenter.options, {chart: { length: 36 }}) });
              })
          ).append(
            $("<a>", {id: "fortyEightHours", text: "48 Hours"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"1.5em"
                }
              ).on("click", function() {
                chrome.storage.local.set({options: $.extend(wanikaniAugmenter.options, {chart: { length: 48 }}) });
              })
          ).append(
            $("<a>", {id: "sixtyHours", text: "60 Hours"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"1.5em"
                }
              ).on("click", function() {
                chrome.storage.local.set({options: $.extend(wanikaniAugmenter.options, {chart: { length: 60 }}) });
              })
          ).append(
            $("<a>", {id: "SeventyTwoHours", text: "72 Hours"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"1.5em"
                }
              ).on("click", function() {
                chrome.storage.local.set({options: $.extend(wanikaniAugmenter.options, {chart: { length: 72 }}) });
              })
          )
      );

    $("#chart")
      .after(
        $("<span>", {id: "dataFilters"})
          .css(
            {
              "text-align": "center"
            }
          ).append(
            $("<a>", {id: "toggleCurrent", text: "Current"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"0.5em"
                }
              ).on("click", function() {
                toggleData("current", "all");
              })
          ).append(
            $("<a>", {id: "toggleUnburned", text: "Unburned"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"0.5em"
                }
              ).on("click", function() {
                toggleData("unburned", "all");
              })
          ).append(
            $("<a>", {id: "toggleCurrent", text: "Burnable"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"0.5em"
                }
              ).on("click", function() {
                toggleData("burnable", "all");
              })
          ).append(
            $("<a>", {id: "toggleCurrent", text: "Radicals"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"0.5em"
                }
              ).on("click", function() {
                toggleData("all", "Radicals");
              })
          ).append(
            $("<a>", {id: "toggleCurrent", text: "Kanji"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"0.5em"
                }
              ).on("click", function() {
                toggleData("all", "Kanji");
              })
          ).append(
            $("<a>", {id: "toggleCurrent", text: "Vocabulary"})
              .css(
                {
                  "cursor":"pointer",
                  "padding":"0 1em",
                  "font-size":"0.5em"
                }
              ).on("click", function() {
                toggleData("all", "Vocabulary");
              })
          )
      );

    container = $("#chart");
    container.css({"width": "100%"});

    basicChartOptions = {

      chart: {
        type: "column",
        zoomType: "x",
        height: 400,
        renderTo: container[0]
      },

      title: {
        text: "Wanikani Reviews"
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: false,
            color: "white",
            formatter: function() {
              return this.y > 0 ? this.y + "" : null;
            }
          },
          stacking: true
        },
        column: {
          pointRange: 15 * 60 * 1000
        }
      },

      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: timeFormats,
        minRange: 2 * 60 * 60 * 1000,
        title: {
          text: "Time"
        }
      },

      yAxis: {
        stackLabels: {
          enabled: true
        },
        title: {
          text: "Number of Reviews"
        }
      },

      series: [
        {
          id: "currentRadicals",
          name: "Current",
          color: "#0AF",
          shadow: {
            color: "red",
            opacity: "1"
          },
          legendIndex: 0,
          index: 9
        },
        {
          id: "unburnedRadicals",
          name: "Unburned",
          color: "#0AF",
          legendIndex: 1,
          index: 8
        },
        {
          id: "burnableRadicals",
          name: "Burnable",
          color: "#0AF",
          shadow: {
            color: "black",
            opacity: "1"
          },
          legendIndex: 2,
          index: 7
        },
        {
          id: "currentKanji",
          name: "Current",
          color: "#F0A",
          shadow: {
            color: "red",
            opacity: "1"
          },
          legendIndex: 3,
          index: 6
        },
        {
          id: "unburnedKanji",
          name: "Unburned",
          color: "#F0A",
          legendIndex: 4,
          index: 5
        },
        {
          id: "burnableKanji",
          name: "Burnable",
          color: "#F0A",
          shadow: {
            color: "black",
            opacity: "1"
          },
          legendIndex: 5,
          index: 4
        },
        {
          id: "currentVocabulary",
          name: "Current",
          color: "#A0F",
          shadow: {
            color: "red",
            opacity: "1"
          },
          legendIndex: 6,
          index: 3
        },
        {
          id: "unburnedVocabulary",
          name: "Unburned",
          color: "#A0F",
          legendIndex: 7,
          index: 2
        },
        {
          id: "burnableVocabulary",
          name: "Burnable",
          color: "#A0F",
          shadow: {
            color: "black",
            opacity: "1"
          },
          legendIndex: 8,
          index: 1
        }
      ]
    };

    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    chart = new Highcharts.Chart(basicChartOptions);

    return this;
  };

  function toggleData(period, category) {
    //"current", "all"
    var firstString = ""; var secondString = ""; var thirdString = "";
    if(period === "all") {
      firstString += "current";
      secondString += "unburned";
      thirdString += "burnable";
    } else {
      firstString += period;
      secondString += period;
      thirdString += period;
    }

    if(category === "all") {
      firstString += "Radicals";
      secondString += "Kanji";
      thirdString += "Vocabulary";
    } else {
      firstString += category;
      secondString += category;
      thirdString += category;
    }
    var queryArray = [firstString, secondString, thirdString];

    $.each(queryArray, function(id, value) {
      var series = chart.get(value);
      if(series.visible) {
        series.hide();
      } else {
        series.show();
      }
    });
  }

  wanikaniAugmenter.updateChart = function() {
    now = new Date().getTime();
    $("#radicalUpdateTime").text(new Date(wanikaniAugmenter.data.radicals.lastUpdate).toLocaleTimeString("en-GB"));
    $("#kanjiUpdateTime").text(new Date(wanikaniAugmenter.data.kanji.lastUpdate).toLocaleTimeString("en-GB"));
    $("#vocabularyUpdateTime").text(new Date(wanikaniAugmenter.data.vocabulary.lastUpdate).toLocaleTimeString("en-GB"));

    chart.get("currentRadicals").setData(arrange(wanikaniAugmenter.data.radicals.current));
    chart.get("currentKanji").setData(arrange(wanikaniAugmenter.data.kanji.current));
    chart.get("currentVocabulary").setData(arrange(wanikaniAugmenter.data.vocabulary.current));

    chart.get("unburnedRadicals").setData(arrange(wanikaniAugmenter.data.radicals.unburned));
    chart.get("unburnedKanji").setData(arrange(wanikaniAugmenter.data.kanji.unburned));
    chart.get("unburnedVocabulary").setData(arrange(wanikaniAugmenter.data.vocabulary.unburned));

    chart.get("burnableRadicals").setData(arrange(wanikaniAugmenter.data.radicals.burnable));
    chart.get("burnableKanji").setData(arrange(wanikaniAugmenter.data.kanji.burnable));
    chart.get("burnableVocabulary").setData(arrange(wanikaniAugmenter.data.vocabulary.burnable));

    chart.redraw();
  };

  function arrange(data) {
    var chartLength = wanikaniAugmenter.options.chart.length * (60 * 60 * 1000);
    chartArray = [];
    $.each(data, function(index, value) {
      if(value[0] < (now + chartLength)) {
        chartArray.push([value[0], value[1].length]);
      }
    });
    return chartArray;
  }

}( window.wanikaniAugmenter = window.wanikaniAugmenter || {}, jQuery ));

chrome.storage.local.get(null, wanikaniAugmenter.init);

chrome.storage.onChanged.addListener(wanikaniAugmenter.refresh);
