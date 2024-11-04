Math.rand = (min, max) => Math.random() * (max - min) + min;
Math.randI = (min, max) => Math.random() * (max - min) + min | 0; // only for positive numbers 32bit signed int
Math.randItem = arr => arr[Math.random() * arr.length | 0]; // only for arrays with length < 2 ** 31 - 1
// contact points of two circles radius r1, r2 moving along two lines (a,e)-(b,f) and (c,g)-(d,h) [where (,) is coord (x,y)]
Math.circlesInterceptUnitTime = (a, e, b, f, c, g, d, h, r1, r2) => { // args (x1, y1, x2, y2, x3, y3, x4, y4, r1, r2)
    const A = a * a, B = b * b, C = c * c, D = d * d;
    const E = e * e, F = f * f, G = g * g, H = h * h;
    var R = (r1 + r2) ** 2;
    const AA = A + B + C + F + G + H + D + E + b * c + c * b + f * g + g * f + 2 * (a * d - a * b - a * c - b * d - c * d - e * f + e * h - e * g - f * h - g * h);
    const BB = 2 * (-A + a * b + 2 * a * c - a * d - c * b - C + c * d - E + e * f + 2 * e * g - e * h - g * f - G + g * h);
    const CC = A - 2 * a * c + C + E - 2 * e * g + G - R;
    return Math.quadRoots(AA, BB, CC);
}   
Math.quadRoots = (a, b, c) => { // find roots for quadratic
    if (Math.abs(a) < 1e-6) { return b != 0 ? [-c / b] : []  }
    b /= a;
    var d = b * b - 4 * (c / a);
    if (d > 0) {
        d = d ** 0.5;
        return  [0.5 * (-b + d), 0.5 * (-b - d)]
    }
    return d === 0 ? [0.5 * -b] : [];
}
Math.interceptLineBallTime = (x, y, vx, vy, x1, y1, x2, y2,  r) => {
    const xx = x2 - x1;
    const yy = y2 - y1;
    const d = vx * yy - vy * xx;
    if (d > 0 ) {  // only if moving towards the line
        const dd = r / (xx * xx + yy * yy) ** 0.5;
        const nx = xx * dd;
        const ny = yy * dd;
        return (xx * (y - (y1 + nx)) - yy * (x -(x1 - ny))) / d;
    }
}

function resolveCollisions() {
    var minTime = 0, minObj, minBall, resolving = true, idx = 0, idx1, after = 0, e = 0;
    while(resolving) { // too main ball may create very lone resolution cycle. e limits this
        resolving = false;
        minObj = undefined;
        minBall = undefined;
        minTime = 1;
        idx = 0;
        for(const b of balls) {
            idx1 = idx + 1;
            while(idx1 < balls.length) {
                const b1 = balls[idx1++];
                const time = b.interceptBallTime(b1, after);
                if(time !== undefined) {
                    if(time <= minTime) {
                        minTime = time;
                        minObj = b1;
                        minBall = b;
                        resolving = true;
                    }
                }
            }
            for(const l of lines) {
                const time = b.interceptLineTime(l, after);
                if(time !== undefined) {
                    if(time <= minTime) {
                        minTime = time;
                        minObj = l;
                        minBall = b;
                        resolving = true;
                    }
                }
            }
            idx ++;
        }
        if(resolving) {
            if (minObj instanceof Ball) {
                minBall.collide(minObj, minTime);
            } else {
                minBall.collideLine(minObj, minTime);
            }
            after = minTime;
        }
    }
}