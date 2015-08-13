Colours = {};

Colours.names = {
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    lime: "#00ff00",
    maroon: "#800000",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    red: "#ff0000",
    yellow: "#ffff00"
};

Colours.random = function() {
    var result;
    var count = 0;
    for (var prop in this.names)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
};