import React from 'react';
import { StyleSheet, Text, View, Button, Switch } from 'react-native';
import axios from 'axios';

export default class App extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      where: 'Quiz',
      switchValue: false,
      position: 0
    }
  }

  componentWillMount() {
    axios.get('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=boolean')
      .then(response => {
        console.log(response.data.results);
        this.setState({ data: response.data.results })
      });
  }

  startQuiz() {
    this.setState({
      where: 'Test',
      position: 0,
      result: [],
      timeNow: new Date()
    })
  }

  toggleSwitch() {
    if(this.state.switchValue) {
      this.setState({
        switchValue: false
      })
    } else {
      this.setState({
        switchValue: true
      })
    }
  }

  nextQ() {
    let endTime = new Date();
    let  timeDiff = endTime - this.state.timeNow;
    let sec = timeDiff / 1000;
    //let sec = Math.round(timeDiff);
    let correct;
    let realAns;
    if (this.state.switchValue === true) {
      realAns = "True";
    } else {
      realAns = "False";
    }
    if(this.state.data[this.state.position].correct_answer === realAns) {
      correct = 1;
    } else {
      correct = 0;
    }
    let res = this.state.result;
    res.push({correct, sec});
    let position = this.state.position + 1;
    this.setState({
      result: res,
      switchValue: false,
      position
    });

    console.log('HERE:', this.state.result);
  }

  replay() {
    this.setState({
      where: 'Quiz',
      switchValue: false,
      position: 0,
      result: []
    })
  }

  render() {
    const { where, switchValue, data, position, result } = this.state;
    let appView;
    if(where === 'Quiz') {
      appView = (
        <Button
        onPress={this.startQuiz.bind(this)}
        title="Start Quiz"
        color="#841584"
        />
      );
    } else if (where === 'Test' && position < 10) {
      appView = (
        <View>
          <Text>{data !== undefined ? data[position].question : 'Loading..'}</Text>
          <Switch
            onValueChange = {this.toggleSwitch.bind(this)}
            value = {switchValue}
          />
          <Button
          onPress={this.nextQ.bind(this)}
          title="Next"
          color="#841584"
          />
        </View>
      );
    } else {
      let score = 0;
      for (var i = 0; i < result.length; i++) {
       score += result[i].correct;
      }
      console.log(score);
      appView = (
        <View>
          <Text>Your score: {score} and you took: {result[9].sec}

          </Text>
          <Button
          onPress={this.replay.bind(this)}
          title="Play again"
          color="#841584"
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {appView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
