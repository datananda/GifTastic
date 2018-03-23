/*-------------------------------------------------------------------------
/ GLOBAL VARIABLES
/-------------------------------------------------------------------------*/
const danceMoves = ["moonwalk", "disco", "breakdance", "krump", "pop and lock", "stanky leg", "gangnam style", "bollywood", "twerk", "salsa"];
const giphyKey = "eaYlz4wDNsFJscQbZ624ZqdUmfjZg3RB";
const numGifs = 10;
const baseURL = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&limit=${numGifs}&q=`;

/*-------------------------------------------------------------------------
/ CONSTRUCTORS & FUNCTIONS
/-------------------------------------------------------------------------*/
function displayGif(gifData) {
    const newGifDiv = $("<div>");
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

function addMovesToPage() {
    $("#buttons").empty();
    danceMoves.forEach((move) => {
        const newButton = $("<button>").text(move);
        $("#buttons").append(newButton);
    });
}

/*-------------------------------------------------------------------------
/ MAIN PROCESS
/-------------------------------------------------------------------------*/
addMovesToPage();

$("#buttons").on("click", "button", function () {
    console.log($(this).text());
    const clickedMove = $(this).text();
    const queryURL = baseURL + clickedMove;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then((response) => {
        console.log(response.data);
        response.data.forEach((gifData) => {
            displayGif(gifData);
        });
    });
});

$("#gifs").on("click", "img", function () {
    toggleAnimation($(this));
});

$("#submit-new-move").on("click", (e) => {
    e.preventDefault();
    const newMove = $("#new-move-input").val().trim();
    if (newMove) {
        danceMoves.push(newMove);
        addMovesToPage();
    }
    $("#new-move-input").val("");
});
