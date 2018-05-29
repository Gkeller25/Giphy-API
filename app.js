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
newButton.addClass("button m-3 text-capitalize");
newButton.attr("data-person", topics[i]);
newButton.text(topics[i]);
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
    newButton.addClass("button m-3 text-capitalize");
    newButton.attr("data-person", topics[i]);
    newButton.text(topics[i]);
    $("#buttonGallery").append(newButton);
    console.log(newButton);
}}





  

$(document).on("click", ".button", function() {
    $("#gallery").empty();
  currentResults = [];
 
    var person = $(this).attr("data-person");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      person + "&api_key=yDQ5zIEWEoqMVh1HIEOnKIg9kIRhxKYn" + "&limit=10";
   

    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response);
    var results = response.data;
    console.log(results);
    for (var i = 0; i < results.length; i++) {
        currentResults.push(results[i]);
        console.log(currentResults);
        var charDiv = $("<div class='item mr-3 text-center'>");
        var infoDiv = $("<div class='card my-3'>");
        var rating = results[i].rating;
        var title = results[i].title;
        var p = $("<p class='text-center text-capitalize'>").text("Rating: " + rating);
        var h = $("<p class='text-center m-3 text-capitalize'>").text(title);
        var imageDownload = $('<a href="#" download>');
        var favorite = $("<button class='btn favorite btn-outline-primary'>");
        var personImage = $('<img class="gif img-thumbnail">');
       
        personImage.attr("src", results[i].images.fixed_height_still.url);
        personImage.attr("data-still", results[i].images.fixed_height_still.url);
        personImage.attr("data-animate", results[i].images.fixed_height.url);
        personImage.attr("data-state", "still");
        personImage.attr("id", results[i].id);
        personId = personImage.attr("id");
        var personImageSource = personImage.attr("src");
        console.log(personImageSource);
        //used to set the datavalue of the favorites button to the image object's id
        //var personValue = results[i].title;
        personValue = [i];
        
        
        imageDownload.attr("download", "image.gif");
        
        imageDownload.text("Download");
        console.log(imageDownload);
        charDiv.attr("id", "image" + personValue);
        favorite.attr("type", "button").attr("data-toggle", "button").attr("aria-pressed", "false").attr("autocomplete", "off").attr("data-value", personValue).attr("data-id", personId).attr("id", "class" +  personId).text("Favorite");
        
        infoDiv.prepend(imageDownload);
        infoDiv.prepend(favorite);
        infoDiv.prepend(p);
        infoDiv.prepend(h);
        charDiv.prepend(infoDiv);
        charDiv.prepend(personImage);
        $("#gallery").append(charDiv);
        imageDownload.on("click", function(){
            imageDownload.attr("href", personImageSource);
        console.log("hate this");
        })
    }
})

})


    
  
      $(document).on("click", ".gif", function() {
        
        var animateImage=  $(this).attr("src");     
        var state = $(this).attr("data-state");

        if(state === "still") {
            $(this).attr("data-state", "animate");   
            $(this).attr("src", $(this).data("animate"));
            
           
            console.log(animateImage);
          } else {         
            $(this).attr("data-state", "still");           
            $(this).attr("src", $(this).attr("data-still"));
          console.log(this);
          }
        
          
          
          
          
    });

    function favButtonRebuilder() {
        $(".infoDiv").append($("<button class='btn favorite btn-outline-primary replacement'>"));
        $(".replacement").attr("type", "button").attr("data-toggle", "button").attr("aria-pressed", "false").attr("autocomplete", "off").attr("data-value", personValue).attr("data-id", personId).attr("id", personId).text("Favorite");
        

    console.log("did it work");
    }

    $(document).on("click", ".favorite", function() {
  console.log(document);
    console.log(currentResults);
     var favValue = $(this).data("value");
     var chosenFavorite = currentResults[favValue];
     var favID = chosenFavorite.id;
     

        console.log(favID);
        console.log(favValue);
        //dont use favValue find another way to connect favID to calling the current 
    
        console.log(chosenFavorite);
   if($(this).hasClass("active") === true){
       //sets the chosenFavorite variable to the image object related to the button clicked
     console.log(this);
    //pushes the object related to button clicked to array called Favorites 
    favorites.push(chosenFavorite);
        console.log(favorites);
    personResults.push(favID);
        console.log(personResults);
    personIndex = favorites.indexOf(favValue);
    
    localStorage.setItem(favID, JSON.stringify(chosenFavorite));
    
    renderFavorite(favID);
    
  
   } else {
   
    personIndex = favorites.indexOf(favValue);
       favorites.splice(favorites.indexOf(chosenFavorite, 0), 1);
            console.log(favorites);
       personResults.splice(personResults.indexOf(favID, 0),1);
            console.log(personResults);
       favorites.sort(function(a, b){return a- b});
       localStorage.removeItem(favID);
      $("." + favID).remove();
        
       renderFavorite(favID);
            console.log(favorites);


}
})
   
function renderFavorite(idFav) {
   
    var newFavorite = JSON.parse(localStorage.getItem(idFav));
  
    var favTitle = newFavorite.title;
    var favRating = newFavorite.rating;
    var cardFav = $("<div class='card mx-3'>");
    var cardImg = $("<img>");
    var cardStats = $("<div class='card-body'>");
    var cardFoot = $("<div>");
    var cardTitle = $("<p>");
    var cardRating = $("<p>");
    var favDownload = $("<a>");
    var unfavorite = $("<button class='btn unfavorite active btn-outline-primary'>");
        cardImg.attr({
            class: "card-img-top img-thumbnail gif",
            src: newFavorite.images.fixed_height_still.url,
            id: newFavorite.id
        });
       
        cardImg.attr("data-still", newFavorite.images.fixed_height_still.url);
        cardImg.attr("data-animate", newFavorite.images.fixed_height.url);
        cardImg.attr("data-state", "still");
 
        unfavorite.attr("type", "button");
        unfavorite.attr({  
        "data-toggle": "button",
        "aria-pressed": "true",
        "autocomplete": "off",
        
        "data-id": cardImg.attr("id")
      }).text("Favorite");
      cardFoot.prepend(unfavorite);
        cardRating.text("Rating: " + favRating);
        cardTitle.text(favTitle);
        cardStats.prepend(cardFoot);
        cardFav.prepend(cardStats);
        cardStats.prepend(cardTitle);
        cardStats.prepend(cardRating);
        cardFoot.prepend(favDownload);
        
        cardFav.prepend(cardImg);
        cardFav.addClass(newFavorite.id);
        $("#favGallery").append(cardFav);
        

//}
}
$(document).on("click", ".unfavorite", function() {
var unfavID = $(this).data("id");
console.log(unfavID);
//$(currentDiv).addClass("test");
$("." + unfavID).remove();
$("#"+ "class" + unfavID).removeClass("active");

localStorage.removeItem(unfavID);
        
})
    



//upon click of unfavorite button the favorite image object needs to be removed from local storage and update any needed arrays.



    

 

    

    






})
