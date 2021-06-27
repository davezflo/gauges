
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
        "flat": {
            "themes": {
                "blue": {
                    "color": "blue",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "red": {
                    "color": "red",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "green": {
                    "color": "green",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "purple": {
                    "color": "purple",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "orange": {
                    "color": "orange",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "yellow": {
                    "color": "yellow",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
            }
        },
        "pencil": {
            "themes": {
                "blue": {
                    "color": "blue",
                    "linewidth": 2,
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "red": {
                    "color": "red",
                    "linewidth": 2,
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "green": {
                    "color": "green",
                    "linewidth": 2,
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "purple": {
                    "color": "purple",
                    "linewidth": 2,
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "orange": {
                    "color": "orange",
                    "linewidth": 2,
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "yellow": {
                    "color": "yellow",
                    "linewidth": 2,
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
            }
        },
        "neon": { 
        "themes": {
                "blue": {
                    "color": "rgba(0,0,255,0.2)",
                    "blur": 50,
                    "blurcolor": "blue",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "red": {
                    "color": "rgb(255,0,0,0.2)",
                    "blur": 50,
                    "blurcolor": "red",
                    "fontsize": ".25",
                    "fontname": "Helvetica",
                },
                "green": {
                    "color": "rgb(0,255,0,0.2)",
                    "blur": 50,
                    "blurcolor": "green",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "yellow": {
                    "color": "rgb(255,255,0,0.2)",
                    "blur": 50,
                    "blurcolor": "yellow",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "orange": {
                    "color": "rgb(255,165,0,0.2)",
                    "blur": 50,
                    "blurcolor": "orange",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
                "purple": {
                    "color": "rgb(128,0,128,0.2)",
                    "blur": 50,
                    "blurcolor": "purple",
                    "fontsize": ".25",
                    "fontname": "Helvetica"
                },
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
        this.fontsize = parseFloat(styles[this.style]["themes"][this.theme]["fontsize"]) * this.element.width;
        this.reset();
    }

    reset()
    {
        this.ctx.fillStyle = "rgba(0,0,0,.1)";
        this.ctx.fillRect(0,0, this.element.width, this.element.height);
    }

    _center()
    {
        return new Point(this.element.width/2, this.element.height/3*2);
    }

    _neonText(center, text, offY, fontadjust)
    {
        this.ctx.font = "bold " + (this.fontsize*fontadjust).toString()+"px "+styles[this.style]["themes"][this.theme]["fontname"];
        this.ctx.fillStyle = styles[this.style]["themes"][this.theme]["blurcolor"];

        var adjust = this.fontsize*fontadjust;
        adjust = adjust/2 * (text.length)/2;

        this.ctx.fillStyle = styles[this.style]["themes"][this.theme]["blurcolor"];
        this.ctx.fillText(text, center.x-adjust, center.y+offY);
    
        this.ctx.font = (this.fontsize*fontadjust).toString()+"px "+styles[this.style]["themes"][this.theme]["fontname"];
        this.ctx.fillStyle = "rgb(255,255,255,0.8)";
        this.ctx.shadowBlur = styles[this.style]["themes"][this.theme]["blur"]*.1;
        this.ctx.shadowColor = styles[this.style]["themes"][this.theme]["blurcolor"];
        this.ctx.fillText(text, center.x-adjust, center.y+offY);
    }

    _neon(outside, inside, center, percent, value)
    {
        var percentRads = Math.PI+percent * Math.PI;

        //startline
        for(var i=0;i<(outside-inside);i++)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = styles[this.style]["themes"][this.theme]["color"];
            this.ctx.lineWidth = i+1;
            this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
            this.ctx.shadowBlur = styles[this.style]["themes"][this.theme]["blur"];
            this.ctx.shadowColor = styles[this.style]["themes"][this.theme]["blurcolor"];
            this.ctx.stroke();
        }

        var brightness = 5;
        for(i=0;i<brightness;i++)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgb(255,255,255,0.2)"; //white, but 20% opaque
            this.ctx.lineWidth = (outside-inside)*(.9-i/10); //decimate line thickness (gets brighter the closer to center)
            this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
            this.ctx.shadowBlur = styles[this.style]["themes"][this.theme]["blur"]/brightness;
            this.ctx.shadowColor = "white";
            this.ctx.stroke();
        }

        this._neonText(center, value.toString(), 0, 1);
        this._neonText(center, this.label, this.fontsize*.8, .5);

    }

    _flatText(center, text, offY, fontadjust)
    {
        var adjust = this.fontsize*fontadjust;
        adjust = adjust/2 * (text.length)/2;
        this.ctx.fillStyle = styles[this.style]["themes"][this.theme]["color"];
        this.ctx.font = "bold " + (this.fontsize*fontadjust).toString()+"px "+styles[this.style]["themes"][this.theme]["fontname"];
        this.ctx.fillStyle = styles[this.style]["themes"][this.theme][2];
        this.ctx.fillText(text, center.x-adjust, center.y+offY);
    }

    _flat(outside, inside, center, percent, value)
    {
        var percentRads = Math.PI+percent * Math.PI;
        this.ctx.beginPath();
        this.ctx.strokeStyle = styles[this.style]["themes"][this.theme]["color"];
        this.ctx.lineWidth = (outside-inside);
        this.ctx.arc(center.x, center.y, inside+(outside-inside)/2, Math.PI, percentRads);
        this.ctx.stroke();

        this._flatText(center, value.toString(), 0, 1);
        this._flatText(center, this.label, this.fontsize*.8, .5);
    }

    _pencilText(center, text, offY, fontadjust)
    {
        var adjust = this.fontsize*fontadjust;
        adjust = adjust/2 * (text.length)/2;
        this.ctx.font = (this.fontsize*fontadjust).toString()+"px "+styles[this.style]["themes"][this.theme]["fontname"];
        this.ctx.strokeStyle = styles[this.style]["themes"][this.theme][2];
        this.ctx.strokeText(text, center.x-adjust, center.y+offY);
    }

    _pencil(outside, inside, center, percent, value)
    {
        var last=Math.PI;
        for(var i=0;i<percent;i+=.01)
        {
            var tolerance = 5;
            var twist = Math.floor(tolerance*Math.random())/100;
            if(Math.random()<.5) twist *=-1;

            var next = Math.PI+(i+twist)*Math.PI;
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = styles[this.style]["themes"][this.theme]["color"];
            this.ctx.lineWidth = styles[this.style]["themes"][this.theme]["linewidth"];
            this.ctx.moveTo(center.x+(inside*Math.cos(last)), center.y+(inside*Math.sin(last)));
            this.ctx.lineTo(center.x+(outside*Math.cos(next)), center.y+(outside*Math.sin(next)));
            this.ctx.stroke();
            last = next;
        }

        this._pencilText(center, value.toString(), 0, 1);
        this._pencilText(center, this.label, this.fontsize*.8, .5);
    }

    makeFillMeterArc(value)
    {
        this.ctx.shadowBlur = 0;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = styles[this.style]["themes"][this.theme]["color"];
        var percent = value/(this.max-this.min);
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
        fn.apply(this, [outside, inside, center, percent, value]);        
    }
}