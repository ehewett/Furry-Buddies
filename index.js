const searchURL =
  "https://api.rescuegroups.org/v5/public/animals/search/?fields[animals]=";

let animalType = "";

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  if (responseJson.meta.count == 0) {
    console.log(responseJson.meta.count);
    $("#results-list")
      .append(`<h2>No furry buddies found. Please try a different search.</h2>
      `);
  } else {
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
    <div class="card"  data-thumbnail="${result.attributes.pictureThumbnailUrl}" data-name="${result.attributes.name}" data-breed="${result.attributes.breedPrimary}" data-age="${result.attributes.ageGroup}">
        <img class="card-image" src="${result.attributes.pictureThumbnailUrl}" />
        <div class="card-container">
          <h4>${result.attributes.name} </h4>
          <p>${result.attributes.breedPrimary}</p>
          <p>${result.attributes.ageGroup}</p>
          <p>${result.attributes.sex}</p>
          <p>${result.attributes.sizeGroup}</p>
        
        </div>
    </div>`);
    }
  }
  //display the results section
  $(".forms").hide();
  $("#results").removeClass("hidden");
}

function getAnimals(
  animalType,
  searchGender,
  searchZip,
  searchMiles,
  searchAge,
  searchSize,
  searchBreed
) {
  console.log(animalType);
  const raw = {
    data: {
      filters: [],
      // filterProcessing: "1 and 2",
      filterRadius: {
        miles: searchMiles,
        postalcode: searchZip,
      },
    },
  };

  if (animalType !== "") {
    raw.data.filters.push({
      fieldName: "species.singular",
      operation: "equals",
      criteria: animalType,
    });
  }

  if (searchGender !== "") {
    raw.data.filters.push({
      fieldName: "animals.sex",
      operation: "equal",
      criteria: searchGender,
    });
  }

  if (searchAge !== "") {
    raw.data.filters.push({
      fieldName: "animals.ageGroup",
      operation: "equal",
      criteria: searchAge,
    });
  }

  if (searchBreed !== "") {
    raw.data.filters.push({
      fieldName: "animals.breedPrimary",
      operation: "equal",
      criteria: searchBreed,
    });
  }

  if (searchSize !== "") {
    raw.data.filters.push({
      fieldName: "animals.sizeGroup",
      operation: "equal",
      criteria: searchSize,
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

function watchForm(animalType) {
  $("form").submit((event) => {
    event.preventDefault();

    const searchGender = $("#search-gender").val();
    const searchZip = $("#search-zip").val();
    const searchMiles = $("#search-miles").val();
    const searchAge = $("#search-age").val();
    let searchSize = "";
    let searchBreed = "";


    if (animalType === "Dog") {
  

   searchSize = $("#search-size-dog").val();
   searchBreed = $("#search-breed-dog").val();
} else {
  searchSize = $("#search-size-cat").val();
  searchBreed = $("#search-breed-cat").val();
}
   
    getAnimals(
      animalType,
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
    $(".show-dog").show();
    $(".show-cat").hide();
    animalType = "Dog";
    watchForm(animalType);
  });

  $(".cat-pic").click(function (e) {
    e.preventDefault();
    $(".buddy").hide();
    $(".forms").show();
    $(".show-dog").hide();
    $(".show-cat").show();
    animalType = "Cat";
    watchForm(animalType);
  });

  // $("#modal .close").click(function (e) {
  //   e.preventDefault();
  //   $("#overlay").fadeOut();
  //   $("#modal").fadeOut();
  // });

  // $("#overlay").click(function () {
  //   $("#overlay").fadeOut();
  //   $("#modal").fadeOut();
  // });

  // $("#results-list").on("click", ".card", function () {
  //   let name = $(this).data("name");
  //   let thumbnail = $(this).data("thumbnail");
  //   let breed = $(this).data("breed");
  //   let age = $(this).data("age");
  //   $("#modal h2").text(name);
  //   $("#modal img").attr("src", thumbnail);
  //   $("#modal p.breed").text(breed);
  //   $("#modal p.age").text(age);
  //   $("#overlay").fadeIn();
  //   $("#modal").fadeIn();
  // });
}

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

  // let pics = $(this).data("pics");
  $("#modal h2").text(name);
  $("#modal img").attr("src", thumbnail);
  // $("#modal img").attr("src", pics);
  $("#modal p.breed").text(breed);
  $("#modal p.age").text(age);
  $("#overlay").fadeIn();
  $("#modal").fadeIn();
});

// Event listener to start new search
$(".search-again").click(function (e) {
  e.preventDefault();
  $(".forms").hide();
  $("#results").addClass("hidden");
  $(".buddy").show();
  animalType = "";
  $("#search-form")[0].reset();
});

$(displayForm);
