$(document).ready(function() {
    var topics = ["luke skywalker", "han solo", "anakin skywalker", "kylo ren", "chewbacca", "yoda", "mace windu", "padme amidala", "leia organa"];
    var favorites = [];
    var currentResults = [];
    var personResults = [];

    if(localStorage.length > 0){
        for(var i = 0; i < localStorage.length; i++){
            var savedFavorite = localStorage.key(i);
            renderFavorite(savedFavorite);
        }
    }


    for(var i = 0; i < topics.length; i++){
        var newButton = $("<button>");
        newButton.attr({
            class: "button m-3 text-capitalize",
            id: "item" + [i],
            "data-person": topics[i]
        }).text(topics[i]);
        $("#buttonGallery").append(newButton);
    }


    $("#submitTopic").on("click", function(event){
        event.preventDefault();
        var newTopic = $("#searchTopic").val().toLowerCase();
        if(topics.indexOf(newTopic) > -1) {
            $("#searchTopic").val("");   
        } else {
            topics.push(newTopic);
            addButton();
            $("#searchTopic").val("");
        }
    })


function addButton(){
    $("#buttonGallery").empty();
    for(var i = 0; i < topics.length; i++){
        var newButton = $("<button>");
        newButton.attr({
            class: "button m-3 text-capitalize",
            id: "item" +[i],
            "data-person": topics[i]
        }).text(topics[i]);
        $("#buttonGallery").append(newButton);
    }
}


    $(document).on("click", ".button", function() {
        $("#gallery").empty();
        currentResults = [];
        $("#currentSearch").empty();
        var buttonPressed = $(this).attr("id");
        var person = $(this).attr("data-person");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            person + "&api_key=yDQ5zIEWEoqMVh1HIEOnKIg9kIRhxKYn" + "&limit=10";
   
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {        
            var results = response.data; 
            var currentPerson = $("<h1 class='p-3 my-auto' id='current'>");
            currentPerson.text(person);
            $("#currentSearch").append(currentPerson);
            renderImages(results);
            addMoreButton(person);
        })
    
    })


    function addMoreButton(character){
        $("#moreContainer").empty();
        var moreGif = $('<button class="btn btn-primary btn-lg btn-block" type="button">');
        moreGif.text("More");
        moreGif.attr({
            id: "buttonMore",
            "data-value": character
        })
        $("#moreContainer").append(moreGif);
    }


    function renderImages(imageGifs){
        for (var i = 0; i < imageGifs.length; i++) {
            currentResults.push(imageGifs[i]);
            var charDiv = $("<div class='item mr-3 text-center'>");
            var infoDiv = $("<div class='card my-3'>");
            var rating = imageGifs[i].rating;
            var title = imageGifs[i].title;
            var p = $("<p class='text-center text-capitalize'>").text("Rating: " + rating);
            var h = $("<p class='text-center m-3 text-capitalize'>").text(title);
            var imageDownload = $('<a class="align-self-center" href="#" download>');
            var favorite = $("<button class='btn favorite btn-outline-primary'>");
            var personImage = $('<img class="gif img-thumbnail">');
            var personFoot = $('<div class="d-flex justify-content-around">');

            personImage.attr({
                src: imageGifs[i].images.fixed_height_still.url,
                "data-still": imageGifs[i].images.fixed_height_still.url,
                "data-animate": imageGifs[i].images.fixed_height.url,
                "data-state": "still",
                id: imageGifs[i].id
            }); 
            personId = personImage.attr("id");
            var personImageSource = personImage.attr("src");
            personValue = [i];
            imageDownload.attr({
                href: personImageSource,
                "download": "image.gif"}).text("Download");        
            charDiv.attr("id", "image" + personValue);
            favorite.attr({
                "type": "button",
                "data-toggle": "button",
                "aria-pressed": "false",
                "autocomplete": "off",
                "data-value": personValue,
                "data-id": personId,
                id: "class" +  personId,
            }).text("Favorite");  
            personFoot.prepend(imageDownload);
            personFoot.prepend(favorite);
            infoDiv.prepend(personFoot);
            infoDiv.prepend(p);
            infoDiv.prepend(h);
            charDiv.prepend(infoDiv);
            charDiv.prepend(personImage);
            $("#gallery").append(charDiv);    
        }
    }
    

    $(document).on("click", "#buttonMore", function() {
        var offsetCounter = Math.floor(Math.random() * 1001) + 1;
        console.log(offsetCounter);
        var person = $(this).data("value");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        person + "&api_key=yDQ5zIEWEoqMVh1HIEOnKIg9kIRhxKYn" + "&limit=10&offset="+ offsetCounter +"&rating=G&lang=en";   
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var more = response.data;
            renderImages(more);
            addMoreButton(person);
        })
    })    
 

    $(document).on("click", ".gif", function() {    
        var animateImage =  $(this).attr("src");     
        var state = $(this).attr("data-state");

        if(state === "still") {
            $(this).attr("data-state", "animate");   
            $(this).attr("src", $(this).data("animate"));
                
        } else {         
            $(this).attr("data-state", "still");           
            $(this).attr("src", $(this).attr("data-still"));
            }      
    });

    function favButtonRebuilder() {
        $(".infoDiv").append($("<button class='btn favorite btn-outline-primary replacement'>"));
        $(".replacement").attr({
            "type": "button",
            "data-toggle": "button",
            "aria-pressed": "false",
            "autocomplete": "off",
            "data-value": personValue,
            "data-id": personId,
            id: personId
        }).text("Favorite");
    }

    $(document).on("click", ".favorite", function() {
        var favValue = $(this).data("value");
        var chosenFavorite = currentResults[favValue];
        var favID = chosenFavorite.id;

        if($(this).hasClass("active") === true){
            personResults.push(favID);
            localStorage.setItem(favID, JSON.stringify(chosenFavorite));
            renderFavorite(favID);
        } else {
            personResults.splice(personResults.indexOf(favID, 0),1);
            renderFavorite(favID);
            localStorage.removeItem(favID);
            
            
            $("." + favID).remove();
        }
    })
   

    function renderFavorite(idFav) {
        var newFavorite = JSON.parse(localStorage.getItem(idFav));
        var favTitle = newFavorite.title;
        var favRating = newFavorite.rating;
        var cardFav = $("<div class='item mr-3 text-center'>");
        var cardImg = $('<img class="gif img-thumbnail">');
        var cardStats = $("<div class='card my-3 text-capitalize'>");
        var cardFoot = $("<div class='d-flex justify-content-around'>");
        var cardTitle =  $("<p class='text-center m-3 text-capitalize'>").text(favTitle);
        var cardRating = $("<p class='text-center text-capitalize'>").text("Rating:" + favRating);
        var favDownload = $('<a class="align-self-center" href="#" download>');
        var unfavorite = $("<button class='btn unfavorite active btn-outline-primary'>");
        cardImg.attr({
            src: newFavorite.images.fixed_height_still.url,
            id: newFavorite.id
        });
        var favImageSource = cardImg.attr("src"); 
        cardImg.attr({
            "data-still": newFavorite.images.fixed_height_still.url,
            "data-animate": newFavorite.images.fixed_height.url,
            "data-state": "still"
        });
        unfavorite.attr({  
            "type": "button",
            "data-toggle": "button",
            "aria-pressed": "true",
            "autocomplete": "off",
            "data-id": cardImg.attr("id")
        }).text("Favorite");
        favDownload.attr({
            href: favImageSource,
            "download": "image.gif"
        }).text("Download");
        cardFoot.prepend(favDownload);
        cardFoot.prepend(unfavorite);
        cardRating.text("Rating: " + favRating);
        cardTitle.text(favTitle);
        cardStats.prepend(cardFoot);
        cardFav.prepend(cardStats);
        cardStats.prepend(cardRating);
        cardStats.prepend(cardTitle);
        cardFav.prepend(cardImg);
        cardFav.addClass(newFavorite.id);
        $("#favGallery").append(cardFav);  
    }


    $(document).on("click", ".unfavorite", function() {
        var unfavID = $(this).data("id");
        $("." + unfavID).remove();
        $("#"+ "class" + unfavID).removeClass("active");
        localStorage.removeItem(unfavID);     
    })
})
