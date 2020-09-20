import React, {Component} from 'react';
import {Text, View, ToastAndroid, ActivityIndicator} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import WebService from '../services/webService';
import {Dropdown} from 'react-native-material-dropdown-v2';
import {ScrollView} from 'react-native-gesture-handler';
import {async} from 'rxjs';

class HomeComponent extends Component {
  constructor() {
    super();
    this.state = {
      dataPlanets: [],
      dataVehicles: [],
      planet1: '',
      planet2: '',
      planet3: '',
      planet4: '',
      planetsDataImm: [],
      dataSelectedValues: [],
      vehicleSelection: ['', '', '', ''],
      token: '',
      timeTaken: 0,
    };
    this.ws = new WebService();
  }

  componentDidMount() {
    this.queryPlanets();
    this.queryVehicles();
    this.getToken();
  }

  render() {
    return (
      <View style={{flex: 1, marginLeft: 20, marginRight: 20}}>
        <View style={{flex: 5.5}}>
          {(this.state.dataPlanets.length === 0 &&
            this.state.dataVehicles.length === 0 &&
            this.state.token !== '' && (
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator size="large" color="#8A2BE2" />
              </View>
            )) || (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{textAlign: 'center', fontSize: 20}}>
                {`Time Taken: ${this.state.timeTaken}`}
              </Text>
              <Dropdown
                label="Planet 1"
                data={this.state.dataPlanets}
                onChangeText={(value, index, data) =>
                  this.handleDDSelection(0, 'planet1', value, index, data)
                }
              />
              {this.state.dataSelectedValues[0] !== undefined &&
                this.getRadioGroup(0)}
              <Dropdown
                label="Planet 2"
                data={this.state.dataPlanets}
                onChangeText={(value, index, data) =>
                  this.handleDDSelection(1, 'planet2', value, index, data)
                }
              />
              {this.state.dataSelectedValues[1] !== undefined &&
                this.getRadioGroup(1)}
              <Dropdown
                label="Planet 3"
                data={this.state.dataPlanets}
                onChangeText={(value, index, data) =>
                  this.handleDDSelection(2, 'planet3', value, index, data)
                }
              />
              {this.state.dataSelectedValues[2] !== undefined &&
                this.getRadioGroup(2)}
              <Dropdown
                label="Planet 4"
                data={this.state.dataPlanets}
                onChangeText={(value, index, data) =>
                  this.handleDDSelection(3, 'planet4', value, index, data)
                }
              />
              {this.state.dataSelectedValues[3] !== undefined &&
                this.getRadioGroup(3)}
            </ScrollView>
          )}
        </View>
        <View style={{flex: 0.5, justifyContent: 'center'}}>
          <Button mode="contained" onPress={() => this.callFindFalcone()}>
            Find Falcone
          </Button>
        </View>
      </View>
    );
  }

  getTimeTaken = () => {
    var timeTaken = 0;
    for (let i = 0; i < 4; i++) {
      const selectedPlanet = this.state.dataSelectedValues[i];
      if (selectedPlanet !== undefined) {
        const planetDist = this.getDistToPlanet(selectedPlanet);
        const vehicle = this.state.vehicleSelection[i];
        if (vehicle !== '' && planetDist !== 667) {
          const vehicleSpeed = this.getVehicleSpeed(vehicle);
          if (vehicleSpeed !== 667) {
            timeTaken += planetDist / vehicleSpeed;
          }
        }
      }
    }
    this.setState({timeTaken: timeTaken});
  };

  getVehicleSpeed(vehicleName) {
    const {dataVehicles} = this.state;
    for (let i = 0; i < dataVehicles.length; i++) {
      if (dataVehicles[i].name === vehicleName) {
        return dataVehicles[i].speed;
      }
    }
    return 667;
  }

  getDistToPlanet(planetName) {
    const {planetsDataImm} = this.state;
    for (let i = 0; i < planetsDataImm.length; i++) {
      if (planetsDataImm[i].name === planetName) {
        return planetsDataImm[i].distance;
      }
    }
    return 667;
  }

  handleDDSelection = async (planetIndex, key, value, index, data) => {
    var data = this.state.dataSelectedValues;
    data[planetIndex] = value;
    this.setState({dataSelectedValues: data}, () => {
      //perform filtering
      var planets = [];
      const immLen = this.state.planetsDataImm.length;
      var count = 0;
      this.state.planetsDataImm.forEach(item => {
        count++;
        if (!this.state.dataSelectedValues.includes(item.name)) {
          planets = [
            ...planets,
            {
              value: item.name,
            },
          ];
        }
        if (immLen === count) {
          this.setState({dataPlanets: planets});
        }
      });
    });
  };

  getPlanetsData = async () => {
    const {planetsDataImm} = this.state;
    const dataVal = planetsDataImm.map(item => {
      return {
        value: item.name,
      };
    });

    return dataVal;
  };

  getToken = async () => {
    const response = await this.ws.falconPost('token', '');
    this.setState({token: response.token}, () =>
      ToastAndroid.show('Token Received!', ToastAndroid.SHORT),
    );
  };

  queryPlanets = async () => {
    try {
      const planets = await this.ws.callFalcon('planets');
      var planetsData = [];
      const arrlength = planets.length;
      var count = 0;
      planets.map(item => {
        count++;
        planetsData = [
          ...planetsData,
          {
            value: item.name,
          },
        ];
        if (count === arrlength) {
          this.setState(
            {dataPlanets: planetsData, planetsDataImm: planets},
            () => ToastAndroid.show('Received Planets', ToastAndroid.SHORT),
          );
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  queryVehicles = async () => {
    try {
      const vehicles = await this.ws.callFalcon('vehicles');
      this.setState({dataVehicles: vehicles}, () =>
        ToastAndroid.show('Received Vehicles', ToastAndroid.SHORT),
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  getRadioGroup = index => {
    const planetVal = this.state.dataSelectedValues[index];
    var maxDist = 100;
    for (let i = 0; i < this.state.planetsDataImm.length; i++) {
      var scanPlanet = this.state.planetsDataImm[i];
      if (scanPlanet.name === planetVal) {
        maxDist = scanPlanet.distance;
      }
    }
    return (
      <RadioButton.Group
        onValueChange={value => {
          var newArr = this.state.vehicleSelection;
          newArr[index] = value;
          this.setState({vehicleSelection: newArr}, () => this.getTimeTaken());
        }}
        value={this.state.vehicleSelection[index]}>
        {this.state.dataVehicles.map(item => {
          return this.getVehicleOptionsView(index, item, maxDist);
        })}
      </RadioButton.Group>
    );
  };

  callFindFalcone = async () => {
    let reqBody = {
      token: this.state.token,
      planet_names: this.state.dataSelectedValues,
      vehicle_names: this.state.vehicleSelection,
    };
    try {
      const response = await this.ws.falconPost('find', reqBody);
      console.log(`Received response: ${response}`);
      if (response.hasOwnProperty('error')) {
        ToastAndroid.show(response.error, ToastAndroid.SHORT);
      } else if (response.hasOwnProperty('status')) {
        if (response.status === 'success') {
          ToastAndroid.show(
            `Success Congratulations on finding Falcone. King Shan is mighty pleased\nPlanet found:${response.planet_name}\nTime Taken: ${this.state.timeTaken}`,
            ToastAndroid.LONG,
          );
        } else {
          ToastAndroid.show('Could not find falcone!', ToastAndroid.SHORT);
        }
      }
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  getVehicleOptionsView = (ddIndex, item, maxDist) => {
    const {vehicleSelection} = this.state;
    //check total no. of vehicles available
    const totAvail = item.total_no;
    //count the total no. of vehicles that have been used
    var count = 0;
    var ddParent = [];
    for (let i = 0; i < vehicleSelection.length; i++) {
      if (vehicleSelection[i] === item.name) {
        //add the parent for which the vehicle has been used
        ddParent = [...ddParent, i];
        count++;
      }
    }
    var avail = true;

    //if the vehicle has not been used for the current parent only then disable it
    if (count === totAvail && !ddParent.includes(ddIndex)) {
      avail = false;
    }
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <RadioButton
          value={item.name}
          style={{flex: 1}}
          disabled={item.max_distance < maxDist || !avail}
        />
        <Text style={{flex: 4, paddingTop: 5}}>{item.name}</Text>
        <Text style={{flex: 1, paddingTop: 5, color: 'red'}}>{`${
          !avail ? 'NA' : ''
        }`}</Text>
      </View>
    );
  };
}

export default HomeComponent;
