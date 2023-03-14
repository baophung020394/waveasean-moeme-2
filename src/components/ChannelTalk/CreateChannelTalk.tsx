import firebase from "db/firestore";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Header,
  Icon,
  Label,
  Modal,
  Segment,
} from "semantic-ui-react";
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

function imageHandler() {
  // console.log("this.quill", this.quill);
  const count = Math.round(Math.random() * 999999);
  const storageRef = firebase.storage().ref();
  const input = document.createElement("input");

  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  const cursorPosition = this.quill.getSelection().index;
  // this.quill.insertText(cursorPosition, "★");
  // this.quill.setSelection(cursorPosition + 1);
  input.onchange = async () => {
    var file: any = input && input.files ? input.files[0] : null;
    // var formData = new FormData();
    // formData.append("file", file);
    // let quillObj = quillRef.current.getEditor();
    // const range = quillObj.getSelection();
    const filePath = `chat/images/${count}.jpg`;
    storageRef
      .child(filePath)
      .put(file, { contentType: file?.type })
      .then((data) => {
        data.ref
          .getDownloadURL()
          .then((url) => {
            this.quill.insertEmbed(cursorPosition, "image", url);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
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
  const [value, setValue] = useState<any>();
  const [isSent, setIsSent] = useState<any>(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [channelsState, setChannelsState] = useState([]);
  const [listIdsChannel, setListIdsChannel] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [indexInput, setIndexInpiut] = useState(0);
  const [lengthContent, setLengthContent] = useState<any>();
  const [contentLong, setContentLong] = useState<any>([]);
  const [ops, setOps] = useState<any>([]);
  const channelsRef = firebase.database().ref("channels");
  const messagesRef = firebase.database().ref("messages");
  const postsRef = firebase.database().ref("posts");

  let quillRef: any = useRef();
  let myuuid = uuidv4();

  const handleChangeValue = (e: any, data: any, chnl: any) => {
    if (data.checked) {
      setListIdsChannel((currentState: any) => {
        let updateState = [...currentState];
        updateState.push(chnl);
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
    if (value.replaceAll("<p><br></p>", "").length === 0) {
      getNewIndexAndRender("-1");
      setIsSent(true);
      return;
    }
    if (listIdsChannel?.length <= 0) {
      setIsOpenPopup(true);
    }

    const newFilterContentLong = contentLong.filter(
      (f, idx) => contentLong.findIndex((fi) => fi === f) === idx
    );

    let longValue = "";
    if (indexInput > 0) {
      longValue = "".concat(...newFilterContentLong);
    }

    // console.log("longValue", longValue);
    // console.log("index", indexInput);

    const message: any = {
      idMessage: myuuid,
      content: indexInput > 0 ? longValue : value,
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

  /**
   * Config mudules to render toolbar
   */
  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        insertStar: insertStar,
        image: imageHandler,
      },
    },
    "emoji-toolbar": true,
    "emoji-textarea": true,
    "emoji-shortname": true,
  };

  const formats = ["link", "image", "emoji"];

  /**
   * Get list channels
   */
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

  /**
   * Return current index
   * @param idx
   * @param length
   * @param direction
   * @returns
   */
  const getNextIdx = (idx = -1, length, direction) => {
    // console.log("idx getNextIdx", idx);
    // console.log("idx length", length);
    switch (direction) {
      case "1": {
        console.log("1");
        return (idx + 1) % length;
        ``;
      }
      case "-1": {
        console.log("-1");
        return (idx === 0 && length - 1) || idx - 1;
      }
      default: {
        // console.log("idx default", idx);
        return idx;
      }
    }
  };

  /**
   * Get index and move next/prev page
   * @param direction
   */
  const getNewIndexAndRender = (direction) => {
    let newNexIndex = getNextIdx(indexInput, lengthContent, direction);
    let newOps = [...ops];
    newOps.push({
      insert: "",
    });

    // console.log("newFilter getNewIndexAndRender chua", newOps);

    const newFilter = newOps.filter(
      (f, idx) => newOps.findIndex((fi) => fi.insert === f.insert) === idx
    );
    // console.log("newFilter getNewIndexAndRender roi", newFilter);

    // console.log("newOps", newOps);
    quillRef.current.editor.setContents([newFilter[newNexIndex]]);
    setIndexInpiut(newNexIndex);
  };

  // console.log({ ops });

  /**
   * Hanlde render data when break line 15
   * @param lineNumber
   * @param content
   */
  const handleBreakLine = (lineNumber, content) => {
    if (lineNumber > 15) {
      setOps((currentState: any) => {
        let updateState = [...currentState];
        updateState.push({
          insert:
            !content?.insert.image && !content?.insert.emoji
              ? content.insert.replace("\n\n", "")
              : content?.insert,
        });
        return updateState;
      });

      setContentLong((currentState: any) => {
        let updateState = [...currentState];
        updateState.push(value.replaceAll("<p><br></p>", ""));
        return updateState;
      });
    }
  };

  useEffect(() => {
    if (ops.length > 0) {
      let newOps = [...ops];
      newOps.push({
        insert: "",
      });
      const newFilter = newOps.filter(
        (f, idx) => newOps.findIndex((fi) => fi.insert === f.insert) === idx
      );

      setLengthContent(newFilter.length);
    }
  }, [ops.length]);

  useEffect(() => {
    if (lengthContent > 0) {
      getNewIndexAndRender("1");
    }
  }, [lengthContent]);

  useEffect(() => {
    if (value?.length >= 42 && isSent) {
      sendMessage();
    }
  }, [value, isSent]);

  return (
    <SendToMultipleChannelStyled>
      <div className="toolbar-options">
        <CustomToolbar />
      </div>

      <ReactQuill
        // readOnly={true}
        ref={quillRef}
        // id="text-area"
        // readOnly={true}
        theme="snow"
        value={value}
        modules={modules}
        onChange={(content, delta, source, editor) => {
          // console.log("content", content);
          // console.log("editor", editor.getHTML());
          // console.log("delta", delta);

          // quillRef?.current
          //   ?.getEditor()
          //   .on("text-change", (delta, old, source) => {
          //     console.log("change");
          //   });

          if (quillRef?.current?.getEditor()?.getLines().length === 5) {
            // setValue2(quillRef?.current.editor.getContents().ops);
          }

          handleBreakLine(
            quillRef?.current?.getEditor()?.getLines().length,
            editor.getContents()?.ops[0]
          );

          setValue(content?.length > 42 ? content : content);

          setSelectedFile(
            editor.getContents()?.ops.filter((op) => op?.insert?.image)[0]
              ?.insert.image
          );
        }}
        // formats={formats}
      />

      {ops?.length > 0 && (
        <Segment>
          <Button
            content="Prev"
            icon="left arrow"
            labelPosition="left"
            id="prev"
            onClick={() => {
              getNewIndexAndRender("-1");
            }}
          />
          <input
            onChange={(e: any) => {
              setIndexInpiut(e.target.value);
            }}
            value={indexInput + 1}
            type="text"
            id="pageNumber"
            className="page-number"
            disabled
            // style={{ display: "none" }}
          />

          <Button
            content="Next"
            icon="right arrow"
            labelPosition="right"
            id="next"
            onClick={() => {
              getNewIndexAndRender("1");
            }}
          />
          <Button
            content="Clear"
            icon="trash"
            labelPosition="right"
            id="next"
            onClick={() => {
              setOps([]);
              quillRef.current.editor.setContents({ insert: "" });
              setLengthContent(0);
            }}
          />
        </Segment>
      )}

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
            // getNewIndexAndRender("-1");
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

  .page-number {
    border: none;
    text-align: center;
    height: 100%;
    min-height: 35px;
    border-radius: 4px;
    background: #e0e1e2;
    margin-right: 4px;
    max-width: 35px;
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
      min-height: 302px;
      img {
        max-width: 200px;
      }
    }
  }
`;

export default SendToMultipleChannel;
