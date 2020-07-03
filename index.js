function displayForm() {
  $(".dog-pic").click(function (e) {
    e.preventDefault();
    $(".buddy").hide();
    $(".forms").show();
    $(".pic-dog").show();
    $(".pic-cat").hide();
    $(".search-age-cat").hide();
    $(".search-size-cat").hide();
    $(".search-breed-cat").hide();
    $(".submit-cat").hide();
    $(".search-age-dog").show();
    $(".search-size-dog").show();
    $(".search-breed-dog").show();
    $(".submit-dog").show();
  });

  $(".cat-pic").click(function (e) {
    e.preventDefault();
    $(".buddy").hide();
    $(".forms").show();
    $(".pic-cat").show();
    $(".pic-dog").hide();
    $(".search-age-dog").hide();
    $(".search-size-dog").hide();
    $(".search-breed-dog").hide();
    $(".submit-dog").hide();
    $(".search-age-cat").show();
    $(".search-size-cat").show();
    $(".search-breed-cat").show();
    $(".submit-cat").show();
  });
  
  
}

// Event listener to start new search
$(".search-again").click(function (e) {
  e.preventDefault();
  $(".forms").hide();
  $(".buddy").show();
 $(displayForm);
});

$(displayForm);
