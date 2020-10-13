$(document).ready(function () {
  var root = "https://api.openweathermap.org/data/2.5/";
  const token = "6134970242bfd5a0d02311fb56d60846";

  //Hide the error placeholder
  $('#error').hide();

  //Get the last city searched from local storage if there is one and get the weather for it
  var lastCitySearched = localStorage.getItem("lastCitySearched");
  if (lastCitySearched) {
    getWeather(lastCitySearched);
  }

  //Function to get the current weather, five day forecast, and UV Index
  function getWeather(city, addHistory) {
    var urlcurrent = root + "/weather?q=" + city + "&units=imperial&appid=" + token;

    $.ajax({
      url: urlcurrent,
      method: "GET",
      error: function (jqXHR, errorText, errorThrown) {
        //If error is thrown from api call show in the error placeholder
        $('#error-text').text(jqXHR.responseJSON.message).show();
      },
    }).then(function (response) {

      //If this is a call from a search add a history button.
      //If it's a call from the last search from localstorage don't add history button
      if (addHistory) {
        $('#error-text').hide();
        var historyBtn = $(
          '<div class="row">' +
            '<div class="col-sm-12">' +
            '<button class="historyBtn btn border" data-city="' +
            city +
            '">' +
            city +
            "</button>" +
            "</div>" +
            "</div>"
        );

        $("#searchContainer").append(historyBtn);
      }

      //Get the dt value from the response and create a Date object
      var date = new Date(response.dt * 1000);
      //Get the weather icon from the response
      var weatherIcon = getWeatherIcon(response.weather[0].icon);

      //Set the text for the current weather details
      $("#city").text(response.name);
      $("#city").append(" <span>(" + date.toLocaleDateString() + ")");
      //Add the icon for the current weather
      $("#city").append(
        '<img class="weather-icon" alt="' +
          response.weather[0].description +
          '" src=' +
          weatherIcon +
          ">"
      );
      $("#current-temp").text(response.main.temp + " °F");
      $("#current-humidity").text(response.main.humidity + "%");
      $("#current-wind-speed").text(response.wind.speed + " MPH");

      getFiveDayForecast(response.coord.lat, response.coord.lon);
      getUVIndex(response.coord.lat, response.coord.lon);

      //Add the last searched city to localStorage
      localStorage.setItem("lastCitySearched", city);
    });
  }

  function getWeatherIcon(icon) {
    return "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  }

  function getFiveDayForecast(lat, lon) {
    var url =
      root +
      "onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" +
      token;

    //Get the five day forecast from the onecall endpoint
    $.ajax({
      url: url,
      method: "GET",
    }).then(function (response) {
      var forecasts = response.daily;

      $(".five-day-forecast").empty();

      //Skip the current day from the array and get the next five days
      for (var i = 1; i < 6; i++) {
        var forecast = forecasts[i];
        date = new Date(forecast.dt * 1000);
        weatherIcon = getWeatherIcon(forecast.weather[0].icon);

        //Dynamically add item for five day forecast
        var forecastHTML = "<li>";
        forecastHTML +=
          "<div><p class='font-weight-bold'>" +
          date.toLocaleDateString() +
          "</p>";
        forecastHTML +=
          '<img src="' +
          weatherIcon +
          '" alt="' +
          forecast.weather[0].description +
          '" class="five-day-weather-icon">';
        forecastHTML += "<p>Temp: " + forecast.temp.day + " °F</p>";
        forecastHTML += "<p>Humidity: " + forecast.humidity + "%</p></div>";
        forecastHTML += "</li>";

        $(".five-day-forecast").append(forecastHTML);
      }
    });
  }

  function getUVIndex(lat, lon) {
    var url = root + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + token;

    //Get the UV index for the city
    $.ajax({
      url: url,
      method: "GET",
    }).then(function (response) {
      var uvIndex = response.value;
      var indicatorColor;
      $("#current-uv-index").text(uvIndex);

      //Determine the indicator for the UV Index
      if (uvIndex >= 0 && uvIndex < 3) {
        indicatorColor = "green";
      } else if (uvIndex >= 3 && uvIndex < 6) {
        indicatorColor = "yellow";
      } else if (uvIndex >= 6 && uvIndex < 8) {
        indicatorColor = "orange";
      } else if (uvIndex >= 8 && uvIndex < 11) {
        indicatorColor = "red";
      } else {
        indicatorColor = "violet";
      }

      $("#current-uv-index").css("background", indicatorColor);
    });
  }

  //Add the submit event handler for the form 
  $("form").on("submit", function (event) {
    event.preventDefault();
    var city = $("#searchInput").val();
    $("#searchInput").val("");

    //Check to see if the input is not blank
    if (city) {
      getWeather(city, true);
    }
  });

  //Add the click event handler for the history buttons
  $(document).on("click", ".historyBtn", function () {
    getWeather($(this).attr("data-city"));
  });
});
