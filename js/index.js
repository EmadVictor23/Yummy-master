"use strict";
// Nav
function animationNavLink() {
  let navLink = $(".nav-link");
  if ($(".nav-body").hasClass("nav-show")) {
    for (let i = 0; i < navLink.length; i++) {
      $(".nav-link")
        .eq(i)
        .animate(
          {
            top: 0,
          },
          (i + navLink.length) * 50
        );
      $(".navbar-toggler").addClass("navbar-toggler-show");
    }
  } else {
    $(".nav-link").animate({
      top: 250,
    });
    $(".navbar-toggler").removeClass("navbar-toggler-show");
  }
}
$("#nav-btn").click(() => {
  toggleNav();
});
$("#nav-close .icon").click(() => {
  toggleNav();
});
function toggleNav() {
  // nav-show => class in css => transform: translateX(0%);
  $(".nav-body").toggleClass("nav-show");
  // .nav-link animation
  animationNavLink();
}
// change theme (dark & light mode) by toggle button
let circle = document.querySelector(".circle");
circle.onclick = function () {
  if (document.body.classList.contains("light")) {
    changeClassLight(false);
  } else {
    changeClassLight(true);
  }
};
function changeClassLight(el) {
  if (el) {
    document.body.classList.add("light");
    circle.classList.add("light");
    localStorage.setItem("siteMode", "light");
  } else {
    document.body.classList.remove("light");
    circle.classList.remove("light");
    localStorage.setItem("siteMode", "dark");
  }
}
if (localStorage.getItem("siteMode") == "light") {
  changeClassLight(true);
}

// this function responsible for show and hide details section
function showAndHide(show, hide) {
  show.fadeIn(500);
  hide.fadeOut(500);
}
// loader function
function showLoader() {
  $("#loader").fadeIn(10);
}
function hideLoader() {
  $("#loader").fadeOut(1000);
  document.body.classList.remove("show-loader");
}

// getAPI function
function getAPI(url) {
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      hideLoader();
      let res = response.meals;
      if (res) {
        let cartoona = "";
        for (let i = 0; i < res.length; i++) {
          cartoona += `
            <div data-id="${res[i].idMeal}" class="all-cards all-cards1 col-md-6 col-lg-4 col-xxl-3">
              <div class="float-div">
                <img src="${res[i].strMealThumb}" class="img-fluid">
                <div class="text">
                  <h2>${res[i].strMeal}</h2>
                </div>
              </div>
            </div> 
          `;
          $("#mainMeals").html(cartoona);
          $("#close").click(() => {
            showAndHide($("#main"), $("#details"));
          });
        }
        // show and hide details section
        let allCards = document.querySelectorAll(".all-cards1");
        for (let i = 0; i < allCards.length; i++) {
          allCards[i].addEventListener("click", () => {
            detailsAPI(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${allCards[i].dataset.id}`
            );
          });
        }
      } else {
        $("#mainMeals").html("<h2>No Data to Show</h2>");
      }
    });
}
getAPI("https://www.themealdb.com/api/json/v1/1/search.php?s=");

// detailsAPI function
function detailsAPI(url) {
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      let res = response.meals[0];
      $("#loader").fadeIn(10, function () {
        $("#loader").fadeOut(1000);
      });
      showAndHide($("#details"), $("#main"));
      // to get strMeasure
      let temp1 = "";
      for (let j = 1; j <= 20; j++) {
        if (eval(`res.strMeasure${j}`).trim() != "") {
          temp1 += `<li class="alert alert-info m-2 p-1">
              ${eval(`res.strMeasure${j}`)} ${eval(`res.strIngredient${j}`)}
              </li>`;
        }
      }
      // to get strTags
      let temp2 = "";
      if (res.strTags) {
        temp2 = "<h3>Tags :</h3>";
        let strTagsArr = res.strTags.split(",");
        for (let n = 0; n < strTagsArr.length; n++) {
          temp2 += `<li class="alert alert-warning m-2 p-1">${strTagsArr[
            n
          ].trim()}</li>`;
        }
      }
      // show data into details-div
      $("#details-div").html(
        `
            <div class="col-md-5 mb-2 left">
              <div class="img">
                <img src="${res.strMealThumb}" class="img-fluid mb-3" alt="">
                <h3>${res.strMeal}</h3>
              </div>
            </div>
            <div class="col-md-7 right">
              <h2>Instructions</h2>
              <p class=" fw-normal">${res.strInstructions}</p>
              <h3>Area : ${res.strArea}</h3>
              <h3>Category : ${res.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex flex-wrap">
                ${temp1}
              </ul>
              <ul class="list-unstyled d-flex flex-wrap  align-items-center">
                ${temp2}
              </ul>
              <div>
                <a href="${res.strSource}" target="_blnck" class=" mx-1 btn btn-sm btn-success">Source</a>
                <a href="${res.strYoutube}" target="_blnck" class=" mx-1 btn btn-sm btn-danger">Youtube</a>
              </div>
            </div>
            `
      );
    });
}

// clean mainMeals
let mainMeals = document.querySelector("#mainMeals");
function cleanMainMeals() {
  mainMeals.innerHTML = "";
}

// navLink clicks
$(".nav-link").click(function () {
  if (!this.classList.contains("nav-linkX")) {
    showLoader();
    hideLoader();
    toggleNav();
    cleanMainMeals();
    showAndHide($("#main"), $("#details"));
    if (this.innerHTML !== "Search") {
      $("#searchInputs").css("display", "none");
    }
    if (this.innerHTML != "Contact Us") {
      $("#ContactUsForm").css("display", "none");
    }
    if (this.innerHTML == "Home") {
      getAPI("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    }
    $(".nav-link").removeClass("active");
    this.classList.add("active");
  }
});

// all Cards Click function
function allCardsClick(url) {
  $("#loader").fadeIn(10, function () {
    $("#loader").fadeOut(1000);
  });
  getAPI(url);
}

// Search
$("#Search").click(() => {
  $("#searchInputs").css("display", "block");
  $(".inputX1").on("input", function () {
    $(".inputX2").val("");
    showLoader();
    let inputValue = $(".inputX1").val();
    getAPI(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
    );
  });
  $(".inputX2").on("input", function () {
    $(".inputX1").val("");
    let inputValue = $(".inputX2").val();
    showLoader();
    if ($(".inputX2").val() == "") {
      getAPI(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
      );
    } else {
      getAPI(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${inputValue}`
      );
    }
  });
});

// category
$("#Categories").click(() => {
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((response) => response.json())
    .then((response) => {
      hideLoader();
      let res = response.categories;
      let cartoona = "";
      for (let i = 0; i < res.length; i++) {
        cartoona += `
            <div data-id="${res[i].strCategory}" class="all-cards all-cards2 col-md-6 col-lg-4 col-xxl-3">
              <div class="float-div text-center">
                <img src="${res[i].strCategoryThumb}" class="img-fluid">
                <div class="text d-block overflow-auto justify-content-center flex-column">
                  <h2>${res[i].strCategory}</h2>
                  <p>${res[i].strCategoryDescription}</p>
                </div>
              </div>
            </div> 
          `;
      }
      $("#mainMeals").html(cartoona);
      // show and hide details section
      let allCards = document.querySelectorAll(".all-cards2");
      for (let i = 0; i < allCards.length; i++) {
        allCards[i].addEventListener("click", () => {
          allCardsClick(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${res[i].strCategory}`
          );
        });
      }
    });
});

// area
$("#Area").click(() => {
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    .then((response) => response.json())
    .then((response) => {
      let res = response.meals;
      let cartoona = "";
      for (let i = 0; i < res.length; i++) {
        cartoona += `
        <div class="all-cards all-cards1 text-center col-md-6 col-lg-4 col-xxl-3">
          <div class="float-div">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h2>${res[i].strArea}</h2>
          </div>
        </div> 
      `;
        $("#mainMeals").html(cartoona);
        let allCards = document.querySelectorAll(".all-cards");
        for (let i = 0; i < allCards.length; i++) {
          allCards[i].addEventListener("click", () => {
            allCardsClick(
              `https://www.themealdb.com/api/json/v1/1/filter.php?a=${res[i].strArea}`
            );
          });
        }
      }
    });
});

// ingredient
$("#Ingredients").click(() => {
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    .then((response) => response.json())
    .then((response) => {
      let res = response.meals;
      let cartoona = "";
      for (let i = 0; i < 20; i++) {
        cartoona += `
        <div class="all-cards all-cards1 text-center col-md-6 col-lg-4 col-xxl-3">
          <div class="float-div">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h2>${res[i].strIngredient}</h2>
          </div>
        </div> 
      `;
        $("#mainMeals").html(cartoona);
        let allCards = document.querySelectorAll(".all-cards");
        for (let i = 0; i < allCards.length; i++) {
          allCards[i].addEventListener("click", () => {
            allCardsClick(
              `https://www.themealdb.com/api/json/v1/1/filter.php?i=${res[i].strIngredient}`
            );
          });
        }
      }
    });
});

// Contact Us
$("#ContactUs").click(() => {
  $("#ContactUsForm").css("display", "flex");
  const inputs = document.querySelectorAll(".formInput");
  const inValid = document.querySelectorAll(".inValid");
  const submit = document.querySelector("#submit");
  const exampleCheck1 = document.querySelector("#exampleCheck1");
  const formCheckLabel = document.querySelector(".form-check-label");
  exampleCheck1.onclick = () => {
    if (exampleCheck1.checked) {
      formCheckLabel.innerHTML = "Hide Password";
      inputs[4].type = "text";
      inputs[5].type = "text";
    } else {
      formCheckLabel.innerHTML = "Show Password";
      inputs[4].type = "password";
      inputs[5].type = "password";
    }
  };
  submit.setAttribute("disabled", "");
  for (let i = 0; i < inputs.length; i++) {
    // check if re password is valid or not
    inputs[5].addEventListener("input", () => {
      isPassword();
    });
    inputs[4].addEventListener("input", () => {
      isPassword();
    });
    // check inputs
    inputs[i].addEventListener("input", () => {
      if (inputs[5].value == inputs[4].value) {
        inValid[5].style.display = "none";
      }
      reg(/^[a-z]{1,9}$/, 0);
      reg(
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        1
      );
      reg(/^01[0125]\d{8}$/, 2);
      reg(/^([1-9]\d?|100)$/, 3);
      reg(/^(?=.*[a-z])(?=.*\d).{8,}$/, 4);
      // to disabled button untill inputs be valid
      if (
        reg(/^[a-z]{1,9}$/, 0) &&
        reg(
          /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          1
        ) &&
        reg(/^01[0125]\d{8}$/, 2) &&
        reg(/^([1-9]\d?|100)$/, 3) &&
        reg(/^(?=.*[a-z])(?=.*\d).{8,}$/, 4) &&
        inputs[5].value == inputs[4].value
      ) {
        submit.removeAttribute("disabled");
      } else {
        submit.setAttribute("disabled", "");
      }
      // to prevent another inputs show error msg
      inputs.forEach((el, index) => {
        if (el.value == "") {
          inValid[index].style.display = "none";
        }
      });
    });
  }
  function reg(regex, i) {
    if (regex.test(inputs[i].value)) {
      inValid[i].style.display = "none";
      return true;
    } else {
      inValid[i].style.display = "block";
    }
  }
  function isPassword() {
    if (inputs[5].value != inputs[4].value) {
      inValid[5].style.display = "block";
    } else {
      inValid[5].style.display = "none";
    }
  }
});
