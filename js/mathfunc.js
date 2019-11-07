// JavaScript source code

function Clamp(num = 0, min = 0, max = 0) {
    return Math.min(Math.max(num, min), max);
}

function Clamp2(num = 0, min = 0, max = 0) {
    if (num >= max) {
        return max;
    }
    if (num <= min) {
        return min;
    }

    return num;
}

function ToRadians(degrees = 0.0) {
    return degrees * (Math.PI / 180.0)
}

function ToDegrees(radians = 0) {
    return radians * (180.0 / Math.PI);
}

function Lerp(start, end, value) {
    return (1 - value) * start + value * end;
}

function LerpVector(start, end, value) {
    var vector = start;

    vector.x = Lerp(start.x, end.x, value);
    vector.y = Lerp(start.y, end.y, value);
    vector.z = Lerp(start.z, end.z, value);

    return vector;
}

function LerpColor(start, end, value) {
    var vector = start;

    vector.r = Lerp(start.r, end.r, value);
    vector.g = Lerp(start.g, end.g, value);
    vector.b = Lerp(start.b, end.b, value);

    return vector;
}