define(function(require,exports,module){var dialogModuleView=new DialogModuleView(),dialogModuleLogic=new DialogModuleLogic(dialogModuleView),fistPopDialog=true;function moduleLogic(){var that=this;this.selectedObj={};this.extendInfo={};this.wifiObj={};this.init=function(){that.getData();that.initEvent();dialogModuleLogic.initEvent()};this.getData=function(){that.getConnectInfo();that.getScanResult()};this.getConnectInfo=function(){var queryData={random:Math.random(),module1:"connectInfo"};clearInterval(that.timer);that.timer=null;$(".main-footer button").addClass("none");$.GetSetData.setData("goform/getWifiRelay",queryData,function(obj){var seconds=1,connectTime;that.extendInfo=$.parseJSON(obj).connectInfo;if($.parseJSON(obj).timeout){return}connectTime=parseDecimalInt(that.extendInfo.connectDuration);$("#upperWifiSsid").text(that.extendInfo.upperWifiSsid);$("#connectState").html(showConnectStatus(that.extendInfo.connectState));if(that.extendInfo.connectState==="2"){$("#connectDuration").html(formatSeconds(connectTime));that.timer=setInterval(function(){$("#connectDuration").html(formatSeconds(connectTime+seconds));seconds++},1000)}else{$("#connectDuration").html("")}})};this.getScanResult=function(){var scanResult,seconds=1;var queryData={random:Math.random(),module1:"wifiScan"};$("#wifiScan").prev().addClass("invisible");$("#refreshTable").addClass("none");$("#loading").removeClass("none");$("#wifiScanTbody").html("");$.GetSetData.setData("goform/getWifiRelay",queryData,function(obj){$("#loading").addClass("none");$("#refreshTable").removeClass("none");$("#wifiScan").prev().removeClass("invisible");var timeoutStr='<tr><td colspan="3" class="text-danger">'+_("SSID Scanning timed out!")+"</td></tr>";try{scanResult=$.parseJSON(obj).wifiScan;var len=scanResult.length}catch(e){$("#wifiScanTbody").html(timeoutStr);return}if($.parseJSON(obj).timeout){$("#wifiScanTbody").html(timeoutStr);return}that.wifiObj=scanResult;createTable(scanResult);top.pageLogic.initModuleHeight()})};this.initEvent=function(){$("#refreshTable").on("click",that.getScanResult);$("#wifiScan").delegate('input[type="radio"]',"click",popExtendDialog)};function showConnectStatus(status){var str="",stArr=[_("Disconnected"),_("Extended Successfully"),_("Password Error")];status=+status;if(status===1){str="text-primary"}else{if(status===2){str="text-success"}else{str="text-danger"}}$("#connectState").attr("class","form-control-static").addClass(str).html(stArr[status-1])}function createTable(obj){var tableStr="";var listObj=obj.sort(function(a,b){if(parseDecimalInt(a.wifiScanSignalStrength)>parseDecimalInt(b.wifiScanSignalStrength)){return -1}else{return 1}});var trBackColor="";for(var i=0,l=listObj.length;i<l;i++){if(i%2==0){trBackColor="bk-white"}else{trBackColor="bk-gray"}tableStr+='<tr class="'+trBackColor+'" index="'+i+'"><td style="width: 20%"><input type="radio" name="wifiSelect"/></td>';tableStr+='<td style="width: 30%" class="fixed" titile="'+escapeText(listObj[i].wifiScanSSID)+'">'+escapeText(listObj[i].wifiScanSSID)+"</td>";signal=parseDecimalInt(listObj[i].wifiScanSignalStrength);if(signal>=-45){signal="signal-4"}else{if(signal<-45&&signal>=-60){signal="signal-3"}else{if(signal<-60&&signal>=-74){signal="signal-2"}else{signal="signal-1"}}}tableStr+='<td style="width: 25%;text-align:right;padding-right:10px;"><span class="'+signal+' scan-icon"></span>';if(listObj[i].wifiScanSecurityMode!=="NONE"){tableStr+='<span class="icon-lock scan-icon"><input type="hidden" value='+listObj[i].wifiScanSecurityMode+'><input type="hidden" value='+listObj[i].wifiScanChannel+"></span>"}else{tableStr+='<span><input type="hidden" value="NONE"/></span>'}tableStr+="</td></tr>"}$("#wifiScanTbody").append(tableStr)}function popExtendDialog(){var selectedIndex,ssid,signal,securityMode;selectedIndex=$(this).parents("tr").attr("index");that.selectedObj=that.wifiObj[selectedIndex];signal=that.selectedObj.wifiScanSignalStrength;if(that.selectedObj.wifiScanSecurityMode==="UNKNOW"){top.pageLogic.showModuleMsg(_("The encryption of the base station is WEP. The extender doesn't support this encryption (WEP)."));return}if(parseDecimalInt(signal)<-72){top.pageLogic.showModuleMsg(_("The selected WiFi signal is weak. For stable connection, move the extender close to the wireless router or access point."))}showDialog("re-extend-wrapper","","300");dialogModuleView.initHtml();reInitDialogHeight("re-extend-wrapper")}function parseDecimalInt(num){return parseInt(num,10)}function formatSeconds(value){var result="",second=parseDecimalInt(value),minute=0,hour=0,day=0;if(second>60){minute=parseDecimalInt(second/60);second=parseDecimalInt(second%60);if(minute>60){hour=parseDecimalInt(minute/60);minute=parseDecimalInt(minute%60);if(hour>24){day=parseDecimalInt(hour/24);hour=parseDecimalInt(hour%24)}}}result=""+parseDecimalInt(second)+_("s");if(minute>0){result=""+parseDecimalInt(minute)+_("min")+" "+result}if(hour>0){result=""+parseDecimalInt(hour)+_("h")+" "+result}if(day>0){result=""+parseDecimalInt(day)+_("day")+" "+result}return result}}function DialogModuleLogic(view){var that=this;this.initEvent=function(){$("#ok").on("click",function(){view.validate.checkAll()});$(".iframe-close").on("click",function(){closeIframe("re-extend-wrapper")});$("#keepUpper").on("click",view.checkKeepUppserStauts);var newInput,$ele=$("#extenderPwd");if(isSupChangeType($ele)){$("#iconContainer").on("click",".icon-show",function(){$(this).removeClass("icon-show").addClass("icon-hide");$ele.attr("type","text")});$("#iconContainer").on("click",".icon-hide",function(){$(this).removeClass("icon-hide").addClass("icon-show");$ele.attr("type","password")})}else{}var newInput1,$ele1=$("#wifiPwd");if(isSupChangeType($ele)){$("#wifiPwdCon").on("click",".icon-show",function(){$(this).removeClass("icon-show").addClass("icon-hide");$ele1.attr("type","text")});$("#wifiPwdCon").on("click",".icon-hide",function(){$(this).removeClass("icon-hide").addClass("icon-show");$ele1.attr("type","password")})}else{}$("#wifiPwd").initPassword(_("Enter the WiFi password of the Base Station"))}}function DialogModuleView(){var selectedObj;var extendInfo;var that=this;this.initHtml=function(obj){selectedObj=pageLogic.modules.selectedObj;extendInfo=pageLogic.modules.extendInfo;var securityMode=selectedObj.wifiScanSecurityMode,defaultExtendSsid=extendInfo.extenderSsid||selectedObj.wifiScanSSID;$("#extenderName").val(extendInfo.extenderSsid);$("#extenderPwd").val(extendInfo.extenderPwd);$("#details").removeClass("none");$("#doneWrap, #extenderInfo").addClass("none");$("#keepUpper").prop("checked",true);if(securityMode==="NONE"){$("#wifiPwdCon").addClass("none")}else{$("#wifiPwdCon").removeClass("none");$("#wifiPwd").val("").attr({disabled:false})}$("#wifiPwd_").parent().find(".placeholder-text").css("width","285px");$("#wifiName").text(selectedObj.wifiScanSSID);if(!$("#extenderPwd").hasClass("placeholder-text")){$("#extenderName").addPlaceholder(_("WiFi Name of the Extender"));$("#extenderPwd").initPassword(_("WiFi Password of the Extender"))}};this.checkKeepUppserStauts=function(){var selected=$("#keepUpper").prop("checked");if(selected){$("#extenderInfo").addClass("none")}else{$("#extenderInfo").removeClass("none")}reInitDialogHeight("re-extend-wrapper")};function checkWifiData(){return""}this.validate=$.validate({custom:function(){},success:function(){var msg;msg=checkWifiData();if(msg){alert(msg);return}$("#extendStatus").html(_("Extending…Please wait..."));$("#details, #savedWrap, #nameModified").addClass("none");$("#doneWrap, #savingWrap").removeClass("none");that.preSubmit()},error:function(msg){}});this.preSubmit=function(){selectedObj=pageLogic.modules.selectedObj;var checked=$("#keepUpper").prop("checked");var data={module1:"setExtenderWifi",wifiRelaySSID:$("#wifiName").text()||"",wifiRelaySecurityMode:selectedObj.wifiScanSecurityMode||"",wifiRelayPwd:$("#wifiPwd").val()||"",wifiRelayChannel:selectedObj.wifiScanChannel||"",wizardSSID:checked?($("#wifiName").text()||""):($("#extenderName").val()||""),wizardSSIDPwd:checked?($("#wifiPwd").val()||""):($("#extenderPwd").val()||"")};var subStr=objToString(data);$.post("goform/setWifiRelay",subStr,function(str){var num=$.parseJSON(str).errCode;if(num=="0"){endSetup()}})}}function isSupChangeType(passwordElem){try{passwordElem.attr("type","text");if(passwordElem.attr("type")==="text"){passwordElem.attr("type","password");return true}}catch(d){return false}}function endSetup(){var checkBridgeT=null,timer=0,bridgeReturnFlag=false;var ssidVal=$("#keepUpper")[0].checked?($("#wifiName").text()||""):($("#extenderName").val()||"");checkBridgeT=setInterval(function(){if(timer>(30000/500)){clearInterval(checkBridgeT);if(bridgeReturnFlag){$("#extendStatus").html(_("Timed Out! Please extend again!"));closeDialog()}else{$("#savingWrap").addClass("none");$("#savedWrap").removeClass("none");$("#nameModified").removeClass("none").html(_("The WiFi name of the extender is changed into %s, please connect again.",[ssidVal]))}}else{timer++}bridgeReturnFlag=false;$.GetSetData.getJson("goform/getStatusBeforeBridge",function(data){bridgeReturnFlag=true;if(data.extended==="0"){clearInterval(checkBridgeT);$("#extendStatus").html(_("Failed to extend. Please extend again!"));closeDialog()}else{if(data.extended==="1"){clearInterval(checkBridgeT);$("#savingWrap").addClass("none");$("#savedWrap").removeClass("none");$("#nameModified").removeClass("none").html(_("The WiFi name of the extender is changed into %s, please connect again.",[ssidVal]))}}})},500)}function closeDialog(){setTimeout(function(){top.closeIframe("re-extend-wrapper");top.pageLogic.modules.getData()},2000)}module.exports=new moduleLogic()});