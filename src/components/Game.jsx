import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Colors } from "../styles/colors";
import { useCallback, useEffect, useRef, useState } from "react";
import getDirection from "../utils/getDirection";
import Snake from "./Snake";
import Food from "./Food";
import isFoodEaten from "../utils/isFoodEaten";
import { getRandomCoordinates } from "../utils/getRandomCoordinates";
import Header from "./Header";
import getIsGameover from "../utils/getIsGameover";

import { Audio } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";


const SNAKE_INITIAL_COORDINATES = { x: 30, y: 50 };
const FOOD_INITIAL_COORDINATES = { x: 100, y: 200 };

const BOUNDARY_WIDTH = 370;
const BOUNDARY_HEIGHT = 600;

const SNAKE_SPEED = 5;

const SNAKE_FOOD_OFFSET = 15;

const SCORE_RATE = 10;

const SNAKE_SIZE = 20;
const FOOD_SIZE = 20;

const FPS = 40;
const targetFrameTime = Math.floor(1000 / FPS);


export default function Game() {
    const pan = Gesture.Pan();

    const scoreSFXRef = useRef(null);
    const gameoverSFXRef = useRef(null);

    const [direction, setDirection] = useState('right');
    const [snake, setSnake] = useState([SNAKE_INITIAL_COORDINATES]);

    const [food, setFood] = useState(FOOD_INITIAL_COORDINATES);

    const [isGameover, setIsGameover] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

    const [score, setScore] = useState(0);

    const requestRef = useRef(null);

    const lastPaintTime = useRef(0);

    const [highscore, setHighscore] = useState(0);


    useEffect(() => {
        const loadHighscore = async () => {
            try {
                const storedHighscore = await AsyncStorage.getItem('highscore');
                if (storedHighscore != null) {
                    setHighscore(parseInt(storedHighscore));
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        loadHighscore();
    }, []);

    useEffect(() => {
        const updateHighscore = async () => {
            if (score > highscore) {
                setHighscore(score);
                try {
                    await AsyncStorage.setItem('highscore', highscore.toString());
                }
                catch (error) {
                    console.log(error);
                }
            }
        }

        updateHighscore();
    }, [score]);


    const updateGame = useCallback((timestamp) => {
        if (isGameover || isPaused) {
            cancelAnimationFrame(requestRef.current);
            return;
        }
        requestRef.current = requestAnimationFrame(updateGame);

        if ((timestamp - lastPaintTime.current) < targetFrameTime) {
            return;
        }


        lastPaintTime.current = timestamp;
        moveSnake();

    }, [isGameover, isPaused, moveSnake, snake, direction]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateGame);
        return () => cancelAnimationFrame(requestRef.current);

    }, [updateGame])

    function handleGameover() {
        const gameover = getIsGameover(snake, 0, BOUNDARY_WIDTH, 0, BOUNDARY_HEIGHT, SNAKE_SIZE);
        if (gameover) {
            playGameoverSFX();
            setIsGameover(gameover);
        }
    }

    function moveSnake() {
        handleGameover();

        const snakeHead = snake[0];
        const newSnakeHead = { ...snakeHead };


        switch (direction) {
            case 'right':
                newSnakeHead.x += SNAKE_SPEED;
                break;
            case 'up':
                newSnakeHead.y -= SNAKE_SPEED;
                break;
            case 'left':
                newSnakeHead.x -= SNAKE_SPEED;
                break;
            case 'down':
                newSnakeHead.y += SNAKE_SPEED;
                break;
            default:
                break;
        }


        let newSnake = [newSnakeHead, ...snake.slice(0, -1)];
        

        const isEaten = isFoodEaten(newSnakeHead, food, SNAKE_FOOD_OFFSET);
        if (isEaten) {
            playScoreSFX();
            respawnFood();

    
            newSnake = [newSnakeHead, ...snake];


            setScore((prevScore) => prevScore + SCORE_RATE)
        }


        setSnake(newSnake);
    }

    function respawnFood() {
        const newCoordinates = getRandomCoordinates(0, BOUNDARY_WIDTH, 0, BOUNDARY_HEIGHT, FOOD_SIZE);
        setFood({ x: newCoordinates.x, y: newCoordinates.y })
    }

    pan.onUpdate((event) => {
        const { translationX, translationY } = event;

        let newDirection = getDirection(translationX, translationY);

        
        if(newDirection!=undefined){
            setDirection((prevDirection)=>{
                if((prevDirection=='up' && newDirection=='down')
                    || (prevDirection=='down' && newDirection=='up')
                    || (prevDirection=='left' && newDirection=='right')
                    || (prevDirection=='right' && newDirection=='left')
                ){
                    newDirection = direction;
                }
                return newDirection;   
            });
        }

        
    })

    function handleReloadGame() {
        setDirection('right');
        setSnake([SNAKE_INITIAL_COORDINATES]);

        setFood(FOOD_INITIAL_COORDINATES);

        setIsGameover(false);
        setIsPaused(true);

        setScore(0);
    }


    useEffect(() => {
        async function loadSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sfx/score.mp3')
            );
            scoreSFXRef.current = sound;

            const { sound: gameoverSound } = await Audio.Sound.createAsync(
                require('../../assets/sfx/gameover.mp3')
            );
            gameoverSFXRef.current = gameoverSound;
        }

        loadSound();

        return () => {
            if (scoreSFXRef.current) {
                scoreSFXRef.current.unloadAsync();
            }
            if (gameoverSFXRef.current) {
                gameoverSFXRef.current.unloadAsync();
            }
        };
    }, []);

    const playScoreSFX = async () => {
        if (scoreSFXRef.current) {
            await scoreSFXRef.current.replayAsync(); // Play the sound
        }
    };
    const playGameoverSFX = async () => {
        if (gameoverSFXRef.current) {
            await gameoverSFXRef.current.replayAsync(); // Play the sound
        }
    };


    return (
        <GestureDetector gesture={pan}>
            <SafeAreaView style={styles.container}>

                <Header isPaused={isPaused} handlePauseGame={() => setIsPaused(!isPaused)} handleReloadGame={handleReloadGame}>

                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text>🏆</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: 'green' }}>{highscore}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text>🍎</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: 'green' }}>{score}</Text>
                        </View>
                    </View>

                </Header>

                <View style={styles.gameCanvas}>
                    <Snake snake={snake} size={SNAKE_SIZE} />
                    <Food x={food.x} y={food.y} size={FOOD_SIZE} />
                </View>

                {
                    isGameover ?
                        <View style={styles.gameoverContainer}>
                            <Text style={styles.gameover}>Game over</Text>
                            <Text>Press Restart button to play again</Text>
                            <Text style={{ fontSize: 10 }}>(not the middle one 🤡)</Text>
                        </View>
                        : ''
                }

            </SafeAreaView>
        </GestureDetector>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    gameCanvas: {
        backgroundColor: Colors.secondary,
        width: BOUNDARY_WIDTH,
        height: BOUNDARY_HEIGHT,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        position: 'relative'
    },
    gameoverContainer: {
        position: 'absolute',
        alignItems: 'center'
    },
    gameover: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'red'
    }

});
