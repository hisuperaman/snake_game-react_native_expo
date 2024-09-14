export default function getDirection(translationX, translationY){
    const swipeOffset = 10;
    if(Math.abs(translationX) > Math.abs(translationY)){
        // x axis
        if(translationX > 0){
            return 'right';
        }
        else{
            return 'left';
        }
    }
    else if(Math.abs(translationX) < Math.abs(translationY)){
        // y axis
        if(translationY > 0){
            return 'down';
        }
        else{
            return 'up';
        }
    }
}