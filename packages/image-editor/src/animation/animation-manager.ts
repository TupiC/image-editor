export type EasingFunction = (t: number) => number;

export const Easing = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export interface AnimationOptions<T> {
    from: T;
    to: T;
    duration?: number;
    easing?: EasingFunction;
    onUpdate: (state: T) => void;
    onComplete?: () => void;
}

export class AnimationManager {
    private animationFrame: number | null = null;

    animate<T extends Record<string, number>>(options: AnimationOptions<T>) {
        const {
            from,
            to,
            duration = 200,
            easing = Easing.linear,
            onUpdate,
            onComplete,
        } = options;
        const startTime = performance.now();

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const animateFrame = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easing(progress);

            const currentState = {} as T;
            for (const key in from) {
                if (Object.prototype.hasOwnProperty.call(from, key)) {
                    currentState[key] = lerp(
                        from[key],
                        to[key],
                        eased
                    ) as T[typeof key];
                }
            }

            onUpdate(currentState);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animateFrame);
            } else {
                if (onComplete) onComplete();
            }
        };

        this.stop();
        this.animationFrame = requestAnimationFrame(animateFrame);
    }

    stop() {
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}
