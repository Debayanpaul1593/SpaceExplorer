import React, {Component} from 'react';
import axios from 'axios';

export const BASE_URL = 'https://findfalcone.herokuapp.com/';
class WebService {
  callFalcon = endpoint => {
    return new Promise(async (resolve, reject) => {
      var response = {};
      try {
        response = await axios.get(BASE_URL + endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 120000,
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  };

  falconPost = (endPoint, body) => {
    return new Promise(async (resolve, reject) => {
      var response = {};
      try {
        response = await axios.post(BASE_URL + endPoint, body, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 120000,
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  };
}

export default WebService;
