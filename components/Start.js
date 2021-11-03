import React from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {
    constructor(props){
        super(props);
        this.state ={
          name: '',
          backgColor: '#00f2ff'
        };
        
      }
    
      // alert the user input
      alertMyText (input= []){
        Alert.alert(input.name);
      }
    
    
    render(){
        return(
        <View style={styles.container}>
          <ImageBackground 
              source={require("../assets/backgroundimg.png")} resizeMode="cover" style={styles.image}>
            <Text style={styles.title}>ChatAPP</Text>
            <View style={styles.box}>   
              <View>
                  <TextInput
                  onChangeText={(text) => this.setState({name: text})} 
                  value={this.state.name}
                  placeholder='Type your name here...'
                  style={styles.textinput}
                  />
              </View>
              <Text>Background Color</Text>
              <View style={styles.colors}>
                <TouchableOpacity onPress={() => this.setState ({backgColor: '#8A95A5'}) } style={styles.grey} ></TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState ({backgColor: "#ffffff"}) } style={styles.white}></TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState ({backgColor: "#474056"}) } style={styles.purple}></TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState ({backgColor: "#090C08"}) } style={styles.black}></TouchableOpacity>
              </View>
              <View>
                <Button
                title="Start Chatting"
                onPress={() => this.props.navigation.navigate('Chat', {backgColor: this.state.backgColor, name: this.state.name })}
                />
              </View>
            </View> 
          </ImageBackground>
        </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    title: {
      color: "white",
      fontSize: 42,
      lineHeight: 84,
      fontWeight: "bold",
      textAlign: "center"
    },

    image: {
      width: "100%",
      height: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      flex: 1,
    },

    textinput: {
      flex: 1,
      height: 50,
      maxHeight: 50,
      borderColor: "gray",
      borderWidth: 3,
      width: "88%",
      padding: 5,
      paddingLeft: 10,
      fontSize: 16,
      fontWeight: "300",
      color: "#008080",
      opacity: 0.5,
    },

    box: {
      backgroundColor: "#ffffffc4",
      flexGrow: 1,
      flexShrink: 0,
      width: "88%",
      marginBottom: 30,
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      padding: 30,
      height: 260,
      minHeight: 260,
      maxHeight: 290,
      borderRadius: 20,
    },

    colors: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-between'
    },

    black: {
      backgroundColor: "#090C08",
      width: 50,
      height: 50,
      marginRight: 20,
      borderRadius: 50 / 2,
    },

    purple: {
      backgroundColor: "#474056",
      width: 50,
      height: 50,
      marginRight: 20,
      borderRadius: 50 / 2,
    },

    grey: {
      backgroundColor: "#8A95A5",
      width: 50,
      height: 50,
      marginRight: 20,
      borderRadius: 50 / 2,
    },

    white: {
      backgroundColor: "#ffffff",
      width: 50,
      height: 50,
      marginRight: 20,
      borderRadius: 50 / 2,
    }

  }); 