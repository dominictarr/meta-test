exports.test1 = function (test) {
    test.ok(true)
    test.done()
}

exports.group = {
    test2: function (test) {
//      test.ok(false)
    test.done()
    },
    test3: function (test) {
//        throw new Error('error')
    test.done()
    }
}
