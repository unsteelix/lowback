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