from flask import Flask, render_template, redirect, url_for
import json

app = Flask(__name__)

def load_lessons():
    with open("data/lessons.json") as f:
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
    with open("data/lessons.json") as f:
        data = json.load(f)
        lesson = data[str(lesson_id)]  
        return render_template("learn.html", lesson=lesson)

@app.route("/quiz/<int:lesson_id>")
def quiz(lesson_id):
    return f"<h1>This will be the quiz page for lesson {lesson_id}</h1>"

if __name__ == "__main__":
    app.run(debug=True, port=5001)

