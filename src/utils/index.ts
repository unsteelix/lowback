import sizeOf  from 'image-size';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import DB from '../database';
import log from '../logger';


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


interface ICookieMap {
    [key: string]: string;
}

/**
 * parse cookies
 */
const getCookies = (req: Request) => {
    const cookieHeader = req.headers.cookie;
    console.log('\n\n', cookieHeader, '\n\n')

    if(!cookieHeader){
        return null;
    }

    const cookieList = cookieHeader.split(';').map(cookie => cookie.trim()).map(cookie => {
        const list = cookie.split('=');
        if(list && list[0] && list[1]){
            return {
                key: list[0],
                value: list[1]
            }
        } else {
            return null
        }
    })

    let res: ICookieMap = {}

    cookieList.forEach(cookie => {
        if(cookie){
            res[cookie.key] = cookie.value
        }
    })
    
    return res
}

/**
 * parsing token from Authorization Header and Cookie Header
 */
export const parseTokenFromReq = (req: Request) => {

    const bearerHeader = req.headers['authorization'];
    const cookieHeader = getCookies(req);

    if(!bearerHeader && !cookieHeader ){
        return null;
    }

    let token = null;

    /**
     * priority Authorization Token > priority Cookie Token
     */
    if(bearerHeader) {
        token = bearerHeader.toLowerCase().split('bearer')[1]?.trim();
    } 

    if(!token) {
        token = cookieHeader && 'token' in cookieHeader ? cookieHeader.token : null;
    }


    return token
}

/**
 * initialize the database skeleton
 */
export const initializeDBSkeleton = () => {
    
    /**
     * initialize /tokens
     */
    const tokensData = {
        master: {
            "12345678": [
                "master_token"
            ]
        },
        site_one: {
            password_1: [
                "toke_one",
                "token_two"
            ],
            password_2: [
                "toke_one"
            ]
        },
        site_two: {
            password_3: [
                "token_two"
            ],
            password_4: [
                "toke_three"
            ]
        }
    }

    try {
        DB.checkPath('/tokens');
    } catch(e) {
        log.warn('[SERVER]: DB initialize /tokens')
        DB.push('/tokens', tokensData)
    }

    /**
     * initialize /rights
     */
    const rightsData = {
        master_token: {
            show: [
                "/"
            ]
        },
        token_one: {
            show: [
                "/site_one/users",
                "/site_two"
            ],
            hide: [
                "/site_one/users/10"
            ],
            secret: [
                "/site_one/materials"
            ]
        },
        token_two: {
            show: [
                "/site_two/users",
                "/site_two/materials"
            ],
            hide: [
                "/site_two/cards"
            ]
        }
    }

    try {
        DB.checkPath('/rights');
    } catch(e) {
        log.warn('[SERVER]: DB initialize /rights')
        DB.push('/rights', rightsData)
    }

    /**
     * initialize /public
     */
    const publicData = [
        "/site_one/pages",
        "/site_two"
    ]

    try {
        DB.checkPath('/public');
    } catch(e) {
        log.warn('[SERVER]: DB initialize /public')
        DB.push('/public', publicData)
    }
}


/**
 * checking access rights
 */
export const checkAccessRights = (_path: any) => {

}


/**
 * check token existens
 */
export const isTokenExist = (token: string) => {

    let tokens = []

    const data = DB.get('/tokens')
    for(let site in data){
        const res = Object.values(data[site])
        tokens.push(res)
    }

    tokens = tokens.flat(2)

    if(tokens.includes(token)){
        return true
    } 

    return false
}


export const getMasterToken = () => {
    const data = DB.get('/tokens/master');

    const token: any[] = Object.values(data).flat(2);

    return token[0]
}

/**
 * return true, if this DB route: "/get", "/push", "/merge", "delete"
 * else return false
 */
export const isRouteDB = (req: Request) => {

    const { url } = req;

    const listDataBaseRoute: string[] = [
        "/get",
        "/push",
        "/merge",
        "/delete",
    ]

    for(let i = 0; i < listDataBaseRoute.length; i++) {
        const partURL: string = listDataBaseRoute[i] || '';
        if(url.indexOf(partURL) === 0) {
            return true
        }    
    }

    // listDataBaseRoute.forEach(route => {
    //     if(url.indexOf(route) === 0) {
    //         return true
    //     }
    // })

    return false;
}