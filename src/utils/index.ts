import sizeOf  from 'image-size';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { serviceDB as DBS, contentDB as DBC } from '../database';
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
        DBS.checkPath('/tokens');
    } catch(e) {
        log.warn('[SERVER]: DB initialize /tokens')
        DBS.push('/tokens', tokensData)
    }

    /**
     * initialize /rights
     */
    const rightsData = {
        master_token: {
            read: {
                show: ['/'],
                hide: [],
                secret: []
            },
            write: [
                '/'
            ]
        },
        another_token: {
            read: {
                show: ['/site_2'],
                hide: ['/site_2/hidden', '/site_2/users'],
                secret: ['/site_2/pages']
            },
            write: [
                '/site_2'
            ]
        }
    }

    try {
        DBS.checkPath('/rights');
    } catch(e) {
        log.warn('[SERVER]: DB initialize /rights')
        DBS.push('/rights', rightsData)
    }

    /**
     * initialize /public
     */
    const publicData = [
        "/",
        "/site_3/"
    ]

    try {
        DBS.checkPath('/public');
    } catch(e) {
        log.warn('[SERVER]: DB initialize /public')
        DBS.push('/public', publicData)
    }
}


interface IReadRights {
    "show"?: Array<string>,
    "hide"?: Array<string>,
    "secret"?: Array<string>
}

type IWriteRights = Array<string>

interface ITokenRights {
    "read"?: IReadRights,
    "write"?: IWriteRights
}

/**
 * checking READ rights
 * return true if have READ access, else false
 */
export const checkReadRights = (dataPath: string, rights: ITokenRights) => {
    
    let haveAccess = false

    if(dataPath && rights){

        if('read' in rights && rights.read){

            const read = rights.read

            /**
             * check SHOW
             */
            if(read && read.show && read.show.length > 0){
                read.show.forEach(path => {
                    if(isPathConsist(dataPath, path)){
                        haveAccess = true;
                    }
                })
            }

            /**
             * check HIDE
             */
            if(read && read.hide && read.hide.length > 0){
                read.hide.forEach(path => {
                    if(isPathConsist(dataPath, path)){
                        haveAccess = false;
                    }
                })
            }

        }

    }
    
    return haveAccess
}



/**
 * checking WRITE rights
 * return true if have WRITE access, else false
 */
export const checkWriteRights = (dataPath: string, rights: ITokenRights) => {
    
    let haveAccess = false

    if(dataPath && rights){

        if('write' in rights && rights["write"] && rights["write"].length > 0){
            const write = rights["write"]
            
            write.forEach((el: string) => {
                if(dataPath.indexOf(el) === 0){
                    haveAccess = true;
                }
            })
        }

    }
    
    return haveAccess
}

/**
 * check token existens
 */
export const isTokenExist = (token: string) => {

    let tokens = []

    const data = DBS.get('/tokens')
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
    const data = DBS.get('/tokens/master');

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
        "/get/",
        "/push/",
        "/merge/",
        "/delete/",
    ]

    for(let i = 0; i < listDataBaseRoute.length; i++) {
        const partURL: string = listDataBaseRoute[i] || '';
        if(url.indexOf(partURL) === 0) {
            return true
        }    
    }

    return false;
}

/**
 * return READ or WRITE
 * 
 * read: 
 *   - /get
 * write:
 *   - /push 
 *   - /merge 
 *   - /delete 
*/ 
export const getDBMethodType = (req: Request) => {

    const readMethods = [
        "/get/"
    ];

    const writeMethods = [
        "/push/",
        "/merge/",
        "/delete/"
    ];

    const { url } = req;

    let methodType = null;

    readMethods.forEach(method => {
        if(url.indexOf(method) === 0){
            methodType = 'read'
        }
    })

    writeMethods.forEach(method => {
        if(url.indexOf(method) === 0){
            methodType = 'write'
        }
    })

    return methodType
}

/**
 * return path (/site_2/pages) from DB route (/get/site_2/pages)
 * work with routes: /get, /push, /merge, /delete
 */
export const getPathFromDBroute = (req: Request) => {

    const routes = [
        "/get",
        "/push",
        "/merge",
        "/delete"
    ]

    const { url } = req;

    let path = '';

    routes.forEach(route => {
        if(url.indexOf(route) === 0) {
            path = url.slice(route.length, url.length)
        }
    })

    return path;
}

export const getTokenRights = (token: string, key?: 'read' | 'write' | 'show' | 'hide' | 'secret') => {
    const rights = DBS.get(`/rights/${token}`)

    if(!key) {
        return rights
    }

    if(key === 'read') {
        if('read' in rights && rights.read) {
            return rights.read
        }
    }

    if(key === 'write') {
        if('write' in rights && rights.write) {
            return rights.write
        }
    }

    if(key === 'show') {
        if('read' in rights && rights.read) {
            const read = rights.read;
            if('show' in read && read.show) {
                return read.show
            }        
        }
    }

    if(key === 'hide') {
        if('read' in rights && rights.read) {
            const read = rights.read;
            if('hide' in read && read.hide) {
                return read.hide
            }        
        }
    }

    if(key === 'secret') {
        if('read' in rights && rights.read) {
            const read = rights.read;
            if('secret' in read && read.secret) {
                return read.secret
            }        
        }
    }

}


/**
 * return true, if this route is public (set in /public)
 */
export const isPublicPath = (req: Request): boolean => {
    const { url } = req; 

    let isPublic = false;

    /**
     * check public paths for /get route
     */
    if(url.indexOf('/get/') === 0) {
        const publicPaths = DBS.get('/public');
        const path = url.slice(4, url.length);

        publicPaths.forEach((publicPath: string) => {
            if(path?.indexOf(publicPath) === 0) {
                isPublic = true
            } 
        });
    }

    return isPublic
}

/**
 * return true if this path is secret
 */
export const isSecretPath = (req: Request) => {

    let isSecret = false

    const token = parseTokenFromReq(req);
    if(token){

        const rights: ITokenRights = getTokenRights(token)

        const path = getPathFromDBroute(req)
    
        if(rights && "read" in rights) {
            const read = rights.read;
            if(read && "secret" in read) {
                const secret = read.secret;
                if(secret && secret.length > 0){
                    secret.forEach(oneSecretPath => {
                        if(trimDataPath(oneSecretPath) === trimDataPath(path)) {
                            isSecret = true
                        }
                    })
                }
            }
        }
        
    } else {
        throw new Error ("token not found. Can`t parse secret paths")
    }

    return isSecret
}

/**
 * return true, if this path inside secret path
 */
export const isInsideSecretPath = (req: Request) => {

    let isInside = false;

    const token = parseTokenFromReq(req);
    
    const { params }: any = req;
    const path = `/${params[0]}`;

    if(token){
        const secretPath = getSecretPathByDataPath(token, path)
        if(secretPath){
            if(isPathConsist(path, secretPath)) {

                const diff = path.length - secretPath.length;

                if(diff >= 2) {
                    isInside = true
                }
            }
        }
    }

    return isInside
}

/**
 * return true if PATH consist SUB_PATH
 */
export const isPathConsist = (path: string, sub_path: string) => {

    if(path.indexOf(sub_path) === 0){
        return true
    }

    return false
}

/**
 * return secret path by dataPath
 * 
 */
export const getSecretPathByDataPath = (token: string, path: string): string | null => {
    const rights = getTokenRights(token);

    let res = null

    if('read' in rights && rights.read){
        const read = rights.read;
        if('secret' in read && read.secret){
            const secret = read.secret;
            if(secret.length > 0) {
                secret.forEach((oneSecret: string) => {
                    if(isPathConsist(path, oneSecret)){
                        res = oneSecret
                    }
                });
            }
        }
    }

    return res
}

/**
 * get data by path and hidden paths
 */
export const getDataWithHiddenPaths = (path: string, hiddenPaths: string[]) => {

    let data = DBC.get(trimDataPath(path));

    /**
     * make new list hidden paths from paths, who inside main path
     */
    const hiddenInnerPaths: string[] = []
    hiddenPaths.forEach(hiddenPath => {
        if(isPathConsist(hiddenPath, path)){
            hiddenInnerPaths.push(hiddenPath)
        }
    })

    /**
     * remove each hidden branch
     */
    hiddenInnerPaths.forEach(oneHiddenPath => {
        const rawParts = trimDataPath(oneHiddenPath).split('/');        
        let parts: string[] = []
        
        rawParts.forEach(part => {
            if(part && part.length > 0){
                parts.push(part)
            }
        })
        
        let branch = data

        parts.forEach((part: string, i: number) => {
            const keys = Object.keys(branch);
            keys.forEach(key => {
                if(key == part){
                    if(i === parts.length - 1) {
                        delete branch[key];
                    }
                    branch = branch[key]
                }
            })
        })
    })

    return data
}