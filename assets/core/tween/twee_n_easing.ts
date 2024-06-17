/**
 * 緩動方式
 */
export const tweeNEasing = {
    //
    linear: function(value: number): number {
        return value;
    },

    //
    quad: {
        //
        in: function(value: number): number {
            return value * value;
        },

        //
        out: function(value: number): number {
            return value * (2 - value);
        },

        //
        inOut: function(value: number): number {
            if ((value *= 2) < 1) {
                return 0.5 * value * value;
            }
            else {
                return -0.5 * (--value * (value - 2) - 1);
            }
        }
    },

    //
    cubic: {
        //
        in: function(value: number): number {
            return value * value * value;
        },

        //
        out: function(value: number): number {
            return --value * value * value + 1;
        },

        //
        inOut: function(value: number): number {
            if ((value *= 2) < 1) {
                return 0.5 * value * value * value;
            }
            else {
                return 0.5 * ((value -= 2) * value * value + 2);
            }
        }
    },

    //
    quart: {
        //
        in: function(value: number): number {
            return value * value * value * value;
        },

        //
        out: function(value: number): number {
            return 1 - --value * value * value * value;
        },

        //
        inOut: function(value: number): number {
            if ((value *= 2) < 1) {
                return 0.5 * value * value * value * value;
            }
            else {
                return -0.5 * ((value -= 2) * value * value * value - 2);
            }
        }
    },

    //
    quint: {
        //
        in: function(value: number): number {
            return value * value * value * value * value;
        },

        //
        out: function(value: number): number {
            return --value * value * value * value * value + 1;
        },

        //
        inOut: function(value: number): number {
            if ((value *= 2) < 1) {
                return 0.5 * value * value * value * value * value;
            }
            else {
                return 0.5 * ((value -= 2) * value * value * value * value + 2);
            }
        }
    },

    //
    expo: {
        //
        in: function(value: number): number {
            return value === 0 ? 0 : Math.pow(1024, value - 1);
        },

        //
        out: function(value: number): number {
            return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
        },

        //
        inOut: function(value: number): number {
            switch (value) {
                case 0: return 0;
                case 1: return 1;

                default:
                    if ((value *= 2) < 1) {
                        return 0.5 * Math.pow(1024, value - 1);
                    }
                    else {
                        return 0.5 * (-Math.pow(2, -10 * (value - 1)) + 2);
                    }
            }
        }
    },

    //
    circ: {
        //
        in: function(value: number): number {
            return 1 - Math.sqrt(1 - value * value);
        },

        //
        out: function(value: number): number {
            return Math.sqrt(1 - --value * value);
        },

        //
        inOut: function(value: number): number {
            if ((value *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - value * value) - 1);
            }
            else {
                return 0.5 * (Math.sqrt(1 - (value -= 2) * value) + 1);
            }
        }
    },

    // 
    elastic: {
        //
        in: function(value: number): number {
            switch (value) {
                case 0: return 0;
                case 1: return 1;

                default:
                    return -Math.pow(2, 10 * (value - 1)) * Math.sin((value - 1.1) * 5 * Math.PI);
            }
        },

        //
        out: function(value: number): number {
            switch (value) {
                case 0: return 0;
                case 1: return 1;

                default:
                    return Math.pow(2, -10 * value) * Math.sin((value - 0.1) * 5 * Math.PI) + 1;
            }
        },

        //
        inOut: function(value: number): number {
            switch (value) {
                case 0: return 0;
                case 1: return 1;

                default:
                    if ((value *= 2) < 1) {
                        return -0.5 * Math.pow(2, 10 * (value - 1)) * Math.sin((value - 1.1) * 5 * Math.PI);
                    }
                    else {
                        return 0.5 * Math.pow(2, -10 * (value - 1)) * Math.sin((value - 1.1) * 5 * Math.PI) + 1;
                    }
            }
        }
    },
}
