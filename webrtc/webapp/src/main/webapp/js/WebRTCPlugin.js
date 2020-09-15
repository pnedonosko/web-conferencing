console.log("startWebrtc")
const WebRTCPlugin = [{
    key: "WebRTC",
    rank: 20,
    iconName: "uiIconSetting",
    appClass: "WebRTC",
    component: {
      name: "WebRTC",
      events: [],
    },
    enabled: true,
    onExecute(WebRTCComponent) {
      WebRTCComponent.showWebRTC = true
    }
}];
console.log("extension webrtc")
require(["SHARED/extensionRegistry", "SHARED/webConferencing"], function(extensionRegistry, webConferencing) {
    console.log("extension 2webrtc")
    webConferencing.init()
    for (const extension of WebRTCPlugin) {
        extensionRegistry.registerExtension("webConferencing", "webconferencing", extension)
    }
    console.log(extensionRegistry.loadExtensions("webConferencing", "webconferencing"), "extension in pluginwebrtc")

})