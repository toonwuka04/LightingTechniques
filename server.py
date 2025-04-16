from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

@app.route('/')
def mainpage():
    return render_template('mainpage.html')  


if __name__ == '__main__':
   app.run(debug = True, port=5001)