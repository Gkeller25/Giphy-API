$(document).ready(function() {
var topics = ["luke skywalker", "han solo", "anakin skywalker", "kylo ren", "chewbacca", "yoda", "mace windu", "padme", "leia"];





for(var i = 0; i < topics.length; i++){
var newButton = $("<button>");
newButton.addClass("button m-3");
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
    newButton.addClass("button m-3");
    newButton.attr("data-person", topics[i]);
    newButton.text(topics[i]);
    $("#buttonGallery").append(newButton);
    console.log(newButton);
}}





  

$(document).on("click", ".button", function() {
    $("#gallery").empty();
    var person = $(this).attr("data-person");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      person + "&api_key=yDQ5zIEWEoqMVh1HIEOnKIg9kIRhxKYn&limit=10";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response);
    var results = response.data;
    
    for (var i = 0; i < results.length; i++) {
        var charDiv = $("<div class='item mr-3'>");

        var rating = results[i].rating;

        var p = $("<p>").text("Rating: " + rating);

        var personImage = $("<img class=gif>");
        personImage.attr("src", results[i].images.fixed_height_still.url);
        personImage.attr("data-animate", results[i].images.fixed_height.url);
        personImage.attr("data-state", "still");
        personImage.attr("data-still", results[i].images.fixed_height_still.url);
        charDiv.prepend(p);
        charDiv.prepend(personImage);

        $("#gallery").append(charDiv);
      
    }
  
      $(".gif").on("click", function() {

        var animateImage=  $(this).attr("src");        
        var state = $(this).attr("data-state");

        if(state === "still") {
            $(this).attr("data-state", "animate");   
            $(this).attr("src", $(this).data("animate"));
          } else {         
            $(this).attr("data-state", "still");           
            $(this).attr("src", $(this).attr("data-still"));
          
           
          }
    })

  
   
 

  


    })})})
