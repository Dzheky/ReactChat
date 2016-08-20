/**
 * ReactChat is React Native App
 * https://github.com/Dzheky/ReactChat
 * Colaborators:
 *  https://github.com/Eetin
 *  https://github.com/MegaGM
 *  https://github.com/Dzheky
 *  ...
 *
 */

import React, { Component } from 'react';
import { AppRegistry, KeyboardAvoidingView, Text, TextInput, View, ScrollView, ListView } from 'react-native'
import { Container, Content, Header, InputGroup, Input, Icon, Button } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import './UserAgent';
import io from 'socket.io-client/socket.io';
import strftime from 'strftime';

const dismissKeyboard = require('dismissKeyboard')

class reactChat extends Component {
  constructor(props) {
    super(props);
    this.socket = io('https://reactchat-dzheky.c9users.io:8080', { jsonp: false });
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const welcomeMessage = {
      user: 'system',
      text: 'Welcome to ReactChat!'
    };
    this.state = {
      placeholder: 'Enter message...',
      user: 'ReactChat User',
      text: '',
      // serverLink: 'https://reactchat-dzheky.c9users.io/',
      textToInput: [welcomeMessage],
      dataSource: this.ds.cloneWithRows([welcomeMessage])
    };
    this.buttonPress = this.buttonPress.bind(this);
    // this.getJSON = this.getJSON.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.socket.on('message', this.addMessage);
    this.formatDate = this.formatDate.bind(this);
  }

  // componentWillMount() {
  //   this.getJSON(this.state.serverLink);
  // }

  addMessage(message) {
    let localMessages = [
      ...this.state.textToInput,
      message
    ];
    const ids = localMessages.map((message, i) => i).reverse();
    this.setState({
      textToInput: localMessages,
      dataSource: this.ds.cloneWithRows(localMessages, ids)
    });
    // this.listView.scrollTo({ y: this.listView.getMetrics().contentLength });
  }

  // getJSON() {
  //   return fetch(this.state.serverLink)
  //           .then((messages) => {
  //             messages = JSON.parse(messages._bodyInit);
  //             this.setState({
  //               textToInput: messages,
  //               dataSource: this.ds.cloneWithRows(messages)
  //             })
  //           })
  //           .catch(function(error) {
  //             alert(error);
  //           })
  // }



  buttonPress() {
    if (this.state.text.trim() === '') return;
    this.socket.emit('message', { user: this.state.user, text: this.state.text });
    this.setState({ text: '' });
    dismissKeyboard();
  }

  formatDate(dateISO) {
    return strftime('%T', new Date(dateISO));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView ref={listView => this.listView = listView }
          style={{ margin: 10, transform: [{ scaleY: -1 }] }}
          onContentSizeChange={(width, height) => {
            this.listView.scrollTo({ y: 0 })
          }}
          dataSource={ this.state.dataSource }
          renderRow={ rowData => {
            const date = rowData.created_at ? `${this.formatDate(rowData.created_at)} ` : '';
            const user = rowData.user !== 'system' ? `${rowData.user}: ` : '';
            const text = rowData.text;
            return (
              <Text style={{ fontSize: 14, transform: [{ scaleY: -1 }] }}>
                {date + user + text}
              </Text>
            )}} />
        <View style={{ height: 40 }}>
          <View style={{ borderTopWidth: .5,
            borderTopColor: 'gray',
            flex: 1,
            flexDirection: 'row' }}>
            <TextInput
              style={{ flex: 1 }}
              onSubmitEditing={ this.buttonPress }
              onEndEditing={this.clearFocus}
              onChangeText={ text => this.setState({ text }) }
              placeholder={this.state.placeholder}
              value={this.state.text} />
            <Button onPress={ this.buttonPress } success>Send</Button>
          </View>
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('reactChat', () => reactChat);
