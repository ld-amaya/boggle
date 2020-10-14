from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_load_board(self):
        """Check if all information if all session and HTML are loaded"""

        def setUp(self):
            """Stuff to do before every test."""

            self.client = app.test_client()
            app.config['TESTING'] = True

        # Testing a GET Request
        with self.client:
            response = self.client.get('/')
            html = response.get_data(as_text=True)
            self.assertEqual(response.status_code, 200)
            self.assertIn("<h1>Boogle Game</h1>", html)
            self.assertIn("board", session)
            self.assertIsNone(session.get('games'))
            self.assertIsNone(session.get('highscore'))
            self.assertIn(b'Score:', response.data)
            self.assertIn(b'Time remaining:', response.data)

    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                 ["D", "O", "G", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"]]
        response = self.client.get('/check_answer?word=cat')
        self.assertEqual(response.json['result'], 'ok')

        response = self.client.get('/check_answer?word=dog')
        self.assertEqual(response.json['result'], 'ok')

        response = self.client.get('/check_answer?word=rat')
        self.assertEqual(response.json['result'], 'not-on-board')

        response = self.client.get('/check_answer?word=asdfadsf')
        self.assertEqual(response.json['result'], 'not-word')
