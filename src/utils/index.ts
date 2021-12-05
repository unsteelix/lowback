import sizeOf  from 'image-size';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';


/**
 * remove last slash '/'
 */
export const trimDataPath = (path: string) => {
    
    const str = path.trim();

    if(str.length > 1) {
        if(str[str.length - 1] === '/'){
            return str.slice(0, str.length - 1)
        }
    }

    return str
}

/**
 * get width, height of image
 */
export const getImgDimensions = async (path: string) => {
    try {
        const dimensions = await sizeOf(path)
        const { width, height } = dimensions

        if(!width || !height){
            throw new Error('could not determine the image dimensions')
        }

        return {
            width,
            height
        }
    } catch (err: any) {
        throw new Error(err.message)
    }
}

/**
 * convert to webp, resize and save
 */
export const optimizeFiles = async (filePath: string, destination: string, dimensions?: {width: number,height: number}) => {

    let options: any = {
        preset: 'photo',
        method: 6,
        lossless: true,
    }

    if(dimensions){
        options = { 
            ...options,
            resize: dimensions
        }
    }

    try {
        const optimized = await imagemin([filePath], {
            plugins: [
                imageminWebp(options)
            ]
        });
    
        const buffer = optimized[0]?.data;
    
        if(optimized.length === 0 || !buffer) {
            throw new Error('failed to optimize')
        }
    
        fs.writeFile(destination, buffer, (err) => {
            if(err){
                throw new Error(err.message)
            }
        })
    
        return path.basename(destination);

    } catch(e: any) {
        throw new Error(e.message)
    }
} 