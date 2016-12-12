var maxBlackNum=10;define(function(require,exports,module){var preDialog="online-list-wrapper";var blacklistModuleLogic=new BlacklistModuleLogic(),onlinelistModuleLogic=new OnlinelistModuleLogic();var statusTimer=null;function ModuleLogic(){var that=this;this.pageRunning=true;this.closeNotify=false;this.init=function(){this.pageRunning=true;this.initEvent();this.getValue("goform/getStatus",{module1:"sysStatusInfo"});blacklistModuleLogic.initEvent();onlinelistModuleLogic.initEvent()};this.getValue=function(url,requireObj){$.GetSetData.setData(url,$.extend({random:Math.random()},requireObj),function(obj){var jsonObj=$.parseJSON(obj);that.initValue(jsonObj)})};this.initEvent=function(){$(".iframe-close").on("click",function(){closeIframe(preDialog)});$("#onlineList").on("click",function(){preDialog="online-list-wrapper";showDialog("online-list-wrapper","",490);$("#online-list-wrapper .head_title").html(_("Attached Device (%s)",[that.data.statusOnlineNumber]));onlinelistModuleLogic.getValue()});$("#blackList").on("click",function(){preDialog="black-list-wrapper";showDialog("black-list-wrapper","",490);$("#black-list-wrapper .head_title").html(_("Blacklist (%s)",[that.data.statusBlackNum]));blacklistModuleLogic.getValue()});$(".close-notify").on("click",function(){$("#notify").addClass("none");moduleLogic.closeNotify=true});$("#notify a").on("click",function(){$("#system").trigger("click")})};this.initValue=function(obj){clearTimeout(statusTimer);statusTimer=setTimeout(function(){that.getValue("goform/getStatus",{module1:"sysStatusInfo"})},5000);if(!that.pageRunning){clearTimeout(statusTimer);return}that.data=obj.sysStatusInfo;inputValue(that.data);var signal=parseInt(that.data.wifiRate,10);if(signal>=-45){signal="4"}else{if(signal<-45&&signal>=-60){signal="3"}else{if(signal<-60&&signal>=-74){signal="2"}else{signal="1"}}}$("#failFlag").addClass("none");if(that.data.extended==="0"){signal="0";$("#failFlag").removeClass("none");$(".icon-dot").addClass("text-fail")}else{$(".icon-dot").removeClass("text-fail")}$("#signal").attr({src:"/img/level"+signal+".png",title:_("WiFi Signal Strength")+"："+translateSignal(that.data.wifiRate)});if(that.data.hasLoginPwd==="false"&&(!moduleLogic.closeNotify)){$("#notify").removeClass("none")}else{$("#notify").addClass("none")}top.pageLogic.initModuleHeight()};this.checkData=function(){return};this.reCancel=function(){that.initValue(that.data)};this.validate=$.validate({custom:function(){var msg=that.checkData();if(msg){return msg}},success:function(){return},error:function(msg){if(msg){top.pageLogic.showModuleMsg(msg)}}})}function translateSignal(signal){var newPer=0;if(signal==0){signal=-1}signal=Number(signal)||-100;if(signal>=0){newPer="100%"}else{if(signal>=-45){newPer=80+Math.round((45+signal)*(20/45))+"%"}else{if(signal>=-60){newPer=40+Math.round((60+signal)*(40/14))+"%"}else{if(signal>-75){newPer=1+Math.round((74+signal)*(40/13))+"%"}else{newPer="0%"}}}}return newPer}function BlacklistModuleLogic(){var that=this;this.initEvent=function(){$("#list").delegate(".del","click",function(){var mac=$(this).parents("tr").find("td").eq(1).attr("title");delList(mac)})};this.getValue=function(){$.GetSetData.setData("goform/getUserList",{random:Math.random(),module1:"blackList"},function(res){that.initHtml(res)})};this.initHtml=function(res){var listObj=$.parseJSON(res);var blackList=listObj.blackList,str="",len=blackList.length;if(len!=0){for(var i=0;i<len;i++){str+="<tr class='tr-row'><td title='"+blackList[i].devName+"' class='fixed'>"+blackList[i].devName+"</td><td title='"+blackList[i].devMac+"' class='hidden-xs'>"+blackList[i].devMac.toUpperCase()+"</td><td><input type='button' class='btn del btn-primary' value='"+_("Remove")+"'></td></tr>"}}else{str="<tr><td colspan=3 >"+_("The Blacklist is empty")+"</td></tr>"}if(str==""){str="<tr><td colspan=3 >"+_("The Blacklist is empty")+"</td></tr>"}$("#list").html(str);reInitDialogHeight("black-list-wrapper")};function delList(mac){$.post("goform/setUserList",{module1:"delFromBlackList",mac:mac},function(str){var num=$.parseJSON(str).errCode;if(num==0){closeIframe(preDialog);top.pageLogic.modules.getValue();top.pageLogic.showModuleMsg(_("Removing from the Blacklist"),2000)}})}}function OnlinelistModuleLogic(){var that=this;this.blackNum=0;this.initEvent=function(){$("#onlinelist").delegate(".del","click",function(){var mac=$(this).parents("tr").attr("alt");delOnlineList(mac,that.blackNum)})};this.getValue=function(){$.GetSetData.setData("goform/getUserList",{random:Math.random(),module1:"onlineList"},that.initHtml)};this.initHtml=function(obj){obj=$.parseJSON(obj);var htmlStr="",initObj;initObj=obj.onlineList;that.blackNum=initObj[0].blackNum;if(initObj.length>1){for(var i=1;i<initObj.length;i++){htmlStr+="<tr alt='"+initObj[i].devMac+"' class='tr-row'><td title='"+initObj[i].devName+"' class='fixed'>"+initObj[i].devName+"</td><td  class='hidden-xs'>"+initObj[i].devIp+"</td><td class='hidden-xs'>"+initObj[i].devMac.toUpperCase()+"</td><td><input type='button' class='btn del btn-primary' value='"+_("Add")+"'></td></tr>"}}else{htmlStr="<tr><td colspan=5 >"+_("No Attached Device")+"</td></tr>"}if(htmlStr==""){htmlStr="<tr><td colspan=5 >"+_("No Attached Device")+"</td></tr>"}$("#onlinelist").html(htmlStr);reInitDialogHeight("online-list-wrapper")};function delOnlineList(mac,blacknum){if(blacknum>=maxBlackNum){alert(_("The total devices in Blacklist should be within %s.",[maxBlackNum]));return}$.post("goform/setUserList",{module1:"addToBlackList",mac:mac},function(str){var num=$.parseJSON(str).errCode;if(num==0){closeIframe(preDialog);top.pageLogic.modules.getValue();top.pageLogic.showModuleMsg(_("Adding to the Blacklist"),2000)}else{if(num==1){top.pageLogic.showModuleMsg(_("The total devices in Blacklist should be within %s.",[maxBlackNum]));return}}})}}var moduleLogic=new ModuleLogic();module.exports=moduleLogic});