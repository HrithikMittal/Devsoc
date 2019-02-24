from flask import Flask, render_template, request
import model

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/', methods=['POST'])
def form():
    text = request.form['text']
    ans = model.predict(text)
    return render_template('main.html', ans=ans)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port='5000', debug=True)