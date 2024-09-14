export default function getIsGameover(snake, minX, maxX, minY, maxY, snakeSize){
    const snakeHead = snake[0];

    const offset = 0;
    
    if(snakeHead.x <= minX+offset || snakeHead.x+snakeSize >= maxX-offset || snakeHead.y <= minY+offset || snakeHead.y+snakeSize >= maxY-offset){
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        if (snakeHead.x === segment.x && snakeHead.y === segment.y) {
            return true;
        }
    }

    return false;
}