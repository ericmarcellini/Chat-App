import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat'

export default class Chat extends React.Component {
  constructor(){
    super();
    this.state = {
      messages: [],
    }
  }

  // Mounts the components
  componentDidMount(){
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

  // Sets the state of the MSG Array  
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
         {
          _id: 2,
          text: `Welcome ${name}`,
          createdAt: new Date(),
          system: true,
         },
      ],
    })
  }

  // Message bubble customization ('yours')
  renderBubble(props){
    return (
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000'
        }
      }} 
      />
    )
  }

  // Function that allows us to stack our new message on top of the older ones
  onSend(messages = []){
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    let backgColor = this.props.route.params.backgColor
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={[styles.container, 
        { backgroundColor: backgColor }]}>
  
      <GiftedChat
      renderBubble={this.renderBubble.bind(this)}
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      user={{
      _id: 1,
      }}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>   
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  }
})