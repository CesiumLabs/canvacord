import { Image as SkImage } from "@napi-rs/canvas";
import { promises as fs, existsSync } from "fs";
import { ImageSourceType } from "../typings/types";
import fetch from "node-fetch";

/**
 * Utility function to load images
 * @param source Image source
 */
async function loadImage(source: ImageSourceType, createSkImage?: true): Promise<SkImage>;
async function loadImage(source: ImageSourceType, createSkImage?: false): Promise<Buffer>;
async function loadImage(source: ImageSourceType, createSkImage = true): Promise<SkImage | Buffer> {
    if (source instanceof SkImage) return createSkImage ? source : source.src;
    if (typeof source === "string" && existsSync(source)) {
        const data = await fs.readFile(source);
        return createSkImage ? createImage(data) : data;
    } else if (typeof source === "string") {
        const res = await fetch(source);
        if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
        const data = await res.buffer();
        return createSkImage ? createImage(data) : data;
    } else {
        return createSkImage ? createImage(source) : source;
    }
}

function createImage(src: Buffer): SkImage {
    const imageConstructor = new SkImage();
    imageConstructor.src = src;

    return imageConstructor;
}

export { loadImage, createImage };
