/*-------------------------------------------------------------------------
/ GLOBAL VARIABLES
/-------------------------------------------------------------------------*/
const danceMoves = ["moonwalk", "disco", "breakdance", "krump", "pop and lock", "stanky leg", "gangnam style", "bollywood", "twerk", "salsa"];
const giphyKey = "eaYlz4wDNsFJscQbZ624ZqdUmfjZg3RB";
const numGifs = 10;
const baseURL = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&limit=${numGifs}&q=`;
const mediaQueryList = window.matchMedia("(min-width: 900px)");
let isMobile = false;
let favorites = JSON.parse(localStorage.getItem("favoriteGiphys"));


/*-------------------------------------------------------------------------
/ CONSTRUCTORS & FUNCTIONS
/-------------------------------------------------------------------------*/
function displayGif(gifStill, gifAnimated, gifRating) {
    const newGifDiv = $("<div>").addClass("gif-container");
    const newGifImage = $("<img>");
    const newRatingText = $("<p>").addClass("rating");
    const newFavoriteButton = $("<p>").addClass("favorite-button");
    if (favorites.findIndex(i => i.dataStill === gifStill) === -1) {
        newFavoriteButton.html("<i class='far fa-star'></i>");
    } else {
        newFavoriteButton.addClass("favorited").html("<i class='fas fa-star'></i>");
    }
    newGifImage.attr("src", gifStill).attr("data-still", gifStill).attr("data-animated", gifAnimated).attr("data-state", "still");
    newRatingText.text(`Rating: ${gifRating}`);
    newFavoriteButton.attr("href", gifAnimated);
    newGifDiv.append(newGifImage);
    newGifDiv.append(newRatingText);
    newGifDiv.append(newFavoriteButton);
    $("#gifs").append(newGifDiv);
}

function toggleAnimation(jQueryImg) {
    if (jQueryImg.attr("data-state") === "still") {
        jQueryImg.attr("src", jQueryImg.attr("data-animated"));
        jQueryImg.attr("data-state", "animated");
    } else {
        jQueryImg.attr("src", jQueryImg.attr("data-still"));
        jQueryImg.attr("data-state", "still");
    }
}

function addMoveButtonsToPage() {
    $("#buttons").empty();
    danceMoves.forEach((move) => {
        const newButton = $("<button>").text(move);
        $("#buttons").append(newButton);
    });
}

function handleMediaQueryChange(mq) {
    if (mq.matches) {
        isMobile = false;
    } else {
        isMobile = true;
    }
}

/*-------------------------------------------------------------------------
/ MAIN PROCESS
/-------------------------------------------------------------------------*/
addMoveButtonsToPage();

$("#show-favorites").on("click", () => {
    $("#gifs").empty();
    favorites.forEach((favorite) => {
        displayGif(favorite.dataStill, favorite.dataAnimated, favorite.rating);
    });
    if (isMobile) {
        $("html, body").animate({
            scrollTop: $("#gifs").offset().top,
        }, 1000);
    }
    $("aside").addClass("full-vh");
});

$("#buttons").on("click", "button", function () {
    const clickedMove = $(this).text();
    const queryURL = baseURL + clickedMove;
    $("#gifs").empty();
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then((response) => {
        response.data.forEach((gifData) => {
            const gifStill = gifData.images.fixed_height_still.url;
            const gifAnimated = gifData.images.fixed_height.url;
            const gifRating = gifData.rating;
            displayGif(gifStill, gifAnimated, gifRating);
        });
    });
    if (isMobile) {
        $("html, body").animate({
            scrollTop: $("#gifs").offset().top,
        }, 1000);
    }
    $("aside").addClass("full-vh");
});

$("#gifs").on("click", "img", function () {
    toggleAnimation($(this));
});

$("#gifs").on("click", ".favorite-button", function () {
    const favImage = $(this).siblings()[0];
    const imgRating = $(this).siblings()[1];
    const favImageObj = {
        dataStill: $(favImage).attr("data-still"),
        dataAnimated: $(favImage).attr("data-animated"),
        rating: $(imgRating).text().replace("Rating: ", ""),
    };
    if ($(this).hasClass("favorited")) {
        $(this).removeClass("favorited");
        favorites.splice(favorites.findIndex(i => i.dataStill === favImageObj.dataStill), 1);
        $(this).html("<i class='far fa-star'></i>");
    } else {
        $(this).addClass("favorited");
        favorites.push(favImageObj);
        $(this).html("<i class='fas fa-star'></i>");
    }
    localStorage.setItem("favoriteGiphys", JSON.stringify(favorites));
});

$("#submit-new-move").on("click", (e) => {
    e.preventDefault();
    const newMove = $("#new-move-input").val().trim();
    if (newMove) {
        danceMoves.push(newMove);
        addMoveButtonsToPage();
    }
    $("#new-move-input").val("");
});

// media query event handler
mediaQueryList.addListener(handleMediaQueryChange);
handleMediaQueryChange(mediaQueryList);


$(window).scroll(() => {
    const windowTop = $(window).scrollTop();

    if ($("header").height() < windowTop) {
        $("aside").addClass("sticky-top");
    } else {
        $("aside").removeClass("sticky-top");
    }
});

if (!Array.isArray(favorites)) {
    favorites = [];
}
