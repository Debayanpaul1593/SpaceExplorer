/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Router, Scene} from 'react-native-router-flux';
import HomeComponent from './src/components/home';

class App extends Component {
  render() {
    return (
      <Router>
        <Scene
          key="root"
          navigationBarStyle={{
            backgroundColor: '#8A2BE2',
          }}
          titleStyle={{color: '#FFF'}}
          headerLayoutPreset={'center'}>
          <Scene
            key="home"
            component={HomeComponent}
            title={'Finding Falcone'}
            initial
          />
        </Scene>
      </Router>
    );
  }
}

export default App;
