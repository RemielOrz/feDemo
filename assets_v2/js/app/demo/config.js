/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 下午2:32
 */
({
    baseUrl: ".",
    paths: {
        "$":"../../lib/zepto.min",
        "OE": "../../module/OE",
        "Calendar": "../../module/calendar/calendar",
        "MsgBox": "../../module/msgBox/msgBox"
    },
    shim: {
        "$": {
            exports: "$"
        }
    },
    name: "main",
    out: "mainbuild.js"
})