/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, KeyboardAvoidingView, Text, TextInput, View, ScrollView, ListView } from 'react-native'
import { Container, Content, Header, InputGroup, Input, Icon, Button } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import SocketCluster from 'socketcluster-client';

class reactChat extends Component {
  constructor(props) {
    super(props);
    var socket = socketCluster.connect();
    socket.emit('message', {message: 'This is an object with a message property'});
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const welcomeMessage = {
      user: 'system',
      text: 'Welcome to ReactChat!'
    };
    this.state = {
      placeholder: 'Enter message...',
      user: 'ReactChat User',
      text: '',
      textToInput: [welcomeMessage],
      dataSource: this.ds.cloneWithRows([welcomeMessage])
    };
    this.buttonPress = this.buttonPress.bind(this);
  }

  buttonPress() {
    if (this.state.text.trim() === '') return;
    const textToInput = [
      ...this.state.textToInput,
      {
        user: this.state.user,
        text: this.state.text
      }
    ];
    this.setState({
      textToInput: textToInput,
      dataSource: this.ds.cloneWithRows(textToInput),
      text: ''
    });
    this.listView.scrollTo({ y: textToInput.length * 50 });
  }

  render() {
    return (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <ListView ref={listView => this.listView = listView }
          style={{ flex: 1 }}
          onContentSizeChange={() => this.listView.scrollTo({
             y: this.state.textToInput.length * 50
          })}
          dataSource={ this.state.dataSource }
          renderRow={ rowData => {
              const user = rowData.user !== 'system' ? `${rowData.user}: ` : '';
              const text = rowData.text; 
              return (
                <Text style={{ fontSize: 14 }}>
                  {user + text}
                </Text>
              )}} />
        <View style={{ height: 40 }}>
          <View style={{ borderTopWidth: .5, borderTopColor: 'gray', flex: 1, flexDirection: 'row' }}>
            <TextInput
              style={{ flex: 1 }}
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
