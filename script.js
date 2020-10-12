$(document).ready(function(){

    var root = "https://api.openweathermap.org/data/2.5/";
    
    function getWeather(city) {
    
        var urlcurrent = root + "/weather?q=" + city + "&units=imperial&appid=6134970242bfd5a0d02311fb56d60846";
    
        $.ajax({
          url: urlcurrent,
          method: "GET",
        }).then(function (response) {
          console.log(response); 
          var date = new Date(response.dt * 1000);
          var weatherIcon = getWeatherIcon(response.weather[0].icon);
    
          $("#city").text(response.name);
          $("#city").append(" <span>(" + date.toLocaleDateString() + ")");
          $("#city").append('<img class="weather-icon" alt="' + response.weather[0].description + '" src=' + weatherIcon + ">");
          $("#current-temp").text(response.main.temp + " °F");
          $("#current-humidity").text(response.main.humidity + "%");
          $("#current-wind-speed").text(response.wind.speed + " MPH");

          getFiveDayForecast(response.coord.lat, response.coord.lon);
          getUVIndex(response.coord.lat, response.coord.lon);

        });
    }

    function getWeatherIcon(icon){
        return "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    }

    function getFiveDayForecast(lat, lon){
      var url = root + "onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=6134970242bfd5a0d02311fb56d60846";

      $.ajax({
        url: url,
        method: "GET",
      }).then(function (response) {

        var forecasts = response.daily;

        $(".five-day-forecast").empty();

        for (var i = 1; i < 6; i++) {
          var forecast = forecasts[i];
          date = new Date(forecast.dt * 1000);
          weatherIcon = getWeatherIcon(forecast.weather[0].icon);

          var forecastHTML = "<li>";
          forecastHTML += "<div><p class='font-weight-bold'>" + date.toLocaleDateString() + "</p>";
          forecastHTML += '<img src="' + weatherIcon + '" alt="' + forecast.weather[0].description + '" class="five-day-weather-icon">';
          forecastHTML += "<p>Temp: " + forecast.temp.day + " °F</p>";
          forecastHTML += "<p>Humidity: " + forecast.humidity + "%</p></div>";
          forecastHTML += "</li>";

          $(".five-day-forecast").append(forecastHTML);
        }
      });
    }

    function getUVIndex(lat, lon){
        var url = root + "uvi?lat=" + lat + "&lon=" + lon + "&appid=6134970242bfd5a0d02311fb56d60846";

      $.ajax({
        url: url,
        method: "GET",
      }).then(function (response) {
        var uvIndex = response.value;
        var indicatorColor;
        $("#current-uv-index").text(uvIndex);

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

    $("form").on("submit", function (event) {
        event.preventDefault();
        var city = $("#searchInput").val();
        $("#searchInput").val("");
    
        var historyBtn = $(
            '<div class="row">'
            + '<div class="col-sm-12">'
            + '<button class="historyBtn btn border" data-city="' + city +'">' + city + '</button>'
            + '</div>'
            + '</div>'
          );

          $("#searchContainer").append(historyBtn);

          getWeather(city);

      });

      $(document).on('click', '.historyBtn', function(){
          getWeather($(this).attr('data-city'));
      })
})