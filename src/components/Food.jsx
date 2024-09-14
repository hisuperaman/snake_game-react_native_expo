import { View, Text, StyleSheet } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"


export default function Food({ x, y, size }) {
    const foodStyle = {
        width: size,
        height: size,
        ...styles.food,
        top: y,
        left: x
    }

    return (

        <View style={foodStyle}>
            <Text>🍎</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    food: {
        position: 'absolute'
    }
})