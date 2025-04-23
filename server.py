from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import json
app = Flask(__name__)

quiz_data = {
    "title": "Quiz One: Rembrandt lighting",
    "questions": [
        {
            "type": "multiple_choice",
            "question": "Which of the following paintings shows Rembrandt Lighting?",
            "options": [
                "A. A portrait with flat front lighting",
                "B. A face with a triangle of light under one eye",
                "C. A painting with full backlighting",
                "D. A photo with strong shadows on both cheeks"
            ]
        },
        {
            "type": "multiple_choice",
            "question": "Which lighting type creates soft shadows and even skin tone?",
            "options": [
                "A. Split Lighting",
                "B. Hard Light",
                "C. Soft Light",
                "D. Rembrandt Lighting"
            ]
        },
        {
            "type": "fill_in_blank",
            "question": "The lighting technique that uses strong contrast between light and shadow, often in dramatic scenes, is called _____________."
        }
    ]
}

def load_lessons():
    with open("static/lessons.json") as f:
        data = json.load(f)
        return list(data.values()) 

@app.route("/")
def start():
    return render_template("start.html")

@app.route("/home")
def home():
    lessons = load_lessons()
    return render_template("home.html", lessons=lessons)

@app.route("/learn/<int:lesson_id>")
def learn(lesson_id):
    with open("static/lessons.json") as f:
        data = json.load(f)
        lesson = data[str(lesson_id)]  
        return render_template("learn.html", lesson=lesson)


@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/get_quiz_data')
def get_quiz_data():
    return jsonify(quiz_data)

if __name__ == '__main__':
   app.run(debug = True, port=5001)
