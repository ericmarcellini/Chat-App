import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

  //Firebase 
const firebase = require('firebase');
require('firebase/firestore');
const firebaseConfig ={
  apiKey: "AIzaSyARwinlu4lrb2iWF2d6HDI4_SdPl96NO90",
  authDomain: "chat-app-1958c.firebaseapp.com",
  projectId: "chat-app-1958c",
  storageBucket: "chat-app-1958c.appspot.com",
  messagingSenderId: "757390137378",
  appId: "1:757390137378:web:0498d316e4e58c8d0ad27b",
  measurementId: "G-MBQKE5VH2E"
}



export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: ''
      },
      image: null,
      location: null,
      isConnected: false,
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        this.referenceChatMessages = firebase.firestore().collection("messages");

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name
            },
            messages: []
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.getMessages();
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || '',
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({
      messages
    });
  }

  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      text: message.text || null,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // When user is offline disable the ability to access input field
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    )
  }

  renderBubble(props){
    return (
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000'
        },
        left: {
          backgroundColor: '#FFFFFF'
        }
      }} 
      />
    )
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3,
            }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
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
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  }
})