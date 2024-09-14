import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Game from './src/components/Game';
import { Fragment } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
    return (
        <GestureHandlerRootView>
            <Game />
        </GestureHandlerRootView>
    )
};

export default App;