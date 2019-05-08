
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

    static polyFill(a, b, c, d, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = "#000";
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

    static texture(texture, pts) {
        var tris = [[0, 1, 2], [2, 3, 0]]; // Split in two triangles
        for (var t = 0; t < 2; t++) {
            var pp = tris[t];
            var x0 = pts[pp[0]].x, x1 = pts[pp[1]].x, x2 = pts[pp[2]].x;
            var y0 = pts[pp[0]].y, y1 = pts[pp[1]].y, y2 = pts[pp[2]].y;
            var u0 = pts[pp[0]].u, u1 = pts[pp[1]].u, u2 = pts[pp[2]].u;
            var v0 = pts[pp[0]].v, v1 = pts[pp[1]].v, v2 = pts[pp[2]].v;

            // Set clipping area so that only pixels inside the triangle will
            // be affected by the image drawing operation
            ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2); ctx.closePath(); ctx.clip();

            // Compute matrix transform
            var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
            var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
            var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
            var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2
                - v0 * u1 * x2 - u0 * x1 * v2;
            var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
            var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
            var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2
                - v0 * u1 * y2 - u0 * y1 * v2;

            // Draw the transformed image
            ctx.transform(delta_a / delta, delta_d / delta,
                delta_b / delta, delta_e / delta,
                delta_c / delta, delta_f / delta);
            ctx.drawImage(texture, 0, 0);
            ctx.restore();
        }
    }
}