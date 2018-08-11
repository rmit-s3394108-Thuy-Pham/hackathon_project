from flask import Flask
from flask import json
from flask import jsonify
from flask import render_template
from flask import request
import sqlite3 as sq

app = Flask(__name__)


STUDENT_DATABASE_NAME = "profiles"

@app.route("/")
def home():
    # initilise()
    return render_template('blank_starter.html')

#student ID
#Name
#Attributes

@app.route("/init")
def open_DB():
    fileref = open("profiles.txt", "r")
    return fileref

def close_DB(fileref):
    fileref.close()

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
    user_id = "s3394108"
    user_name = "name"
    expectation = "HD"
    code_strength = str(7)
    design_strength = str(10)
    fileref = open("profiles.txt","a")
    new_user = (user_id + " " + user_name + " " \
                + expectation + " " + code_strength + " " + design_strength)
    fileref.write(new_user)
    fileref.write("\n")
    fileref.close()


@app.route("/read_database")
def read_All():

    empty_arr = []

    fileref = open_DB()
    for aline in fileref:
        # users.append(aline.split())
        vals=aline.split(" ");
        dic={}
        dic['studentID']=vals[0]
        dic['name']=vals[1]
        dic['exp_val']=vals[2]
        dic['code_str']=vals[3]
        dic['des_str']=vals[4]

        empty_arr.append(dic);
        print('\n' + aline)

    print(empty_arr)
    return jsonify(empty_arr)
    close_DB(fileref)


@app.route("/read_oneperson")
def read_One():
    fileref = open_DB()
    for aline in fileref:
        values = aline.split()
        student_ID = values[0]
        if student_ID == 's123456':
            print(aline)
    close_DB(fileref)

"""On Swipe Right"""
@app.route("/_accept")
def on_swipe():

    data = request.get_json()
    user_id = 's2'
    their_choice = 's1'
    match = 0

    if (macth == 1):
        #case1: repeated swipe (invalid)
        fileref = open("relationships.txt", "r")
        check = 0
        for aline in fileref:
            values = aline.split()
            student_ID = values[0]
            if student_ID == user_id:
                if their_choice == values [1]:
                    check = 1
                    return jsonify("This is a repeated swipe")
        #case 2: instant match
            elif their_choice == values[0]:
                if user_id == values[1]:
                    check = 1
                    return jsonify ("This is an instant match")
            else:
                continue

        fileref.close()
        if check == 0:
        #case 3: the one they swiped right is busy -> waiting Message
            ref = open("relationships.txt", "a")
            ref.write(user_id + " " + their_choice)
            ref.write("\n")
            ref.close()
            message = "Your preference is recorded"
        return jsonify(message)



"""Initialize with random people"""
# def initilise():
    # print(user_accounts())
    # return jsonify(user_accounts())


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


if __name__ == "__main__":
    app.run()
