
Assets = class {

    constructor() {
        this.images = [];
    }

    load(images, callback) {
        this._preloadImages(images, this.images, callback);
    }

    image(name) {
        for (const index in this.images) {
            const image = this.images[index];
            if (image.name == name) {
                return image;
            }
        }
        console.log("[Assets] image not found " + name);
        return null;
    }

    _preloadImages(srcs, imgs, callback) {
        var img;
        var remaining = srcs.length;
        for (var i = 0; i < srcs.length; i++) {
            img = new Image();
            img.onload = function() {
                --remaining;
                if (remaining <= 0) {
                    callback();
                }
            };
            img.src = srcs[i];
            img.name = srcs[i];
            imgs.push(img);
            console.log("[Assets] loading " + img.name);
        }
    }
}