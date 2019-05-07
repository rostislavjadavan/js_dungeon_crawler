
Graphics = class {
    static point(p) {
        ctx.fillStyle = "#000";
        ctx.fillRect(p.x, p.y, 2, 2);
    }

    static line(a, b) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    static poly(a, b, c, d) {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.strokeWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static text(string, p) {
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(string, p.x, p.y);
    }
}