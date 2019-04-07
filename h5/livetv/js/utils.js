(function() {
    window.Utils = {};
    function dateFormat(timestamp, formats) {
        // formats格式包括
        // 1. Y-m-d
        // 2. Y-m-d H:i:s
        // 3. Y年m月d日
        // 4. Y年m月d日 H时i分
        formats = formats || 'Y-m-d';

        var zero = function (value) {
            if (value < 10) {
                return '0' + value;
            }
            return value;
        };

        var myDate = timestamp? new Date(timestamp): new Date();

        var year = myDate.getFullYear();
        var month = zero(myDate.getMonth() + 1);
        var day = zero(myDate.getDate());

        var hour = zero(myDate.getHours());
        var minite = zero(myDate.getMinutes());
        var second = zero(myDate.getSeconds());

        return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
            return ({
                Y: year,
                m: month,
                d: day,
                H: hour,
                i: minite,
                s: second
            })[matches];
        });
    };

    function getDaysDistance(datestr){
        //距今多少天，2014-10-29 or 2014年10月29日 or 2014.10.29
        var dateArr=datestr.match(/([0-9]{2,4})[\x{5E74}|\-|\.|\\|\/]{1}([0-9]{1,2})[\x{6708}|\-|\.|\\|\/]{1}([0-9]{1,2})[\x{65E5}|\-|\.|\\|\/]{0,1}\s*/);
        if(!dateArr)return "error";
        if(dateArr.length<3)return "error";
        var i_time=new Date().getTime()-new Date(dateArr[1]+"/"+dateArr[2]+"/"+dateArr[3]).getTime();  //两时间的毫秒差

        return Math.floor(i_time/86400000);
    }
    function getTimeDistance(str){
        //2014-10-29 18:00:00
        var ymd=str.split(" ")[0];
        var ymd_arr=ymd.split("-");
        var hms=str.split(" ")[1];
        var hms_arr=hms.split(":");

        var date1=new Date(ymd_arr[0],ymd_arr[1]-1,ymd_arr[2],hms_arr[0],hms_arr[1],hms_arr[2]);
        var date2=new Date();    //结束时间
        var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数
        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000));

        //计算出小时数

        var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.abs(Math.floor(leave1/(3600*1000)));
        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000))
        //计算相差秒数
        var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000);
        //alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");

        if(days>0){
            if(days/365>=1){
                return Math.floor(days/365)+"年前";
            }else{
                return days+"天前";
            }
        }else{
            if(hours>0){
                return hours+"小时前";
            }else{
                if(minutes<=3){
                    return "刚刚";
                }else{
                    return minutes+"分钟前";
                }
            }
        }

        return "刚刚";
    }

    function isMobile(){
        return (navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i))|| (navigator.userAgent.match(/Android/i));
    }
    function isIOS(){
        return (navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i));
    }
    function isAndroid(){
        return (navigator.userAgent.match(/Android/i));
    }
    function isInWeixn(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    function URLParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    function zero(value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };
    Utils.getTimeDistance=getTimeDistance;
    Utils.dateFormat=dateFormat;
    Utils.getURLParams=URLParams;
    Utils.zero=zero;
})();