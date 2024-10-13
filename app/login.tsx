import { Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ActivityIndicator, Button } from "react-native";
import {useState, useEffect} from "react";

import auth from '@react-native-firebase/auth';
import React from "react";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // sign up option
    const signUp = async () => {
        setLoading(true);
        try {
            await auth().createUserWithEmailAndPassword(email, password);
        } catch (error: any) {
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // sign in option
    const signIn = async () => {
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
            
        } catch (error: any) {
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    

    /**
     * 
     * CSS file substitute (cannot create CSS files for styling,
     * just define a field in this record [i.e. container, input])
     */
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: 20,
            flex: 1,
            justifyContent: 'center',
        },
        input: {
            marginVertical: 4,
            height: 50,
        }
    });





    // return value of Login obj
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Email"
                />

                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                    placeholder="Password"
                />

                {loading ? (
                    <ActivityIndicator size={'small'} style={{ margin: 28}} />
                ) : (
                    <>
                        <Button onPress={signIn} title="Login" />
                        <Button onPress={signUp} title="Create Account" />
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );


    // logic for sign in vs sign up button



    
}