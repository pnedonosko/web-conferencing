let attachmentsProviderPreferences = null;

export function getAttachmentsProvidersSettings() {
  if(attachmentsProviderPreferences == null) {
    const allExtensions = extensionRegistry.loadExtensions("webConferencing", "webconferencing")
    attachmentsProviderPreferences = allExtensions.filter(extension => isExtensionEnabled(extension));
  }

  return attachmentsProviderPreferences;
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