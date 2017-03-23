$(document).ready(function() {
    intialize();

    // Whenever someone clicks a p tag
    $('body').on("click", ".commentAdd", function() {
        // Empty the notes from the note section
        $('.articleBox').not($(this).parent()).hide();
        $(this).next().empty();
        var notes = $(this).next();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
            // With that done, add the note information to the page
            .done(function(data) {
                console.log(data);
                // The title of the article
                notes.append("<h2 id='close'>Close</h2>");
                // An input to enter a new title
                notes.append("<input id='titleinput' placeholder='First and Last Name' name='title' >");
                // A textarea to add a new note body
                notes.append("<textarea id='bodyinput' placeholder='Add a note' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                notes.append("<button class='btn btn-default' style='margin-top: 10px; margin-bottom: 10px' data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if(data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });
    $(document).on("click", "#close", function() {
        $(this).parent().empty();
        $('.articleBox').show();

    });


    // When you click the savenote button
    $(document).on("click", "#savenote", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    userName: $("#titleinput").val(),
                    // Value taken from note textarea
                    text: $("#bodyinput").val()
                }
            })
            // With that done
            .done(function(data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $(this).next().empty();
            });
        location.reload();
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
        $('#close').click();

    });
});




    // Grab the articles as a json
    function intialize() {
        $.getJSON("/articles", function(data) {
            // For each one
            for(var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<div class='articleBox'><a class='storyLinks' href=" +
                    data[i].link + "data-id=" + data[i]._id + "><h2 class='banner' data-id=" + data[i]._id + ">" +
                    data[i].title + "</h2></a><button data-id=" +
                    data[i]._id + " class='btn btn-success commentAdd'>Add Comment</button><div class='notes'></div><div class='pastCom'></div></div>");
                var len = data[i].note.length;
                if(len > 0) {
                    for(var k = 0; k < len; k++) {
                        $('.pastCom').append('<h4 class="comm"><em>' + data[i].note[k].userName + ':   </em>   ' + data[i].note[k].text + '</h4>')
                    }
                }
            }
        });
    }
