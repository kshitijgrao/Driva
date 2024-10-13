import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { pushDrivingScore } from './firebaseService'; // Push the final score to Firebase

// A function to calculate the driving score based on speed and acceleration
const calculateScore = (speed: number, acceleration: number): number => {
  let score = 100; // Start with a full score
  if (speed > 20) score -= (speed - 20) * 2; // Example penalty for speed > 20 m/s
  if (acceleration > 5) score -= (acceleration - 5) * 5; // Example penalty for harsh acceleration
  return Math.max(0, score); // Ensure score is not negative
};

export const useDrivingTracker = () => {
  const [isDriving, setIsDriving] = useState(false);
  const [totalScore, setTotalScore] = useState(100); // Keep track of the overall driving score
  const [sessionId, setSessionId] = useState<string | null>(null); // Session ID for stopping session

  useEffect(() => {
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let score = 100; // Start the driving session with a full score

      // Track location and calculate score based on speed and acceleration
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // 1 second interval
          distanceInterval: 10,
        },
        (location) => {
          const speed = location.coords.speed || 0; // Speed in m/s
          const acceleration = 0; // Placeholder for actual acceleration data

          // Calculate driving score based on speed and acceleration
          const currentScore = calculateScore(speed, acceleration);
          score = Math.min(score, currentScore); // Keep the lowest score during the session

          setTotalScore(score); // Update the total score
        }
      );

      return () => {
        if (locationSubscription) locationSubscription.remove();
      };
    };

    // Stop session and push the final score to Firebase
    const stopTracking = async () => {
      if (isDriving) {
        setIsDriving(false);
        if (sessionId) {
          await pushDrivingScore('exampleUserId', totalScore); // Push the final score to Firebase
          setSessionId(null); // Reset session ID
        }
        console.log('Driving session ended with score:', totalScore);
      }
    };

    if (isDriving) {
      startTracking(); // Start tracking when driving is detected
    } else {
      stopTracking(); // Stop tracking when driving ends
    }

  }, [isDriving, sessionId, totalScore]);

  return { isDriving, totalScore };
};
