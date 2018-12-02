from flask import Flask, send_from_directory, render_template
from flask_socketio import SocketIO, join_room
import nacl.secret
import nacl.utils
import nacl.encoding
import nacl.hash
import os
import time

app = Flask(__name__, static_folder='frontend/build')

app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)

secret = nacl.utils.random(nacl.secret.SecretBox.KEY_SIZE)
box = nacl.secret.SecretBox(secret)
HASHER = nacl.hash.sha256

rooms = []

@app.route('/create', methods=['GET','POST'])
def create():
    print("HIT CREATE")
    currentTime = bytes(int(time.time()))
    newRoom = HASHER(currentTime, encoder=nacl.encoding.URLSafeBase64Encoder)
    while( newRoom in rooms):
        currentTime = bytes(int(time.time()))
        newRoom = HASHER(currentTime, encoder=nacl.encoding.URLSafeBase64Encoder)
    print(newRoom)
    rooms.append({'path': newRoom, 'time':currentTime})
    return render_template("YourRoom.html", room=newRoom)

@app.route('/room/<path:path>')
def sendChat(path):
    print("redirecting to chat")
    print(path)
    if "b'" in path:
        for room in rooms:
            if room['path'] == path:
               return render_template('index.html', key=secret)
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("frontend/build/" + path):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    room = json['room']
    join_room(room)
    socketio.emit('connected', {'key': secret}, room=room)

    

@socketio.on('connect')
def test_connect():
    pass


@socketio.on('new msg')
def new_msg(msg):
    decrypted = box.decrypt(bytes(msg['non64']), bytes(msg['nonce'])).decode('utf-8')
    print('decrypted')
    print(decrypted)
    socketio.emit('new msg', msg, room=msg['room'])


if __name__ == '__main__':
    socketio.run(app, debug=True)