from flask import Flask
from flask import json
from flask import jsonify
from flask import render_template
from flask import request
app = Flask(__name__)

@app.route("/")
def home():
    return render_template('blank_starter.html')

@app.route("/test", methods=['GET', 'POST'])
def getmsgfromclient():
    print("someone poked this endpoint")
    print(request.data)
    print(request.args)
    print(request.get_json())

    # print(type(request.get_json))
    # if len(request.get_json()):
        # for each in request.get_json():
            # print(each)
            # for _ in each:
                # print(_)

    return jsonify("Message from server")
    return render_template('blank_starter.html')

@app.route("/create_user")
def add_user(**kwargs):
    user_id, user_name, expectation, code_str, design_str = _genNewUser()
    fileref = open("profiles.txt","a")
    new_user = (user_id + " " + user_name + " " \
                + expectation + " " + code_strength + " " + design_strength)
    fileref.write(new_user)
    fileref.write("\n")
    fileref.close()

def _genNewUser():
    user_id = 's'
    for i in range(7):
        user_id += randint(0, 10)

    user_name = 'username'
    tiers = ['NN', 'PX', 'CR', 'Di', 'HD']
    expectation = tiers[randint(0, 5)]
    code_str = str(randint(1, 10))
    design_str = str(randint(1, 10))

    return user_id, user_name, expectation, code_str, design_str

@app.route("/read_database")
def read_All():
    user_data = []

    fileref = open_DB()
    for aline in fileref:
        vals=aline.split(" ");
        dic={}
        dic['studentID']=vals[0]
        dic['name']=vals[1]
        dic['exp_val']=vals[2]
        dic['code_str']=vals[3]
        dic['des_str']=vals[4]

        user_data.append(dic);
        # print('\n' + aline)
    # print(user_data)
    return jsonify(user_data)

"""On Swipe Right"""
@app.route("/_accept")
def accept():
    print("Someone swiped right ;) ")
    message = "Success!!"
    return jsonify(message)

"""On Swipe Left"""
@app.route("/_reject")
def reject():
    # Just load the next profile to be oberved
    return

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

def userAttributes():
    attributes = {
        'Coding Strength' : '',
        'Graphical design' : '',
        'Getting coffee ability' : '',
        'Languages spoken' : ''
        }

def user_accounts():
    users = {
        "Tyrion Lanister" : ['7','3','7','English', 'tech101'],
        "Tywin Lanister" : ['2','4','1','English'],
        "Dragon Lady" : ['1','3','1','English, Dragon'],
        "Faceless Man" : ['4','9','1','English'],

        "Harry Potter" : ['3','5','9','English'],
        "Hagrid" : ['4','9','1','English'],
        "Ronald" : ['8','1','5','English'],
        "Draco Malfoy" : ['4','6','3','English'],
        }

    return users
