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
  constructor(){
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar:'',
      },
      isConnected: false,
      image: null,
      location: null,
    };

       //connecting to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages")
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)
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
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: this.state.user,
    })
  }

  async saveMessages(){
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error){
      console.log(error.message);
    }
  }

    // Function that allows us to stack our new message on top of the older ones
  onSend(messages = []){
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessages();
    });
  }
  

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
        image: data.image,
        location: data.location,
      })
    })
  // Sets the state of the MSG Array  
    this.setState({
    messages,
    })
  }

  // Mounts the components
  componentDidMount(){
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected){
        this.setState({ isConnected: true });


    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        messages: [],
        uid: user.uid,
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      })
      this.userMsg = firebase.firestore().collection("messages").where("uid", "==", this.state.uid);

      this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);
    });
      } else {
        this.getMessages();
        console.log('offline');
    }
    });


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
        },
        left: {
          backgroundColor: '#FFFFFF'
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
      renderBubble={this.renderBubble.bind(this)}
      renderInputToolbar={this.renderInputToolbar.bind(this)}
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      renderActions={this.renderCustomActions}
      renderCustomView={this.renderCustomView}
      user={{
        name: this.state.name,
        _id: this.state.user._id,
        avatar: this.state.user.avatar,
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