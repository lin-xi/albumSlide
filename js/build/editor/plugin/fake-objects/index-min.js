/*
Copyright 2013, KISSY UI Library v1.30
MIT Licensed
build time: Jan 17 14:28
*/
KISSY.add("editor/plugin/fake-objects/index",function(d,j){var h=d.Node,m=d.DOM,n=j.Utils.debugUrl("theme/spacer.gif"),l=d.require("htmlparser");d.augment(j,{createFakeElement:function(a,b,c,e,o,k){var f=a.attr("style")||"";a.attr("width")&&(f="width:"+a.attr("width")+"px;"+f);a.attr("height")&&(f="height:"+a.attr("height")+"px;"+f);var g=d.trim(a.attr("class")),a={"class":b+" "+g,src:n,_ke_realelement:encodeURIComponent(o||a._4e_outerHtml(void 0)),_ke_real_node_type:a[0].nodeType,style:f};k&&(delete k.width,
delete k.height,d.mix(a,k,!1));c&&(a._ke_real_element_type=c);e&&(a._ke_resizable=e);return new h("<img/>",a,this.get("document")[0])},restoreRealElement:function(a){if(a.attr("_ke_real_node_type")!=m.NodeType.ELEMENT_NODE)return null;var a=d.urlDecode(a.attr("_ke_realelement")),b=new h("<div>",null,this.get("document")[0]);b.html(a);return b.first().remove()}});var p={tags:{$:function(a){var b=a.getAttribute("_ke_realelement"),c;b&&(c=(new l.Parser(d.urlDecode(b))).parse());if(b=c&&c.childNodes[0]){if(c=
a.getAttribute("style")){var e=/(?:^|\s)width\s*:\s*(\d+)/i.exec(c),a=e&&e[1];c=(e=/(?:^|\s)height\s*:\s*(\d+)/i.exec(c))&&e[1];a&&b.setAttribute("width",a);c&&b.setAttribute("height",c)}return b}}}};return{init:function(a){var b=a.htmlDataProcessor,c=b&&b.htmlFilter;b.createFakeParserElement||(c&&c.addRules(p),d.mix(b,{restoreRealElement:function(e){if(e.attr("_ke_real_node_type")!=m.NodeType.ELEMENT_NODE)return null;var e=d.urlDecode(e.attr("_ke_realelement")),b=new h("<div>",null,a.get("document")[0]);
b.html(e);return b.first().remove()},createFakeParserElement:function(a,b,c,f,g){var h=l.serialize(a),i=a.getAttribute("style")||"";a.getAttribute("width")&&(i="width:"+a.getAttribute("width")+"px;"+i);a.getAttribute("height")&&(i="height:"+a.getAttribute("height")+"px;"+i);var j=d.trim(a.getAttribute("class")),a={"class":b+" "+j,src:n,_ke_realelement:encodeURIComponent(h),_ke_real_node_type:a.nodeType+"",style:i,align:a.getAttribute("align")||""};g&&(delete g.width,delete g.height,d.mix(a,g,!1));
c&&(a._ke_real_element_type=c);f&&(a._ke_resizable="_ke_resizable");return new l.Tag("img",a)}}))}}},{requires:["editor"]});
