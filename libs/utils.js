function getKST(){
        var now = new Date();
        now = now.setHours(new Date().getHours() + 9);
        now = (new Date(now)).toISOString().replace(/\.[\d]{3}Z$/, 'Z ');
        return now;
}

function getUrl(url, req){
      var lang = req.cookies.lang;
      if(lang == 'zh' || lang == undefined || lang == null || lang == '')
          return __dirname + url;
      else return __dirname + "/" + lang + url;
}

exports.getKST = getKST;
exports.getUrl = getUrl;