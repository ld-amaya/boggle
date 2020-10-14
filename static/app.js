var score = 0;
var word_list = [];
var myTimer = 60;

// Updates timer every 1sec in DOM
thisTimer = setInterval(() => {
    myTimer -= 1;
    $("#your_time").text(myTimer);
    if (myTimer === 0) {
        // Timer stops when it reaches zero 
        clearInterval(thisTimer);
        storeScore();
    }
}, 1000)

// Get the answer from player 
$('.addWord').on('submit', async (e) => {
    e.preventDefault();
    if (myTimer === 0) {
        $("#display").text("Time is up!")
        return false;
    }
    myWord = $(".word").val();
    const response = await axios.get("/check_answer", {
        params: {
            word: myWord
        }
    });

    //Check resonse from server
    valid = response.data.result
    if (valid === "ok") {
        // Check if word is already on the list 
        if (CheckWord(myWord)) {
            $("#display").text(`You have already entered ${myWord.toUpperCase()}`)
        } else {
            $("#your_score").text(getScore(myWord));
            $("#display").text(`You scored ${myWord.length}`)
            word_list.push(myWord);
        }

    } else if (valid === "not-on-board") {
        $("#display").text(`${myWord.toUpperCase()} is not found on board`)
    } else {
        $("#display").text(`${myWord.toUpperCase()} is not a valid word`)
    }
});

function getScore(myWord) {
    return score += myWord.length;
}

function CheckWord(myWord) {
    return word_list.find((value) => {
        return myWord === value
    })
}

async function storeScore() {
    const response = await axios.post("/storeScore", {
        score: score
    });
    if (response.data.newHighScore) {
        $("#display").text(`Congratulations, you have a new highscore: ${score}`)
    }
}