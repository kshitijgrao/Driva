import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Gyroscope } from 'expo-sensors';
// import ActivityRecognition from 'react-native-activity-recognition';


// export function detectActivity() {
//     const [activity, setActivity] : any = useState();

//     useEffect(() => {

//         const detectionIntervalMillis = 100;
//         ActivityRecognition.start(detectionIntervalMillis);

//         this.unsubscribe = ActivityRecognition.subscribe(detectedActivity => {
//             const mostProbableActivity = detectedActivities.sorted[0]
//         });

//     }, []);
// }
