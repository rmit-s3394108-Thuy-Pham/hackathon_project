from flask import Flask
from flask import json
from flask import jsonify
from flask import render_template
from flask import request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('blank_starter.html')
    return null;

if __name__ == "__main__":
    app.run()


@app.route("/_hello")
def test():
    print("Someone swiped right ;) ")
    print("\n args: \n", request.args)
    
    message = "Success!!"
    return jsonify(message)
    # return b64.encode("Hello")


