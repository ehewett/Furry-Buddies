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
      let pictureHTML = [];

      let orgHTML = [];
      let included = responseJson.included;
      let result = responseJson.data[i];
      if (result.relationships.pictures) {
        result.relationships.pictures.data.forEach((picObj) => {
          const picture = included.find(
            (inc) => inc.id === picObj.id && inc.type === "pictures"
          );

          if (picture) {
            pictureHTML.push(picture.attributes.large.url);
          }
        });
      }

      if (!pictureHTML.length) {
        pictureHTML.push("https://placeholder.com/50x50");
      }

      if (result.relationships.orgs) {
        result.relationships.orgs.data.forEach((orgObj) => {
          const org = included.find(
            (inc) => inc.id === orgObj.id && inc.type === "orgs"
          );

          if (org) {
            orgHTML.push(
              org.attributes.name,
              org.attributes.email,
              org.attributes.url
            );
          }
        });
      }

      if (!orgHTML.length) {
        orgHTML.push("No Info Available");
      }

      $("#results-list").append(`
    <div class="card" data-orgs="${orgHTML}" data-pictures="${pictureHTML}" data-description="${
        result.attributes.descriptionText
      }" data-name="${result.attributes.name}" data-breed="${
        result.attributes.breedPrimary
      }" data-sex="${result.attributes.sex}" data-size=" 
    ${result.attributes.sizeGroup}" data-age="${result.attributes.ageGroup}">
        <img class="card-image" src="${
          result.attributes.pictureThumbnailUrl
        }" />
        <div class="card-container">
          <h4>${result.attributes.name} </h4>
          <p>${result.attributes.breedPrimary}</p>
          <p class="age-size">${
            result.attributes.ageGroup ? result.attributes.ageGroup : ""
          } </p>
          <p class="age-size">${
            result.attributes.sex ? result.attributes.sex : ""
          }</p>
          <p class="age-size">${
            result.attributes.sizeGroup ? result.attributes.sizeGroup : ""
          }</p>
          
         
        
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

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();

    console.log("form was submitted", animalType);

    const searchGender = $("#search-gender").val();
    const searchZip = $("#search-zip").val();
    const searchMiles = $("#search-miles").val();
    const searchAge = $("#search-age").val();
    let searchSize = $(`#search-size-${animalType}`).val();
    let searchBreed = $(`#search-breed-${animalType}`).val();

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
    animalType = "dog";
  });

  $(".cat-pic").click(function (e) {
    e.preventDefault();
    $(".buddy").hide();
    $(".forms").show();
    $(".show-dog").hide();
    $(".show-cat").show();
    animalType = "cat";
  });

  watchForm();
}

// Disaplys modal window
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
  let breed = $(this).data("breed");
  let size = $(this).data("size") !== "undefined" ? $(this).data("size") : "";
  let sex = $(this).data("sex") !== "undefined" ? $(this).data("sex") : "";
  let age = $(this).data("age") !== "undefined" ? $(this).data("age") : "";
  let org = $(this).data("orgs").split(",");
  let pics = $(this).data("pictures").split(",");
  let description = $(this).data("description");

  $("#modal .additional-images").html("");
  pics.forEach(function (picture) {
    $("#modal .additional-images").append(
      `<img src="${picture}" class="additional-images"/>`
    );
  });

  $("#modal h2").text(name);
  $("#modal p.breed").text(breed);
  $("#modal li.age").text(age);
  $("#modal li.sex").text(sex);
  $("#modal li.size").text(size);

  $("#modal p.description").text(description);
  $("#modal p.org-name").text(org[0]);
  $("#modal p.org-email").html(`<a href="mailto:${org[2]}">Email</a>`);
  $("#modal p.org-url").html(`<a href="${org[3]}" target="_blank">Website</a>`);

  $("#overlay").fadeIn();
  $("#modal").fadeIn();
});

// Event listener to start new search
$("body").on("click", ".search-again", function (e) {
  e.preventDefault();
  $(".forms").hide();
  $("#results").addClass("hidden");
  $(".buddy").show();
  animalType = "";
  $("#search-form")[0].reset();
});

$(displayForm);
