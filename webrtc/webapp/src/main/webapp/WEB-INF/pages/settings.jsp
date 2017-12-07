<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Map"%>

<%
  Map<String, String> messages = (Map<String, String>) request.getAttribute("messages");
	messages.toString();
%>

<div class="uiPopup settingsForm">
	<div class="popupHeader ClearFix">
		<a aria-hidden="true" class="uiIconClose pull-right">&nbsp;</a> <span class="PopupTitle popupTitle">${messages["webrtc.admin.title"]}</span>
	</div>

	<div class="popupContent">
		<p class="title">
			${messages["webrtc.admin.servers"]}&nbsp;&nbsp;<i class="uiIconInformation uiIconBlue" data-placement="top" data-toggle="tooltip"
				title="${messages["webrtc.admin.serversTip"]}"></i>
		</p>

		<div class="iceServers">
			<div class="control-group iceServer" style="display: none;">
				<label class="control-label" for="url">${messages["webrtc.admin.url"]} :</label>
				<div class="control-group urlsGroup">
					<div class="urlGroup">
						<input name="url" placeholder="${messages["webrtc.admin.serverUrl"]}" type="text" />
						<div class="actions-container">
							<i class="uiIconTrash uiIconLightGray" data-placement="top" data-toggle="tooltip" title="Remove server"></i>
							<i class="uiIconPlus uiIconLightGray" data-placement="top" data-toggle="tooltip" title="Add a new server"></i>
						</div>
					</div>
					<div class="credentialsGroup">
						<div class="enabler">
							<div class="control-group">
								<span class="uiCheckbox">
									<input type="checkbox" class="checkbox">
									<span>${messages["webrtc.admin.credential"]}</span>
								</span>
							</div>
						</div>
						<div class="credentials" style="display: none;">
							<div class="control-group">
								<label class="control-label" for="username">${messages["webrtc.admin.username"]}</label>
								<div class="controls">
									<input name="username" type="text" placeholder="${messages["webrtc.admin.username"]}...">
								</div>
							</div>
							<div class="control-group">
								<label class="control-label" for="credential">${messages["webrtc.admin.credential"]}</label>
								<div class="controls">
									<input name="credential" type="text" placeholder="${messages["webrtc.admin.credential"]}...">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="uiAction">
			<button class="btn saveButton" type="button">${messages["webrtc.admin.save"]}</button>
			<button class="btn cancelButton" type="button">${messages["webrtc.admin.cancel"]}</button>
		</div>

	</div>
</div>

<%-- Confirmation popup --%>
<div class="uiPopup serverRemovalDialog">
	<div class="popupHeader ClearFix">
		<a class="uiIconClose pull-right" aria-hidden="true"></a>
		<span class="PopupTitle popupTitle">${messages["webrtc.admin.confirmServerRemoval"]}</span>
	</div>
	<div class="popupContent">
		<ul class="singleMessage popupMessage">
            <li>
                <span class="confirmationIcon contentMessage">${messages["webrtc.admin.serverRemoveText"]}</span>
            </li>
        </ul>
		<div class="uiAction uiActionBorder">
			<button class="btn removeButton" type="button">${messages["webrtc.admin.remove"]}</button>
			<button class="btn cancelButton" type="button">${messages["webrtc.admin.cancel"]}</button>
		</div>
	</div>
</div>
