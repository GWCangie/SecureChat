from flask import Flask, send_from_directory
from flask_socketio import SocketIO
import nacl.secret
import nacl.utils
import os
from base64 import b64decode
import json

app = Flask(__name__, static_folder='frontend/build')

app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)

secret = nacl.utils.random(nacl.secret.SecretBox.KEY_SIZE)
box = nacl.secret.SecretBox(secret)

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
    

@socketio.on('connect')
def test_connect():
    socketio.emit('connected', {'key': secret})

@socketio.on('new msg')
def new_msg(msg):
    decrypted = box.decrypt(bytes(msg['non64']), bytes(msg['nonce'])).decode('utf-8')
    print('decrypted')
    print(decrypted)
    socketio.emit('new msg', msg)


if __name__ == '__main__':
    socketio.run(app, debug=True)