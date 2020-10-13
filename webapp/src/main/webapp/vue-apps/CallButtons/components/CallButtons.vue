<template>
  <div id="call-button-container" ref="callbutton">
    <dropdown
      v-if="providersButton.length > 1"
      :providersbutton="providersButton"
      :isopen="isOpen"
      :createbuttons="createButtons"
      :placeholder="placeholder"
      @getRefs="getRef($event)"
      @openDropdown="openDropdown($event)"/>
  </div>
</template>

<script>
import dropdown from "./Dropdown.vue";
let vm = null;
let ref;

export default {
  components: {
    dropdown
  },
  props: {
    services: {
      type: Object,
      required: true
    },
    i18n: {
      type: Object,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    resourceBundleName: {
      type: String,
      required: true
    },
    targetExtensionPoint: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      callContext: null,
      localCallContext: null, // the context from events
      providers: [],
      providersButton: [],
      error: null,
      placeholder: "Start call",
      isOpen: false,
      childRef: null,
      providersTypes: []
    };
  },
  created() {
    this.log = webConferencing.getLog("webconferencing-call-buttons");
    this.log.trace(`targetExtensionPoint: ${this.targetExtensionPoint}`);

    switch (this.targetExtensionPoint) {
      case "mini-chat":
        this.log.trace("Mini-chat mounting preparation");
        this.initMiniChatContactHandler();
        break;
      case "popover":
        this.log.trace("Popover mounting preparation");
        break;
      case "contact-user-profile":
        this.log.trace("Contact user profile mounting preparation");
        break;
    }
  },
  async beforeMount() {
    const thevue = this;
    this.log.trace(`targetExtensionPoint mount: ${this.$props.targetExtensionPoint}`);

    switch (this.targetExtensionPoint) {
      case "chat":
        this.log.trace("Chat mounting preparation");
        await this.initContext();
        this.initButtons(this.callContext);
        break;
      case "space":
        this.log.trace("Space mounting preparation");
        await this.initContext();
        this.initButtons(this.callContext);
        break;
      case "user-profile":
        this.log.trace("User profile mounting preparation");
        await this.initContext();
        this.initButtons(this.callContext);
        break;
    }
  },
  methods: {
    async initContext() {
      const thevue = this;

      try {
        const response = await webConferencing.getProvidersConfig();
        this.providersTypes = response.map(provider => provider.type);
        const context = await webConferencing.getCallContext();
        thevue.callContext = context;
        this.log.trace("CallButtons context is initialized");
      } catch (err) {
        this.log.error("Error getting call context", err);
      }
    },
    async initButtons(context) {
      if (context) {
        try {
          // const p = await webConferencing.getProvider("jitsi");
          // this.providers.push(p);
          await Promise.all(
            this.providersTypes.map(async type => {
              const p = await webConferencing.getProvider(type);
              this.providers.push(p);
            })
          );
          await this.initProvidersButton(context);
          this.createButtons();
          this.log.trace("CallButtons are initialized");
        } catch (err) {
          this.log.error("jitsi error", err);
        }
      }
    },
    async initProvidersButton(context) {
      const thevue = this;
      await Promise.all(
        thevue.providers.map(async p => {
          if (await p.isInitialized) {
            const callButton = await p.callButton(this.callContext, "vue");
            thevue.providersButton.push(callButton);
          }
        })
      );
    },
    createButtons() {
      if (this.providersButton.length) {
        for (const [index, pb] of this.providersButton.entries()) {
          if (this.providersButton.length > 1) {
            //add buttons to dropdown coomponent
            if (this.isOpen) {
              ref = this.childRef.callbutton[index];
              // add vue button
              if (pb instanceof Vue) {
                vm = pb.$mount();
                ref.appendChild(vm.$el);
              } else {
                // add button from DOM Element
                ref.appendChild(pb.get(0));
              }
            }
          } else {
            //add a single button
            const callButton = this.$refs.callbutton;
            callButton.classList.add("single");
            if (pb instanceof Vue) {
              // add vue button
              vm = pb.$mount();
              callButton.appendChild(vm.$el);
            } else {
              // add button from DOM Element
              callButton.appendChild(pb.get(0));
            }
          }
        }
      }
    },
    openDropdown() {
      this.isOpen = !this.isOpen;
    },
    getRef(ref) {
      // console.log(ref);
      this.childRef = ref;
    },
    // handle opening mini-chat contacts
    initMiniChatContactHandler() {
      const thevue = this;
      const EVENT_ROOM_SELECTION_CHANGED = "exo-chat-selected-contact-changed";
      // Handle an event when select other contacts in chat
      document.addEventListener(EVENT_ROOM_SELECTION_CHANGED, async function (target) {
        if (target && target.detail) {
          if (webConferencing) {
            const callButtonContext = await webConferencing.getCallContext();

            if (callButtonContext) {
              thevue.log.trace(`Selected the ${target.detail.user} contact in mini-chat`);

              const roomId = target.detail.user;
              const roomTitle = target.detail.fullName;
              const isSpace = target.detail.type === "s"; // roomId && roomId.startsWith("space-");
              const isRoom = target.detail.type === "t"; // roomId && roomId.startsWith("team-");
              const isGroup = isSpace || isRoom;
              const isUser = !isGroup && target.detail.type === "u";

              // It is a logic used in Chat, so reuse it here:
              const roomName = roomTitle.toLowerCase().split(" ").join("_");

              callButtonContext.roomId = roomId;
              callButtonContext.roomName = roomName; // has no sense for team rooms, but for spaces it's pretty_name
              callButtonContext.roomTitle = roomTitle;
              callButtonContext.isGroup = isGroup;
              callButtonContext.isSpace = isSpace;
              callButtonContext.isRoom = isRoom;
              callButtonContext.isUser = isUser;
              callButtonContext.participants = target.detail.participants;

              callButtonContext.details = function () {
                const data = $.Deferred();
                if (isGroup) {
                  if (isSpace) {
                    const spaceId = roomName; // XXX no other way within Chat
                    webConferencing.getSpaceInfo(spaceId).done(function (space) {
                      data.resolve(space);
                    }).fail(function (err) {
                      thevue.log.trace(`Error getting space info ${spaceId} for mini-chat context`, err);
                      data.reject(err);
                    });
                  } else if (isRoom) {
                    if (this.participants) {
                      const unames = [];
                      for (let i = 0; i < this.participants.length; i++) {
                        const u = this.participants[i];
                        if (u && u.name && u.name !== "null") {
                          unames.push(u.name);
                        }
                      }
                      webConferencing.getRoomInfo(roomId, roomTitle, unames).done(function (info) {
                        data.resolve(info);
                      }).fail(function (err) {
                        thevue.log.trace(`Error getting Mini-chat room info ${roomName}/${roomId} for mini-chat context`, err);
                        data.reject(err);
                      });
                    } else {
                      thevue.log.trace(`Error getting Mini-chat room users for ${roomId}`);
                      data.reject(`Error reading Mini-chat room users for ${roomId}`);
                    }
                  } else {
                    data.reject(`Unexpected context mini-chat type for ${roomTitle}`);
                  }
                } else {
                  // roomId is an user name for P2P chats
                  webConferencing.getUserInfo(roomId).done(function (user) {
                    data.resolve(user);
                  }).fail(function (err) {
                    thevue.log.trace(`Error getting user info ${roomId} for mini-chat context`, err);
                    data.reject(err);
                  });
                }
                return data.promise();
              }

              thevue.localCallContext = callButtonContext;
              thevue.initButtons(callButtonContext);
            }
          }
        } else {
          thevue.log.warn("No details provided for Mini-chat room");
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../../skin/less/variables.less";

.VuetifyApp {
  #call-button-container {
    button {
      .v-btn__content {
        letter-spacing: 0.1px;
      }
    }
    &.single {
      width: @width - 14px;
      height: 36px;
      left: @width + 60px;
      border: 1px solid rgb(232, 238, 242);
      border-radius: 3px;
      padding: 0 10px;
      &:hover {
        background-color: @primaryColor;
        opacity: 1;
      }
    }
    a:hover,
    button:hover {
      i {
        color: white;
      }
      span {
        color: white;
      }
    }
    cursor: pointer !important;
    position: absolute;
    left: @width + 40px;
    top: 2px;
    width: @width + 20px;
    [class^="uiIcon"] {
      font-size: 12px;
    }
  }
  a,
  a:hover,
  a:focus {
    color: unset;
  }
  #call-button-container.single:hover,
  [id^="call-button-container-"]:hover,
  button:hover {
    i {
      color: white;
    }
    span {
      color: white;
    }
  }
  .room-actions-container {
    [class^="uiIcon"] {
      &.callButtonIconVideo {
        top: 6px;
      }
      &:before {
        color: unset;
        height: 16px;
        width: 16px;
        margin-right: 4px;
      }
    }
    // .room-action-menu {
    //   .room-action-component {
    //     .webConferencingCallButtonAction {
    //       // #call-button-container.single:hover,
    //       // [id^="call-button-container-"]:hover,
    //       // a:hover,
    //       // button:hover {
    //       //   i {
    //       //     color: white;
    //       //   }
    //       //   span {
    //       //     color: white;
    //       //   }
    //       // }
    //       // button {
    //       //   .v-btn__content {
    //       //     letter-spacing: 0.1px;
    //       //   }
    //       // }
    //     }
    //   }
    // }
  }
}
</style>