import React, { Component } from 'react';
import AppBar from './AppBar'
import logo from './logo.svg';
import './App.css';

import nacl from 'tweetnacl'
import * as util from 'tweetnacl-util'

import openSocket from 'socket.io-client';
const encodeBase64 = util.encodeBase64

const socket = openSocket('http://localhost:5000');

//const secret = {{key}}
//console.log(secret)
class App extends Component {

  constructor(){
    super();
    this.state = { 
      messages: [],
      key: null,
      name: 'Anonymous',
      input: '',
      room: window.location.pathname.split('/room/')[1]
    }
  }
  destroy = e =>{
    socket.emit('destroy', {room: this.state.room})
  }

  changeName = e =>{
    this.setState({name: e.target.value})
  }

  changeInput = e =>{
    this.setState({input: e.target.value})
  }
  
  handleSubmit =  e =>{
    const nonce = nacl.randomBytes(24)
    const arr = [...nonce];
    const msg = this.state.name + ';' + this.state.input
    const secretData = Buffer.from(msg, 'utf8')
    const encrypted = nacl.secretbox(secretData, nonce, this.state.key)
    const encryptedArr= [...encrypted]
    socket.emit('new msg', {
      nonce: arr,
      non64: encryptedArr,
      room: this.state.room
    })
    this.setState({input:''})
  }
  
  
  componentDidMount(){
    const room = this.state.room
    console.log(room)
    socket.on( 'connect', function() {
      socket.emit( 'my event', {
        data: 'User Connected',
        room: room,
      } )});
    socket.on('new msg', message => {
      const nonce = Uint8Array.from(message.nonce)
      const encrypted = Uint8Array.from(message.non64)
      const decrypted = util.encodeUTF8(nacl.secretbox.open(encrypted, nonce, this.state.key))
      console.log('decrypted')     
      console.log(decrypted)
      this.setState({ messages: [...this.state.messages, decrypted]})})

    socket.on('connected', json => {
      const secretKey = Buffer.from(json.key, 'utf8')
      this.setState({key: secretKey, messages: [...this.state.messages, "SecureChat; User has joined"]})
    });
    socket.on('destroy', _ => {
      this.setState({messages: []})
      socket.close()

    })
  }
  render() {
    return (
      <div className="App">
        <AppBar 
        messages={this.state.messages} 
        name={this.state.name} 
        input={this.state.input}
        changeName={this.changeName}
        changeInput={this.changeInput} 
        submit={this.handleSubmit}
        destroy={this.destroy}
        />

      </div>
    );
  }
}

export default App;
