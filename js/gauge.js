
class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

styles = [
    {"style": "neon", 
        "colors": [
            {
                "blue": [
                    "rgb(0,0,255,0.1)",
                    50,
                    "blue"
                ],
                "red": [
                    "rgb(255,0,0,0.1)",
                    50,
                    "red"
                ],
                "green": [
                    "rgb(0,255,0,0.1)",
                    50,
                    "green"
                ],
            }
        ]}
]

class Gauge
{
    constructor(ctx, element, min, max, style="neon", color="blue")
    {
        this.min = min;
        this.max = max;
        this.element = element;
        this.ctx = ctx;
        this.style = style;
        this.color = color;
        this.reset();
    }

    reset()
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0, this.element.width, this.element.height);
    }

    _center()
    {
        return new Point(this.element.width/2, this.element.height/2);
    }

    makeFillMeterArc(value)
    {
        this.ctx.shadowBlur = 0;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "white";
        var percent = value/(this.max-this.min);
        var percentRads = Math.PI+percent * Math.PI;
        var outside = this.element.width/2.5;
        var inside = this.element.width/4;
        var center = this._center();
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y,outside, Math.PI, 0);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y,inside, Math.PI, 0);
        this.ctx.stroke();

        //startline
        for(var i=0;i<(outside-inside);i++)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = styles[this.style][this.color][0];
            this.ctx.lineWidth = i+1;
            this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
            this.ctx.shadowBlur = styles[this.style][this.color][1];
            this.ctx.shadowColor = styles[this.style][this.color][2];
            this.ctx.stroke();
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255,255,255,0.1)";
        this.ctx.lineWidth = (outside-inside)/4*3;
        this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
        
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255,255,255,0.1)";
        this.ctx.lineWidth = (outside-inside)/2;
        this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255,255,255,0.1)";
        this.ctx.lineWidth = (outside-inside)/4;
        this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255,255,255,0.2)";
        this.ctx.lineWidth = (outside-inside)/8;
        this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
        this.ctx.stroke();
        
    }
}