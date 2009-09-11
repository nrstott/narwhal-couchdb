function DesignDocument(fn){
    this.document = {
        views: {}
    };

    this.viewBy = function(stringOrObject){
        if (typeof stringOrObject == "string"){
            var strParts = stringOrObject.split("_");
            var viewByMembers = [];
            while (strParts.length > 0){
                var indexOfAnd = strParts.indexOf("and");
                if (indexOfAnd == -1)
                {
                    viewByMembers.push(strParts.join("_"));
                    strParts = [];
                }
                else {
                    var member = "";
                    for (var i=0;i<indexOfAnd;++i){
                        member += strParts.shift();
                    }
                    viewByMembers.push(member);
                    strParts.shift(); // remove the and
                }
            }

            var strView = "function(doc){";

            var isFirst = true;

            strView += "if(";
            viewByMembers.forEach(function(member) {
                if (!isFirst)
                    strView += " && ";
                else
                    isFirst = false;
                strView += "doc['" + member + "']";
            });
            strView += "){";

            if (viewByMembers.length == 1){
                strView += "emit(doc['" + viewByMembers[0] + "'],doc);";
            }else {
                isFirst = true;
                strView += "emit([";
                viewByMembers.forEach(function(member){
                    if (isFirst)
                        isFirst = false;
                    else
                        strView += ",";
                    strView += "doc['" + member.toString() + "']";
                });
                strView += "],doc);";
            }

            strView += "}}";

            this.document.views["by_" + stringOrObject] = {
                map: strView
            };
        } else {
            this.document.views[stringOrObject.name] = {
                "map": stringOrObject.map,
                "reduce": stringOrObject.reduce
            };
        }
    };

    this.id = function(id){
        if (!id.match(/^_design\/?/g)){
            id = "_design/" + id;
        }
        this.document._id = id;
    };

    if (fn instanceof Function){
        fn.call(this);
    }

    this.toDocument = function(){
        if (document._id == undefined) throw new Error("Id must be specified before toDocument is valid");

        return this.document;
    };
}

exports.create = function(id, fn){
    if (id == undefined || id == null)
        throw new Error("Argument 'id' is required");

    var designDoc = new DesignDocument(fn);
    designDoc.id(id);

    return designDoc;
};