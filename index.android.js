/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry, Text, View} from 'react-native'
import {Container, Content, Header, InputGroup, Input, Icon, Button  } from 'native-base';

class reactChat extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '',
                  textToInput: ''};
    this.buttonPress = this.buttonPress.bind(this);
  }
  buttonPress() {
    this.setState({textToInput: this.state.text});
  }
  render() {
    return (
      <Container>
          <Content>
              <InputGroup borderType='underline'>
                  <Icon name="ios-home" style={{color:'#384850'}}/>
                  <Input onChangeText={(text) => this.setState({text})} placeholder="Введите сообщение..."/>
              </InputGroup>
              <Button onPress={this.buttonPress}success>Отправить</Button>
              <Text style={{padding: 10, fontSize: 42}}>
                  {this.state.textToInput}
              </Text>
          </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent('reactChat', () => reactChat);
