from flask import Flask, request, render_template, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle


app = Flask(__name__)
app.config["SECRET_KEY"] = "iamlou"
debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route("/")
def home():
    """"Returns the homepage with the board"""
    # Create the sessions
    make_board = boggle_game.make_board()
    session["board"] = make_board

    # Get the current highscore if available in the stored cookies
    highscore = session.get("highscore", 0)

    # Get the number of plays in the store cookies
    games = session.get("games", 0)

    # Return the index.html
    return render_template("index.html", boards=make_board, highscore=highscore, games=games)


@app.route("/check_answer")
def check_answer():
    """Check if answer is within the list"""
    myWord = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, myWord)
    return jsonify({'result': response})


@app.route("/storeScore", methods=["POST"])
def store_score():
    """Stores the score in the session"""
    # Compare the session highscore and current highscore value
    currScore = request.json["score"]
    highscore = session.get("highscore", 0)
    session['highscore'] = max(currScore, highscore)

    games = session.get("games", 0)
    session['games'] = games + 1

    return jsonify(newHighScore=currScore > highscore)
