
// Document ready statement
$(document).on("ready", function() {
    console.log("JS is loaded & ready");

// function for starting game & reset after button is clicked
    function startGame() {
        $(document).off("keypress", handleKeyPress);
        $(document).on("keypress", handleKeyPress);
        $("#nemo").css("left", "0px");
        $("#dory").css("left", "0px");
    }
    $("#reset").on("click", function() {
        startGame();
    });

    // Generate a generic method to move each of the two swimmers
    function moveSwimmer(id) {
        var $swimmer = $(id);
        var currentPosition = $swimmer.css("left");
        var currentPositionNumber = currentPosition.split("px")[0];
        var newPositionNumber = Number.parseFloat(currentPositionNumber) + 20;

        var containerWidth = $("#swimTrackContainer").width() - 65;
        if (newPositionNumber >= containerWidth) {
            $swimmer.css("left", containerWidth + "px");
            var winMessage = $swimmer.attr("data-win");
            alert(winMessage);
            $(document).off("keypress", handleKeyPress);
        } else {
            $swimmer.css("left", newPositionNumber + "px");
        }
    }

    // Generate a function to handle the KeyPress event. Add "preventDefault()"
    function handleKeyPress(event) {
        event.preventDefault();
        if (event.keyCode === 113) {
            moveSwimmer("#nemo");
        } else if (event.keyCode === 112) {
            moveSwimmer("#dory");
        }
        return false;
    }
    $(document).on("keypress", handleKeyPress);
});
