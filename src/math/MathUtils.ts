module WOZLLA.math {

    export module MathUtils {

        export function rectIntersect(a, b) {
            return a.x < b.x + b.width &&
                b.x < a.x + a.width &&
                a.y < b.y + b.height &&
                b.y < a.y + a.height;
        }

        export function rectIntersect2(ax, ay, aw, ah, bx, by, bw, bh) {
            return ax <= bx + bw &&
                bx <= ax + aw &&
                ay <= by + bh &&
                by <= ay + ah;
        }

    }

}