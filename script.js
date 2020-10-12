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
          var weatherIcon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
    
          $("#city").text(response.name);
          $("#city").append(" <span>(" + date.toLocaleDateString() + ")");
          $("#city").append('<img class="weather-icon" alt="' + response.weather[0].description + '" src=' + weatherIcon + ">");
          $("#current-temp").text(response.main.temp + " °F");
          $("#current-humidity").text(response.main.humidity + "%");
          $("#current-wind-speed").text(response.wind.speed + " MPH");
        })
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
})