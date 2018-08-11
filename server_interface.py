from flask import Flask
from flask import json
from flask import jsonify
from flask import render_template
from flask import request
# from flask_sqlalchemy import SQLAlchemy

import sqlite3 as sq

app = Flask(__name__)

DATABASE_NAME = "student_profiles"

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
# db = SQLAlchemy(app)

""""""
# class test_user(db.Model):
    # def __init__():
        # id = db.Column(db.Integer, primary_key=True)
        # username = db.Column(db.String(80), unique=True, nullable=False)
        # email = db.Column(db.String(120), unique=True, nullable=False)
#
    # def __repr__(self):
         # return '<User %r>' % self.username

@app.route("/")
def home():
    conn = create_connection()
    with conn:
        update_student(conn, ('Thuy', '12 station', 'Melbourne', 1))
        update_student(conn, ('Sulz', '2 lenon', 'Melbourne', 2))
    select_all_student(conn)
    # initilise()
    return render_template('blank_starter.html')
    return null;

@app.route("/read_database")

@app.route("/bb")
def select_all_student():
    conn = create_connection()
    cur = conn.cursor()

    # TODO!
    #cur.execute("SELECT * FROM" + DATABASE_NAME)
    cur.execute("SELECT * FROM student_profile7")
    rows = cur.fetchall()
    print('rows', rows)
    # for row in rows:
    #     print('Thuy')

def update_student(conn, profile):
    sql = ''' INSERT INTO students_profile7 (name, addr, city, id)
    VALUES (?,?,?,?)'''
    # ''' UPDATE students_profile5
    #           SET name = ? ,
    #               addr = ? ,
    #               city = ?
    #           WHERE id = ?'''
    cur = conn.cursor()
    cur.execute(sql, profile)

def create_connection():
    conn = sq.connect('database.db')
    print("Database opened\n\n")
    conn.execute('CREATE TABLE students_profile7 (name TEXT, addr TEXT, city TEXT, id TEXT)')
    print("Table created successfully");
    return conn;


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
