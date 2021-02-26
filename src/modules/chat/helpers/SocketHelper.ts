import * as socketIO from 'socket.io'
// export const emitAsync = (socket: SocketIO.Socket, emitName: string, data: string, cb) => {
//     return new Promise((resolve, reject) => {
//         if (!socket || !socket.emit)
//             reject('Socket not implement!')
//         socket.emit(emitName, data, (...args) => {
//             let response
//             if (typeof cb === 'function')
//                 response = cb(...args)
//             resolve(response)
//         })
//     })
// }

export function emitAsync(socket, emitName, data, callback) {
    return new Promise((resolve, reject) => {
        if (!socket || !socket.emit) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('pls input socket');
        }
        socket.emit(emitName, data, (...args) => {
            let response;
            if (typeof callback === 'function') {
                response = callback(...args);
            }
            resolve(response);
        });
    });
}

export const socketIdHandler = (ids: any) => {
    return ids[0] ? JSON.parse(JSON.stringify(ids[0])).socketid : '';
}

let timeStamp = Date.parse(new Date().toString())
let limitCount = {}
export const socketRequestFrequency = socketId => {
    const now = Date.parse(new Date().toString())
    if (now - timeStamp > 60000) {
        limitCount = {}
        timeStamp = now
        return false
    }

    if (limitCount[socketId] > 30) return true
    limitCount[socketId] = (limitCount[socketId] || 0) + 1
    return false
}
