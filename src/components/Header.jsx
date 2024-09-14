import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { Colors } from "../styles/colors";
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function Header({ isPaused, handlePauseGame, handleReloadGame, children }) {
    return (
        <View style={styles.menuBar}>
            <TouchableOpacity onPress={handleReloadGame}>
                <Ionicons name="reload-circle" size={45} color="green" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePauseGame}>
                {
                    isPaused ?
                        <Ionicons name="play-circle" size={45} color="green" />
                        :
                        <Ionicons name="pause-circle" size={45} color="green" />
                }
            </TouchableOpacity>

            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    menuBar: {
        backgroundColor: Colors.secondary,
        height: 80,
        width: 370,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 2
    }
})