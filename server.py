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

# In-memory session results (wiped on restart)
session_results = {
    "1": None,
    "2": None,
    "3": None,
    "4": None,
    "5": None
}

def load_lessons():
    with open("static/lessons.json") as f:
        data = json.load(f)
        return list(data.values()) 

def load_quizzes():
    with open("static/quizzes.json") as f:
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

@app.route('/quiz/<int:quiz_id>')
def quiz(quiz_id):
    with open("static/quizzes.json") as f:
        quizzes = json.load(f)
    quiz = quizzes.get(str(quiz_id))
    if not quiz:
        return "Quiz not found", 404
    return render_template("quiz.html", quiz_id=quiz_id)

@app.route('/get_quiz_data/<int:quiz_id>')
def get_quiz_data(quiz_id):
    with open("static/quizzes.json") as f:
        quizzes = json.load(f)
    quiz = quizzes.get(str(quiz_id))
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify(quiz)

@app.route('/submit_quiz/<int:quiz_id>', methods=['POST'])
def submit_quiz(quiz_id):
    with open("static/quizzes.json") as f:
        quizzes = json.load(f)
    quiz = quizzes.get(str(quiz_id))
    if not quiz:
        return "Quiz not found", 404

    score = 0
    total = len(quiz["questions"])
    responses = []

    for i, question in enumerate(quiz["questions"]):
        user_answer = request.form.get(f'q{i}', '').strip()
        correct_answer = question["answer"]
        correct = user_answer.lower() == correct_answer.lower()
        if correct:
            score += 1
        responses.append({
            "question": question["question"],
            "your_answer": user_answer,
            "correct_answer": correct_answer,
            "correct": correct
        })

    # Save result in memory
    session_results[str(quiz_id)] = f"{score}/{total}"

    return render_template("results.html", score=score, total=total, responses=responses, quiz_id=quiz_id)

@app.route("/quizresults")
def quiz_results():
    with open("static/quizzes.json") as f:
        quizzes = json.load(f)

    quiz_summaries = []
    for i in range(1, 6):
        quiz = quizzes.get(str(i))
        status = session_results.get(str(i)) or "Uncompleted"
        quiz_summaries.append({
            "id": i,
            "title": quiz["title"],
            "status": status
        })

    return render_template("quiz_results.html", quiz_summaries=quiz_summaries)


if __name__ == '__main__':
   app.run(debug = True, port=5001)
