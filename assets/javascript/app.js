/*-------------------------------------------------------------------------
/ GLOBAL VARIABLES
/-------------------------------------------------------------------------*/
const danceMoves = ["moonwalk", "disco", "breakdance", "krump", "pop and lock", "stanky leg", "gangnam style", "bollywood", "twerk", "salsa"];
const giphyKey = "eaYlz4wDNsFJscQbZ624ZqdUmfjZg3RB";
const numGifs = 10;
const baseURL = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&limit=${numGifs}&q=`;
const mediaQueryList = window.matchMedia("(min-width: 900px)");


/*-------------------------------------------------------------------------
/ CONSTRUCTORS & FUNCTIONS
/-------------------------------------------------------------------------*/
function displayGif(gifData) {
    const newGifDiv = $("<div>").addClass("gif-container");
    const newGifImage = $("<img>");
    const newRatingText = $("<p>");
    const gifStill = gifData.images.fixed_height_still.url;
    const gifAnimated = gifData.images.fixed_height.url;
    const gifRating = gifData.rating;
    newGifImage.attr("src", gifStill).attr("data-still", gifStill).attr("data-animated", gifAnimated).attr("data-state", "still");
    newRatingText.text(`Rating: ${gifRating}`);
    newGifDiv.append(newGifImage);
    newGifDiv.append(newRatingText);
    $("#gifs").append(newGifDiv);
}

function toggleAnimation(jQueryImg) {
    console.log(jQueryImg.attr("data-still"));
    if (jQueryImg.attr("data-state") === "still") {
        jQueryImg.attr("src", jQueryImg.attr("data-animated"));
        jQueryImg.attr("data-state", "animated");
    } else {
        jQueryImg.attr("src", jQueryImg.attr("data-still"));
        jQueryImg.attr("data-state", "still");
    }
}

function addMoveToPage() {
    $("#buttons").empty();
    danceMoves.forEach((move) => {
        const newButton = $("<button>").text(move);
        $("#buttons").append(newButton);
    });
}

function handleMediaQueryChange(mq) {
    if (mq.matches) {
        console.log("mq matches");
    } else {
        console.log("mq doesn't match");
    }
}

/*-------------------------------------------------------------------------
/ MAIN PROCESS
/-------------------------------------------------------------------------*/
addMoveToPage();

$("#buttons").on("click", "button", function () {
    const clickedMove = $(this).text();
    const queryURL = baseURL + clickedMove;
    $("#gifs").empty();
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then((response) => {
        console.log(response.data);
        response.data.forEach((gifData) => {
            displayGif(gifData);
        });
    });

    $("html, body").animate({
        scrollTop: $("#gifs").offset().top
    }, 1000);
});

$("#gifs").on("click", "img", function () {
    toggleAnimation($(this));
});

$("#submit-new-move").on("click", (e) => {
    e.preventDefault();
    const newMove = $("#new-move-input").val().trim();
    if (newMove) {
        danceMoves.push(newMove);
        addMoveToPage();
    }
    $("#new-move-input").val("");
});

// media query event handler
mediaQueryList.addListener(handleMediaQueryChange);
handleMediaQueryChange(mediaQueryList);
