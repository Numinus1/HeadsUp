import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Switch, FlatList, Pressable, Alert, TouchableOpacity, Dimensions} from 'react-native';
import {DeviceMotion} from 'expo-sensors';

const screen = Dimensions.get('window');
const countdown = 3;
const countround = 30;

const getRemainingTime = (time) => {
    const min = Math.floor(time/60);
    const sec = time - (min * 60);
    return {min, sec};
}

export default function App() {

    const [remainingSec, setRemainingSec] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const {min, sec} = getRemainingTime(remainingSec);
    const [gamma, setGamma] = useState(0);
    const [gameState, setGameState] = useState(0);
    const [gameMsg, setMsg] = useState('Make Phone Vertical to Begin!');
    const [index, setIndex] = useState(0);
    const [stater, setStater] = useState(-1);
    const [correctWords, setCorrect] = useState(0);
    const [passedWords, setPass] = useState(0);

    var movies = ["The Godfather", "The Shawshank Redemption", "The Godfather II", "Inception", "Fight Club", "The Dark Knight", "12 Angry Men", "Lord of the Rings", "The Matrix", "Seven", "Schindler's List", "Raging Bull", "Casablanca", "Citizen Kane", "Gone With The Wind", "The Wizard of Oz", "Lawrence of Arabia"];

    rotation = {
        angle: 0,
    }

    DeviceMotion.setUpdateInterval(50);

    

    useEffect(() => {
        if (gameState == 0){
          DeviceMotion.addListener(({rotation}) => {
            const gamma_t = Math.abs(rotation.gamma);
    
            setGamma(gamma_t);
              if ((gamma_t > 1.3) && (gamma_t < 1.7)){
                setGameState(1);
                DeviceMotion.removeAllListeners();
                
              }
            
    
          });
        }
        else if (gameState == 1){
            setRemainingSec(countdown);
            setMsg("Get Ready!");
            setIsActive(true);
        }
        else if (gameState == 2){
          setRemainingSec(countround);
          DeviceMotion.addListener(({rotation}) => {
            const gamma_t = Math.abs(rotation.gamma);
    
            setGamma(gamma_t);
              if ((stater != 0) && (gamma_t > 1.3) && (gamma_t < 1.7)){
                setStater(0);
              }
              else if ((stater != 1) && (gamma_t > 1.7)){
                setStater(1);
              }
              else if ((stater != 2) && (gamma_t < 1.3)){
                
                setStater(2);
              }
            
    
          });
        }
        else if (gameState == 3){
          DeviceMotion.removeAllListeners();
          var msger = "Game Over!\n" + "Correct Words: " + correctWords + "\nPassed Words: " + passedWords;
          setMsg(msger);
        }
    }, [gameState]);

    useEffect(() => {
        let interval = null;
        if ((isActive)&&(remainingSec > 0 )){
            interval = setInterval(() => {
                setRemainingSec(remainingSec => remainingSec - 1);
            }, 1000
            );

        }
        else if ((isActive) && (remainingSec <= 0)){
            if (gameState == 1){
              setGameState(2);
            }
            else if (gameState == 2){
              setGameState(3);
            }
            clearInterval(interval);
        }
        else if (!isActive && remainingSec !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, remainingSec]);

    useEffect(() => {
      if (stater == 0){
        setMsg(movies[index]);
      }
      else{
        if (stater == 1){
          setMsg("Correct!");
          setCorrect(correctWords => correctWords + 1);
          if (index >= movies.length - 1){
            setIndex(0);
          }
          else{
            setIndex(index => index + 1);
          }
        }
        else if (stater == 2){
          setMsg("Pass!");
          setPass(passedWords => passedWords + 1);
          if (index >= movies.length - 1){
            setIndex(0);
          }
          else{
            setIndex(index => index + 1);
          }
        }
      }
    }, [stater])

  return (
    <View style = {styles.container}>
        <Text style={styles.textTimer}>
            {`${min}:${sec}`}
        </Text>
        <Text style={styles.text}>
            {`${gameMsg}`}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 5,
    backgroundColor: '#483D8B',
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    fontSize: 35,
    margin: 5,
    color: "#fff",
    textAlign: "center"
  },
  textTimer: {
    fontSize: 20,
    margin: 5,
    color: "#fff",
    textAlign: "center"
  },
  button: {
      borderWidth: 3,
      width: screen.height/2,
      height: screen.height/2,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: screen.height/2

  },
  buttonText: {
      fontSize: 30,
      color: '#fff'
  },
  titular: {
      fontSize: 35,
      margin: 5,
      color: "#fff"
  }
});