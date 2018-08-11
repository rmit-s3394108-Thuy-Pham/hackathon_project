from flask import Flask
from flask import json
from flask import jsonify
from flask import render_template
from flask import request

app = Flask(__name__)

@app.route("/")
def home():
    initilise()
    return render_template('blank_starter.html')
    return null;


"""On Swipe Right"""
@app.route("/_accept")
def accept():
    print("Someone swiped right ;) ")
    print("\n args: \n", request.args)
    
    message = "Success!!"
    return jsonify(message)

"""On Swipe Left"""
@app.route("/_reject")
def reject():
    return

"""Initialize with random people"""
def initilise():
    print(user_accounts()) 
    return jsonify(user_accounts())

    # session_users = []
    # users = user_accounts()
    # atts = userAttributes()
    # for each in users:
    #     print(each)
    #     users[each]
    #     print(users[each])
    #     session_users.append(users[each])

    # return jsonify(session_users)

    # return 

def userAttributes():
    attributes = {
        'Coding Strength' : '',
        'Graphical design' : '',
        'Getting coffee ability' : '',
        'Languages spoken' : ''
        }

def user_accounts():
    users = {
        "Tyrion Lanister" : ['7','3','7','English'],
        "Tywin Lanister" : ['2','4','1','English'],
        "Dragon Lady" : ['1','3','1','English, Dragon'],
        "Faceless Man" : ['4','9','1','English'],

        
        "Harry Potter" : ['3','5','9','English'],
        "Hagrid" : ['4','9','1','English'],
        "Ronald" : ['8','1','5','English'],
        "Draco Malfoy" : ['4','6','3','English'],
        }

    return users


if __name__ == "__main__":
    #app.run(host='0.0.0.0')
    app.run()
