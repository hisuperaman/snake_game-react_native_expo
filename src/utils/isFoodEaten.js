export default function isFoodEaten(snake, food, offset){
    const snake_food_distanceX = Math.abs(snake.x - food.x);
    const snake_food_distanceY = Math.abs(snake.y - food.y);

    if(snake_food_distanceX < offset && snake_food_distanceY < offset){
        return true;
    }
    return false;
}