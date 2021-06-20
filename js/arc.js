
class Arc 
{
    constructor(ctx)
    {
        this.ctx = ctx;
        this.ctx.fillStyle = "rgb(255, 0, 0)";
    }

    makeArc() 
    {
        this.ctx.beginPath();
        this.ctx.arc(10,10,10, Math.PI, 0);

        this.ctx.stroke();
    }
}