import { Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ActivityIndicator, Button } from "react-native";
import { useState } from "react";
import auth from '@react-native-firebase/auth';
import React from "react";

interface LoginProps {
    setCurrentPage: (currentPage: "Sign-In" | "Home" | "Error") => void;
}

export default function Login({ setCurrentPage }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // sign up option
    const signUp = async () => {
        setLoading(true);
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            setCurrentPage("Home"); // Add this line to change page after successful sign-up
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
            setCurrentPage("Home");
        } catch (error: any) {
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                    <ActivityIndicator size={'small'} style={{ margin: 28 }} />
                ) : (
                    <>
                        <Button onPress={signIn} title="Login" />
                        <Button onPress={signUp} title="Create Account" />
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}