$(document).ready(function(){

    var root = "https://api.openweathermap.org/data/2.5/";
    
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

      });
})