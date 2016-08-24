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
import {  AppRegistry, KeyboardAvoidingView, Text, TextInput,
          View, ScrollView, ListView, ToolbarAndroid,
          Modal} from 'react-native'
import { Container, Content, Header, InputGroup, Input, Icon, Button } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import './UserAgent';
import io from 'socket.io-client/socket.io';
import strftime from 'strftime';

const dismissKeyboard = require('dismissKeyboard');
// const DeviceUUID = require("react-native-device-uuid");
// let DeviceUUIDNumber = 0;

const SERVER_URL = 'https://reactchat-server.herokuapp.com/'


class reactChat extends Component {
  constructor(props) {
    super(props);
    this.socket = io(SERVER_URL, { jsonp: false , uuid: 0});
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const welcomeMessage = {
      user: 'system',
      text: 'Welcome to ReactChat!'
    };
    this.state = {
      placeholder: 'Enter message...',
      addUserInput: false,
      actions: [{title: '', icon: require('./img/ic_person_add_black_24dp.png'), show: 'always'}],
      userInput: '',
      user: 'ReactChat User',
      text: '',
      // serverLink: 'https://reactchat-dzheky.c9users.io/',
      textToInput: [welcomeMessage],
      dataSource: this.ds.cloneWithRows([welcomeMessage])
    };
    this.buttonPress = this.buttonPress.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.socket.on('message', this.addMessage);
    this.formatDate = this.formatDate.bind(this);
    this.toolbarActions = this.toolbarActions.bind(this);
    this.sendUser = this.sendUser.bind(this);
  }

  // componentDidMount() {
  //   DeviceUUID.getUUID().then((uuid) => {
  //     DeviceUUIDNumber = uuid;
  //     alert(DeviceUUIDNumber)
  //   }).catch((err) => {
  //     alert(err);
  //   });
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

  sendUser(user) {
    let userJSON = {userName: user, userID: 0}
    this.socket.emit('user', userJSON)
    this.socket.on('user', result => {
      if(result.message !== true) {
        alert(result.message);
      } else {
        this.setState({user: this.state.userInput, addUserInput: false, actions: []})
      }
    })
  }

  toolbarActions(position) {
    if(position === 0){ //Name register
      this.setState({addUserInput: true});
    }
  }

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
    var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      paddingTop: 150,
      padding: 20
    };
    var innerContainerTransparentStyle = {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center'
    }
    return (
      <View style={{ flex: 1 }}>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.addUserInput}
            onRequestClose={() => {this.setState({addUserInput: false})}}
            >
              <View style={modalBackgroundStyle}>
                <View style={innerContainerTransparentStyle}>
                    <Text>Register Username:</Text>
                    <TextInput
                      style={{ width: 250}}
                      onSubmitEditing={ this.buttonPress }
                      onEndEditing={this.clearFocus}
                      onChangeText={ user => {
                        if(user === '') {
                          this.setState({userInput: 'ReactChat User'});
                        } else {
                          this.setState({userInput: user});
                        }
                      } }
                      placeholder={'Your username'}
                      />
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Button onPress={()=> {this.sendUser(this.state.userInput)}} transparent>OK</Button>
                        <Button onPress={()=> this.setState({addUserInput: false})} transparent>Cancel</Button>
                      </View>
                  </View>
                </View>
            </Modal>
          <ToolbarAndroid
            navIcon={require('./img/ic_menu_black_24dp.png')}
            title="React Chat"
            actions={this.state.actions}
            style={{
             	height: 56,
              backgroundColor: '#e9eaed'
            }}
            onActionSelected={this.toolbarActions}
          />
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
