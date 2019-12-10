//export let a = console.log("这里是公共部分")

// import '@babel/polyfill'
import "./../css/a.scss"
export default console.log("这里是公共部分")
const func = () => {
    console.log('hello webpack')
}
func()
// $(function () {
//     console.log("这里引入了JQ")
// })
class User {
    constructor() {
        console.log('new User')
    }
}

const user = new User()

// let arr = ['a', 'b', 'c'];
// let iter = arr[Symbol.iterator]();

// console.log(iter.next())
// console.log(iter.next())
// console.log(iter.next())
// console.log(iter.next())

// const buffer = new ArrayBuffer(12);

// const x1 = new Int32Array(buffer);
// x1[0] = 1;
// const x2 = new Uint8Array(buffer);
// x2[0] = 2;