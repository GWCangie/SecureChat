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


secret = '_THIS_IS_MY_32_CHARS_SECRET_KEY_'
box = nacl.secret.SecretBox(bytes(secret, encoding='utf8'))


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
    socketio.emit('new msg', json, callback=messageReceived)

@socketio.on('connect')
def test_connect():
    socketio.emit('connected', {'key': secret})

@socketio.on('new msg')
def new_msg(msg):
    print('encrypted')
    print(msg['msg'])
    encrypted = msg['msg']
    encrypted = encrypted.split(':')
    nonce = b64decode(encrypted[0])
    encrypted = b64decode(encrypted[1])
    decrypted = box.decrypt(encrypted, nonce).decode('utf-8')
    print('decrypted')
    print(decrypted)
    socketio.emit('new msg', msg)


if __name__ == '__main__':
    socketio.run(app, debug=True)