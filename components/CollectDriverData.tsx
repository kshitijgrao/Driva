import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Gyroscope } from 'expo-sensors';


export function CollectDriverData() {
    const [location, setLocation] : any = useState();
    const [gyroscopeData, setGyroscopeData] : any = useState();

    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              console.log('Permission to access location was denied');
              return;
            }
        
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            console.log(currentLocation);
        };

        const startGyroscope = async () => {
            Gyroscope.setUpdateInterval(1000); 
            Gyroscope.addListener((data) => {
                setGyroscopeData(data);
                console.log(data);
            });
        }
        
        requestLocationPermission();
        startGyroscope();

        return () => {
            Gyroscope.removeAllListeners();
        }
    }, []);





}



  


 