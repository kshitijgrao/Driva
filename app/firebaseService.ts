import { firebase } from '@react-native-firebase/functions';  // Import Firebase functions

// Function to push the final driving score to Firebase
export const pushDrivingScore = async (userId: string, score: number) => {
  try {
    const scoreUpdate = firebase.functions().httpsCallable('pushDrivingScore');
    const result = await scoreUpdate({
      userId,
      score,
    });
    console.log('Driving score pushed to Firebase:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error pushing driving score:', error);
    throw error;
  }
};
