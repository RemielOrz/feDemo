/*!
 * Created By remiel.
 * Date: 14-10-15
 * Time: 上午11:10
 */


//字符串格式
!String.prototype.forMart && (String.prototype.forMart = function () {
    var args = arguments, idx = 0;
    return this.replace(/%@([0-9]+)?/g, function (s, argIndex) {
        argIndex = (argIndex) ? parseInt(argIndex, 0) - 1 : idx++;
        s = args[argIndex];
        return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString();
    });
});

//混合字符数
!String.prototype.getLength && (String.prototype.getLength = function (en) {
    return en && this.length || Math.round(this.replace(/[^\x00-\xff]/g, "oo").length / (2));
});