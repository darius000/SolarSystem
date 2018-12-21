// JavaScript source code

function Clamp (num = 0, min = 0, max = 0)
{
    return Math.min(Math.max(num , min), max);
}

function Clamp2(num = 0 ,min = 0,max = 0)
{
    if(num >= max)
    {
        return max;
    }
    if(num <= min)
    {
        return min;
    }

    return num;
}
