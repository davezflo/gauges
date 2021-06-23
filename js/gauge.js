
class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

var styles = 
    {
        "pencil": {
            "themes": {
                "blue": [
                    "blue",
                    2,
                    "30",
                    "Helvetica"
                ]
            }
        },
        "neon": { 
        "themes": {
                "blue": [
                    "rgba(0,0,255,0.2)",
                    50,
                    "blue",
                    "30",
                    "Helvetica"
                ],
                "red": [
                    "rgb(255,0,0,0.2)",
                    50,
                    "red",
                    "30",
                    "Helvetica",
                ],
                "green": [
                    "rgb(0,255,0,0.2)",
                    50,
                    "green",
                    "30",
                    "Helvetica"
                ],
                "yellow": [
                    "rgb(255,255,0,0.2)",
                    50,
                    "yellow",
                    "30",
                    "Helvetica"
                ],
                "orange": [
                    "rgb(255,165,0,0.2)",
                    50,
                    "orange",
                    "30",
                    "Helvetica"
                ],
                "purple": [
                    "rgb(128,0,128,0.2)",
                    50,
                    "purple",
                    "30",
                    "Helvetica"
                ],
            }
        }
    };

class Gauge
{
    constructor(ctx, element, min, max, style="neon", theme="blue", label="None")
    {
        this.min = min;
        this.max = max;
        this.element = element;
        this.ctx = ctx;
        this.style = style;
        this.theme = theme;
        this.label = label;
        this.reset();
    }

    reset()
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0, this.element.width, this.element.height);
    }

    _center()
    {
        return new Point(this.element.width/2, this.element.height/3*2);
    }

    _neonText(center, text, offY, fontadjust)
    {
        this.ctx.font = "bold " + (styles[this.style]["themes"][this.theme][3]*fontadjust).toString()+"px "+styles[this.style]["themes"][this.theme][4];
        this.ctx.fillStyle = styles[this.style]["themes"][this.theme][2];

        var adjust = styles[this.style]["themes"][this.theme][3]*fontadjust;
        adjust = adjust/3*2 * (text.length)/2;

        this.ctx.fillStyle = styles[this.style]["themes"][this.theme][2];
        this.ctx.fillText(text, center.x-adjust, center.y+offY);
    
        this.ctx.font = (styles[this.style]["themes"][this.theme][3]*fontadjust).toString()+"px "+styles[this.style]["themes"][this.theme][4];
        this.ctx.fillStyle = "rgb(255,255,255,0.8)";
        this.ctx.shadowBlur = styles[this.style]["themes"][this.theme][1]*.1;
        this.ctx.shadowColor = styles[this.style]["themes"][this.theme][2];
        this.ctx.fillText(text, center.x-adjust, center.y+offY);
    }

    _neon(outside, inside, center, percentRads, value)
    {
        //startline
        for(var i=0;i<(outside-inside);i++)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = styles[this.style]["themes"][this.theme][0];
            this.ctx.lineWidth = i+1;
            this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
            this.ctx.shadowBlur = styles[this.style]["themes"][this.theme][1];
            this.ctx.shadowColor = styles[this.style]["themes"][this.theme][2];
            this.ctx.stroke();
        }

        for(i=0;i<5;i++)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgb(255,255,255,0.2)"; //white, but 40% opaque
            this.ctx.lineWidth = (outside-inside)*(.9-i/10);
            this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
            this.ctx.shadowBlur = styles[this.style]["themes"][this.theme][1]/5;
            this.ctx.shadowColor = "white";
            this.ctx.stroke();
        }

        

        this._neonText(center, value.toString(), 0, 1);
        this._neonText(center, this.label, parseInt(styles[this.style]["themes"][this.theme][3]), .5);

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

        let fn = this["_"+this.style];
        fn.apply(this, [outside, inside, center, percentRads, value]);        
    }
}