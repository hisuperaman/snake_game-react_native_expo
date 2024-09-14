import { Fragment } from "react";
import { View, StyleSheet } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"

const gap = 10;

export default function Snake({snake, size}){
    return (
        <Fragment>
            {
                snake.map((segment, index)=>{
                    const segmentStyle = {
                        ...styles.snake,
                        width: size,
                        height: size,
                        left: segment.x,
                        top: segment.y
                    }
                    return (
                        <View key={index} style={segmentStyle}>

                        </View>
                    )
                })
            }
        </Fragment>
    )
}

const styles = StyleSheet.create({
    snake: {
        backgroundColor: Colors.primary,
        position: 'absolute',
        borderRadius: 7
    }
})