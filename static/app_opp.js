class Boggle {

    constructor(secs = 60) {
        this.sec = secs;
        this.score = 0;
        this.word = '';
        this.words = new Set();
        this.timer = setInterval(this.myTimer.bind(this), 1000)

        $('.addWord').on('submit', this.submitAnswer.bind(this))
    }

    // Get the answer from player 
    async submitAnswer(e) {
        e.preventDefault();
        if (this.sec === 0) {
            $("#display").text("Time is up!")
            return false;
        }
        this.word = $(".word").val();
        const response = await axios.get("/check_answer", {
            params: {
                word: this.word
            }
        });

        //Check resonse from server
        var valid = response.data.result
        if (valid === "ok") {
            // Check if word is already on the list 
            if (this.words.has(this.word)) {
                $("#display").text(`You have already entered ${this.word.toUpperCase()}`)
            } else {
                this.getScore();
                this.words.add(this.word);
            }

        } else if (valid === "not-on-board") {
            $("#display").text(`${this.word.toUpperCase()} is not found on board`)
        } else {
            $("#display").text(`${this.word.toUpperCase()} is not a valid word`)
        }
    };


    // Update the time in page 
    async myTimer() {
        this.sec -= 1;
        $("#your_time").text(this.sec);
        if (this.sec === 0) {
            // Timer stops when it reaches zero then store the score to session
            clearInterval(this.timer);
            await this.storeScore();
        }
    }

    async storeScore() {
        const response = await axios.post("/storeScore", {
            score: this.score
        });
        if (response.data.newHighScore) {
            $("#display").text(`Congratulations, you have a new highscore: ${this.score}`)
        }
    }

    getScore() {
        // Display the word score and update the total score 
        this.score += this.word.length;
        $("#display").text(`You scored ${this.word.length}`)
        $("#your_score").text(this.score);
    }

} // End of class