let attachmentsComposerActions = null;

export function getAttachmentsComposerExtensions() {
  if(attachmentsComposerActions == null) {
    const allExtensions = extensionRegistry.loadExtensions("webConferencing", "webconferencing")
    attachmentsComposerActions = allExtensions.filter(extension => isExtensionEnabled(extension));
  }

  return attachmentsComposerActions;
}

function isExtensionEnabled(extension) {
  if(extension.hasOwnProperty("enabled")) {
    if(typeof extension.enabled === "boolean") {
      return extension.enabled;
    } else if(isFunction(extension.enabled)) {
      return extension.enabled.call();
    }
  }

  return true;
}

function isFunction(object) {
  return object && {}.toString.call(object) === "[object Function]";
}