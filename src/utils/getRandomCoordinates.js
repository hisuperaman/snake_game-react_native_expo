export function getRandomCoordinates(minX, maxX, minY, maxY, foodSize){
    const offset = 50;

    const newMinX = minX+offset;
    const newMaxX = (maxX-offset)-foodSize;
    const newMinY = minY+offset;
    const newMaxY = (maxY-offset)-foodSize;
    const x = Math.floor((Math.random() * newMaxX)+newMinX);
    const y = Math.floor((Math.random() * newMaxY)+newMinY);

    return {x, y};
}