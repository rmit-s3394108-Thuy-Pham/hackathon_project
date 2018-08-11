from flask import Flask
from flask import json
from flask import jsonify
from flask import render_template
from flask import request
import sqlite3 as sq

app = Flask(__name__)

STUDENT_DATABASE_NAME = "student_profiles"


@app.route("/")
def home():
    # initilise()
    return render_template('blank_starter.html')

#student ID
#Name
#Attributes


@app.route("/test", methods=['GET', 'POST'])
def getmsgfromclient():
    print("someone poked this endpoint")
    print(request.data)
    print(request.args)
    print(request.get_json())

    for each in request.get_json():
        print(each)
        for _ in each:
            print(_)

    # print(json.loads(request.data))
    return jsonify("Message from server")
    return render_template('blank_starter.html')

@app.route("/init")
def initilise():
    cursor = conn.cursor()
    print("Database opened\n\n")
    dropTableStatement = "DROP TABLE student_profiles"
    cursor.execute(dropTableStatement)
    conn.execute('''CREATE TABLE ''' + STUDENT_DATABASE_NAME + ''' (studentID TEXT, name TEXT, address TEXT)''')
    # conn.execute("CREATE TABLE " + RELATIONSHIP_DATABASE_NAME + "(user TEXT)")
    print("Table created successfully");
    return conn;

@app.route("/create_user")
def create_user(**kwargs):

    f = open_db
    user = [
        "3436413", ["Sulz", 'Hawthorn'],
        "3421232", ["Jim", "bananaland"]
        ]

    user_id = user[0]
    user_name = user[1][0]
    user_suburb = user[1][1]

    f.write(user_id, user_name, user_suburb)

    print(user_id)
    print(user_name)
    print(user_suburb)
    # sql = "INSERT INTO " + STUDENT_DATABASE_NAME + " values(?, ?, ?);"

    profile = ("3436413", "Sulz", "Hawthorn")

    cur = conn.cursor()

    cur.execute(sql, ("3436413", "Sulz", "Hawthorn"))

    cur.execute("SELECT * FROM " + STUDENT_DATABASE_NAME)

    rows = cur.fetchall()
    print('rows', rows)

    return None


@app.route("/read_database")
def read_database():
    # conn = create_connection()
    conn = sq.connect('database.db')
    #
    cur = conn.cursor()

    cur.execute("SELECT * FROM " + STUDENT_DATABASE_NAME)

    rows = cur.fetchall()
    print('rows', rows)

"""On Swipe Right"""
@app.route("/_accept")
def accept():
    print("Someone swiped right ;) ")
    # print("\n args: \n", request.args())

    message = "Success!!"
    return jsonify(message)

"""On Swipe Left"""
@app.route("/_reject")
def reject():
    return

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
    app.run(host="0.0.0.0", port=5000)

# def update_student(conn, profile):
#     sql = "INSERT INTO " + STUDENT_DATABASE_NAME + "{ (name, addr, city) \
#                 VALUES (?,?,?)}"
#     cur = conn.cursor()
#     cur.execute(sql, profile)
#
#     with conn:
#         update_student(conn, ('Thuy', '12 station', 'Melbourne'))
#         update_student(conn, ('Sulz', '2 lenon', 'Melbourne'))
