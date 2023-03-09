import firebase from "db/firestore";
import React, { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Popup,
} from "semantic-ui-react";
import { convertFiles } from "utils/handleFiles";
import { styled } from "utils/styled-component";
import { createTimestamp } from "utils/time";
import { v4 as uuidv4 } from "uuid";

interface SendToMultipleChannelProps {
  onClose: () => void;
}

/**
 * Register Emoji for toolbar
 */
Quill.register(
  {
    "formats/emoji": quillEmoji.EmojiBlot,
    "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
    "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
    "modules/emoji-shortname": quillEmoji.ShortNameEmoji,
  },
  true
);

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */

const CustomToolbar = () => (
  <div id="toolbar">
    <button className="ql-image"></button>
    <button className="ql-emoji"></button>
    <button className="btn-hover mr-3">
      <div id="fileUpload">
        <label htmlFor="file-input">
          <span className="icon24 img-hover">
            <Icon name="file" size="small" color="brown" />
          </span>
          <span className="icon24 img-show">
            <Icon name="file" size="small" color="grey" />
          </span>
        </label>
        <input
          className="file-input"
          id="file-input"
          type="file"
          onChange={(e) => {
            // uploadChange(e);
            e.target.value = null;
          }}
        />
      </div>
    </button>
    <button className="ql-link"></button>
  </div>
);

function SendToMultipleChannel({ onClose }: SendToMultipleChannelProps) {
  const userRedux = useSelector(({ auth }) => auth.user);
  const [value, setValue] = useState<any>("");
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [channelsState, setChannelsState] = useState([]);
  const [listIdsChannel, setListIdsChannel] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const channelsRef = firebase.database().ref("channels");
  const messagesRef = firebase.database().ref("messages");
  const postsRef = firebase.database().ref("posts");

  let myuuid = uuidv4();

  const handleChangeValue = (e: any, data: any, chnl: any) => {
    if (data.checked) {
      setListIdsChannel((currentState: any) => {
        let updateState = [...currentState];
        updateState.push(chnl);
        // updateState.push(data.value);
        return updateState;
      });
    } else {
      const index = listIdsChannel.findIndex((chnl) => chnl?.id === data.value);
      listIdsChannel.splice(index, 1);
      setListIdsChannel(listIdsChannel);
    }
  };

  /**
   * Submit form data
   * @returns
   */
  const sendMessage = async () => {
    if (value.trim() === "") return;
    if (listIdsChannel?.length <= 0) {
      setIsOpenPopup(true);
    }
    const message: any = {
      idMessage: myuuid,
      content: value,
      user: userRedux,
      timestamp: createTimestamp(),
      files: selectedFile ? selectedFile : "",
      author: {
        username: userRedux?.userReduxId || userRedux.displayName,
        id: userRedux?.uid,
      },
      type: 2,
    };

    const newPost = { ...message };
    if (listIdsChannel?.length > 0) {
      listIdsChannel.forEach((chnl: any) => {
        message.channelId = chnl?.id;
        newPost.channel = chnl;
        postsRef.push().set(newPost);
        return messagesRef.child(chnl?.id).push().set(message);
      });
    }
    setValue("");
    onClose();
  };

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        // emoji: () => console.log("emoji"),
        // insertStar: insertStar,
        // image: insertImage,
      },
    },
    "emoji-toolbar": true,
    "emoji-textarea": true,
    "emoji-shortname": true,
  };

  const formats = ["link", "image", "emoji"];

  useEffect(() => {
    channelsRef.on("child_added", (snap) => {
      setChannelsState((currentState) => {
        let updatedState = [...currentState];
        updatedState.push(snap.val());
        return updatedState;
      });
    });

    return () => channelsRef.off();
  }, []);

  console.log("listIdsChannel", listIdsChannel);
  console.log("listIdsChannel length", listIdsChannel.length);

  return (
    <SendToMultipleChannelStyled>
      <div className="toolbar-options">
        <CustomToolbar />
      </div>

      <ReactQuill
        id="text-area"
        theme="snow"
        value={value}
        onChange={(content, delta, source, editor) => {
          setValue(content);
          setSelectedFile(
            editor.getContents()?.ops.filter((op) => op?.insert?.image)[0]
              ?.insert.image
          );
        }}
        modules={modules}
        formats={formats}
      />
      <div className="send-to-multiple-channel">
        <Header>Send to multiple channels</Header>
        <div className="send-to-multiple-channel__channels">
          <ul>
            {channelsState?.length > 0 &&
              channelsState
                .filter((c: any) => c.room_name)
                .map((chnl: any) => {
                  return (
                    <li key={chnl?.id}>
                      <span>{chnl?.room_name}</span>
                      <Checkbox
                        toggle
                        value={chnl?.id}
                        onChange={(e: any, data: any) =>
                          handleChangeValue(e, data, chnl)
                        }
                      />
                    </li>
                  );
                })}
          </ul>
        </div>
      </div>
      <Modal.Actions>
        <Button color="black" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          content="Send"
          labelPosition="right"
          icon="checkmark"
          onClick={() => {
            sendMessage();
          }}
          positive
        />
      </Modal.Actions>

      <Modal
        centered={true}
        onClose={() => setIsOpenPopup(false)}
        onOpen={() => setIsOpenPopup(true)}
        open={isOpenPopup}
        size="small"
        className="send-channel-fail-modal"
      >
        <Header>Wait a minutes!</Header>
        <Modal.Content>
          <p>Please choose at least a channel</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={() => setIsOpenPopup(false)}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </SendToMultipleChannelStyled>
  );
}

const SendToMultipleChannelStyled = styled.div`
  .send-to-multiple-channel__channels {
    ul {
      padding: 0 5px;
      list-style: none;
      max-height: 200px;
      overflow-y: auto;

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .chat-input__options {
    padding: 16px;
    display: flex;
    justify-content: space-between;

    &__left {
      width: 100%;
      border-right: 1px solid #e2e2e2;
    }

    button {
      background: none;
      border: none;
    }
  }

  #fileUpload > label {
    margin: 0;
    cursor: pointer;
  }
  #fileUpload > .file-input {
    display: none;
  }

  .chat--emoj {
    display: inline-block;
    position: relative;
    &__display {
      position: absolute;
      bottom: 32px;
      left: 0;
      z-index: 0;

      .EmojiPickerReact {
        z-index: 9;
      }

      .layer {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
        background: transparent;
        width: 100%;
        height: 100%;
      }
    }
  }

  .btn-hover {
    &.btn-chat {
      .img-hover {
        display: inline-block;
      }
    }
  }

  .quill {
    .ql-editor {
      img {
        max-width: 200px;
      }
    }
  }
`;

export default SendToMultipleChannel;
