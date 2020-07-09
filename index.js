
"use strict";


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

    <div class="card"><a href="detail.html">
   
   <img class="card-image" src="${result.attributes.pictureThumbnailUrl}" />
    <div class="card-container">
   
   <h4>${result.attributes.name} </h4>
        
   <p>${result.attributes.breedPrimary}</p>
     <p>${result.attributes.ageGroup}</p>
     </a>
     </div>
     </div>`);

    $("#pet-detail").append(`
      
      
       <img class="card-image" src="${result.attributes.pictureThumbnailUrl}" />
    <div class="card-container">
   
   <h4>${result.attributes.name} </h4>
        
   <p>${result.attributes.breedPrimary}</p>
     <p>${result.attributes.ageGroup}</p>
       
       
       <p>(${result.id})</p>
          <p>${pictureHTML}</p> 
       
       <p>Description Text: ${result.attributes.descriptionText}</p>
       <p>Activity Level: ${result.attributes.activityLevel}</p>
       <p>Coat Length: ${result.attributes.coatLength}</p>
       <p>Current on Vaccinations: ${result.attributes.isCurrentVaccinations}</p>
     <p>Good with Other Dogs: ${result.attributes.isDogsOk}</p>
       <p>Good with Kids: ${result.attributes.isKidsOk}</p>
       <p>Good with New People: ${result.attributes.newPeopleReaction}</p>
       <p>Previous Owner: ${result.attributes.ownerExperience}</p>
       <p>Size: ${result.attributes.sizeGroup}</p>
       <p>Special Needs: ${result.attributes.isSpecialNeeds}</p>
      <p>Video Count: ${result.attributes.videoCount}</p>
       <p>Video URL Count: ${result.attributes.VideoUrlCount}</p>
       <p>Created Date: ${result.attributes.createdDate}</p>
       <p>Picture Count${result.attributes.pictureCount}</p>  
      
 <p>
  <a href="${result.attributes.pictureThumbnailUrl}">Thumb</a>
</p>
<p>Sex: ${result.attributes.sex}</p>
 <p>
  


    `);
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
) 
 {




  const raw = {
    data: {
      filterRadius: { 
          miles: searchMiles, 
          postalcode: searchZip 
        }
    }
  };

    
  
//     data: {
//         filters: 
//     	[
//     		{
//     			fieldName: animals.sex,
//     			operation: equal,
//     			criteria: searchGender
//     		},
//     		{
//     			fieldName: animals.sizeGroup,
//     			operation: equal,
//     			criteria: searchSize
//     		}
//     	],
//     	filterProcessing: 1 and 2,
//         filterRadius:
//         	{
//         		miles: searchMiles, 
//                 postalcode: searchZip
//         	}
        
//     }
// };


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
    $(".pic-dog").show();
    $(".pic-cat").hide();
    // $(".search-size-cat").hide();
    // $(".search-breed-cat").hide();
    // $(".submit-cat").hide();
    $(".search-age").show();
    $(".search-size-dog").show();
    $(".search-breed-dog").show();
    $(".submit-dog").show();
    species = "dogs";
    watchForm(species);
  });

//   $(".cat-pic").click(function (e) {
//     e.preventDefault();
//     $(".buddy").hide();
//     $(".forms").show();
//     $(".pic-cat").show();
//     $(".pic-dog").hide();
//     $(".search-size-dog").hide();
//     $(".search-breed-dog").hide();
//     $(".submit-dog").hide();
//     $(".search-age").show();
//     $(".search-size-cat").show();
//     $(".search-breed-cat").show();
//     $(".submit-cat").show();
//     species =  "cats";
//     console.log(species);
//     watchForm(species);
//   });
  
  
  
}

// Event listener to start new search
$(".search-again").click(function (e) {
  e.preventDefault();
  $(".forms").hide();
   $("#results").addClass("hidden");
  $(".buddy").show();
  species = "";
 $(displayForm);
});

$(displayForm);
