const nativeRequire = window.native_require
const {dialog} = nativeRequire('electron')

export default function openFolder(){
    return new Promise((resolve,reject)=>{
        try{
            dialog.showOpenDialog({properties: ['openFile'],filters:[{
                name:'Audio',
                extensions:['mp3','wav','wmv','m4a']
            }]},(res)=>{
                resolve(res)
            })
        } catch(e){
            reject(e)
        }
    })
}