// function wrapAsync(fn) {
//     return function (err, req, res, next) {
//         fn(req, res, next).catch(next)
//     }
// }

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}