const searchURL =
  "https://api.rescuegroups.org/v5/public/animals/search/?fields[animals]=";

let species = "";

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the data array
  for (let i = 0; i < responseJson.data.length; i++) {
    let pictureHTML = "";
    let included = responseJson.included;
    let result = responseJson.data[i];
    result.relationships.pictures.data.forEach((picObj) => {
      const picture = included.find(
        (inc) => inc.id === picObj.id && inc.type === "pictures"
      );

      pictureHTML +=
        picture !== undefined
          ? `<img src="${picture.attributes.large.url}"/>`
          : "";
    });

    $("#results-list").append(`
    <div class="card" data-thumbnail="${result.attributes.pictureThumbnailUrl}" data-name="${result.attributes.name}" data-breed="${result.attributes.breedPrimary}" data-age="${result.attributes.ageGroup}">
        <img class="card-image" src="${result.attributes.pictureThumbnailUrl}" />
        <div class="card-container">
          <h4>${result.attributes.name} </h4>
          <p>${result.attributes.breedPrimary}</p>
          <p>${result.attributes.ageGroup}</p>
        </div>
    </div>`);
  }
  //display the results section
  $(".forms").hide();
  $("#results").removeClass("hidden");
}

function getAnimals(
  species,
  searchGender,
  searchZip,
  searchMiles,
  searchAge,
  searchSize,
  searchBreed
) {
  const raw = {
    // data: {
    //   filterRadius: {
    //       miles: searchMiles,
    //       postalcode: searchZip
    //     }
    // }

    data: {
      filters: [],
      filterProcessing: "1 or 2",
      filterRadius: {
        miles: searchMiles,
        postalcode: "76112",
      },
    },
  };

  if (searchSize !== "") {
    raw.data.filters.push({
      fieldName: "animals.sizeGroup",
      operation: "equal",
      criteria: searchSize,
    });
  }

  if (searchGender !== "") {
    raw.data.filters.push({
      fieldName: "animals.sex",
      operation: "equal",
      criteria: searchGender,
    });
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authorization: "iWtKOTLA",
    },
    body: JSON.stringify(raw),
  };

  const field =
    "distance,ageGroup,breedString,breedPrimary,descriptionText,activityLevel,coatLength,isCurrentVaccinations,isDogsOk,isKidsOk,newPeopleReaction,ownerExperience,sizeGroup,isSpecialNeeds,name,videoCount,VideoUrlCount,pictureCount,pictureThumbnailUrl,sex,adoptionFeeString,isCatsOk,sizeCurrent,sizePotential,url";

  const url = searchURL + field;

  console.log(url);
  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm(species) {
  $("form").submit((event) => {
    event.preventDefault();

    const searchGender = $("#search-gender").val();
    const searchZip = $("#search-zip").val();
    const searchMiles = $("#search-miles").val();
    const searchAge = $("#search-age").val();

    // if (species === "dogs") {

    const searchSize = $("#search-size-dog").val();

    const searchBreed = $("#search-breed-dog").val();

    // else {

    // const searchSize = $("#search-size-cat").val();
    // const searchBreed = $("#search-breed-cat").val();

    // }

    getAnimals(
      species,
      searchGender,
      searchZip,
      searchMiles,
      searchAge,
      searchSize,
      searchBreed
    );
  });
}

function displayForm() {
  $(".dog-pic").click(function (e) {
    e.preventDefault();
    $(".buddy").hide();
    $(".forms").show();
    $(".hide-cat").show();
    $(".hide-dog").hide();
    species = "dogs";
    watchForm(species);
  });

  $(".cat-pic").click(function (e) {
    e.preventDefault();
    $(".buddy").hide();
    $(".forms").show();
    $(".hide-cat").hide();
    $(".hide-dog").show();
    species = "cats";
    console.log(species);
    watchForm(species);
  });

  $("#modal .close").click(function (e) {
    e.preventDefault();
    $("#overlay").fadeOut();
    $("#modal").fadeOut();
  });

  $("#overlay").click(function () {
    $("#overlay").fadeOut();
    $("#modal").fadeOut();
  });

  $("#results-list").on("click", ".card", function () {
    let name = $(this).data("name");
    let thumbnail = $(this).data("thumbnail");
    let breed = $(this).data("breed");
    let age = $(this).data("age");
    $("#modal h2").text(name);
    $("#modal img").attr("src", thumbnail);
    $("#modal p.breed").text(breed);
    $("#modal p.age").text(age);
    $("#overlay").fadeIn();
    $("#modal").fadeIn();
  });
}

// Event listener to start new search
$(".search-again").click(function (e) {
  e.preventDefault();
  $(".forms").hide();
  $("#results").addClass("hidden");
  $(".buddy").show();
  species = "";
});

$(displayForm);
