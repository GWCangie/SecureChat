import React, { Component } from 'react';
import AppBar from './AppBar'
import logo from './logo.svg';
import './App.css';

import nacl from 'tweetnacl'
import * as util from 'tweetnacl-util'

import openSocket from 'socket.io-client';
const encodeBase64 = util.encodeBase64

const socket = openSocket('http://localhost:5000');
class App extends Component {

  constructor(){
    super();
    this.state = { 
      messages: [],
      key: null
    }
  }
  /*
  handleChange =  (msg) =>{
    console.log(msg);
    const nonce = nacl.randomBytes(24)
    const arr = [...nonce];
    const secretData = Buffer.from(msg, 'utf8')
    const encrypted = nacl.secretbox(secretData, nonce, this.state.secretKey)
    const encryptedArr= [...encrypted]
    socket.emit('new msg', {
      nonce: arr,
      non64: encryptedArr
    })
  }
  */
  
  componentDidMount(){
    
    socket.on( 'connect', function() {
      socket.emit( 'my event', {
        data: 'User Connected'
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
      this.setState({key: secretKey})
      const nonce = nacl.randomBytes(24)
      const arr = [...nonce];
      const secretData = Buffer.from('PlayboiCarti;Some Italians hate wine', 'utf8')
      const encrypted = nacl.secretbox(secretData, nonce, secretKey)
      const encryptedArr= [...encrypted]
      socket.emit('new msg', {
        nonce: arr,
        non64: encryptedArr
      })
    });
  }
  render() {
    return (
      <div className="App">
        <AppBar messages={this.state.messages}/>
      </div>
    );
  }
}

export default App;
