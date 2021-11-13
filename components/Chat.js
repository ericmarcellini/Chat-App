// import { QuerySnapshot } from '@firebase/firestore';
import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';


  //Firebase 
const firebase = require('firebase');
require('firebase/firestore');



export default class Chat extends React.Component {
  constructor(){
    super();
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: "Please wait while you're getting logged in"
    }
    const firebaseConfig ={
      apiKey: "AIzaSyARwinlu4lrb2iWF2d6HDI4_SdPl96NO90",
      authDomain: "chat-app-1958c.firebaseapp.com",
      projectId: "chat-app-1958c",
      storageBucket: "chat-app-1958c.appspot.com",
      messagingSenderId: "757390137378",
      appId: "1:757390137378:web:0498d316e4e58c8d0ad27b",
      measurementId: "G-MBQKE5VH2E"
    }
       //connecting to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }  
    
  async getMessages(){
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error){
      console.log(error.message);
    }
  }

  async deleteMessages(){
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error){
      console.log(error.message)
    }
  }

  addMessages(){
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: msg._id,
      text: msg.text,
      createdAt: msg.createdAt,
      user: this.state.user,

    })
  }

    // Function that allows us to stack our new message on top of the older ones
  onSend(messages = []){
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
    });
  }
  
  async saveMessages(){
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error){
      console.log(error.message);
    }
  }


  // Mounts the components
  componentDidMount(){
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected){
        console.log('online');
      } else {
        console.log('offline');
      }
    });

    this.referenceChatMessages = firebase.firestore().collection("messages")
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        messages: [],
        uid: user.uid,
        loggedInText: 'Hello there',
      });
      this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);
    });



      onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each document
        querySnapshot.forEach((doc) => {
          //get the querydoccumentsnapshots data
          let data = doc.data();
          messages.push({
            _id: data._id,
            text:data.text.toString(),
            createdAt: data.createdAt.toDate(),
            user: data.user,
          })
        })
      // Sets the state of the MSG Array  
        this.setState({
        messages,
        })
      }

    this.getMessages();


  }

    //
    componentWillUnmount() {
      this.unsubscribe();
      this.authUnsubscribe();
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

  //Doesn't render input bar if offline
  renderInputToolbar(props){
    if (this.state.isConnected === false){
    } else {
      return (
        <InputToolbar {...props} />
      )
    }
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