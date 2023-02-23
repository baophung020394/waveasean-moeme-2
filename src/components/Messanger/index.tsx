import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IconFileGrey from "assets/images/chat/send_file_grey.png";
import IconFileHover from "assets/images/chat/send_file_blue.png";
import IconScreenShotGrey from "assets/images/chat/screenshot_grey.png";
import IconScreenShotHover from "assets/images/chat/screenshot_hover.png";
import IconChatGrey from "assets/images/chat/chat_enter_grey.png";
import IconChatBlue from "assets/images/chat/chat_enter_blue.png";
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import { createTimestamp } from "utils/time";
import { useSelector } from "react-redux";
import { convertFiles } from "utils/handleFiles";
import firebase from "db/firestore";
import { MentionsInput, Mention } from "react-mentions";
import MentionsInputStyle from "./MentionsInputStyle";
interface MessangerProps {
  joinedUsersState?: any;
  channel: any;
  messages?: any;
  onSubmit: (message: any) => void;
  uploadFileProp?: (data: any) => void;
}

function Messanger({
  joinedUsersState,
  onSubmit,
  channel,
  messages,
  uploadFileProp,
}: MessangerProps) {
  const [value, setValue] = useState<any>("");
  const [listUserJoined, setListUserJoined] = useState<any>([]);
  const [isOpenEmoj, setIsOpenEmoj] = useState<boolean>(false);
  const textareaRef = useRef<any>(null);
  const usersJoinedRef = useRef<any>(null);
  const user = JSON.parse(localStorage.getItem("_profile"));
  const userRedux = useSelector(({ auth }) => auth.user);

  let myuuid = uuidv4();

  /**
   * Choose Emoji
   * @param emojiData
   * @param event
   */
  const onClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const textAreaElement: any = document.getElementById("text-area");
    setValue(
      value.substr(0, textAreaElement.selectionStart) +
        emojiData.emoji +
        value.substr(textAreaElement.selectionEnd)
    );
  };

  /**
   *  This function will be triggered when the file field change
   * */
  const uploadChange = (e: any) => {
    console.log(e.target.files);
    if (e.target.files) {
      const file = e.target.files[0];
      console.log("upload manual", file);

      let newMessage = {
        content: ``,
        files: file,
        idMessage: myuuid,
        user,
        timestamp: createTimestamp(),
        fileType: file.type,
        metadata: convertFiles(file),
        author: {
          username: userRedux?.userId || userRedux.displayName,
          id: userRedux?.uid,
        },
      };
      uploadFileProp(newMessage);
      // const reader = new FileReader();

      // reader.readAsDataURL(image);

      // reader.onload = () => {
      // let newMessage = {
      //   content: `${e.target.files[0].type}`,
      //   files: JSON.stringify(reader?.result),
      //   idMessage: myuuid,
      //   user,
      //   timestamp: createTimestamp(),
      //   fileType: e.target.files[0].type,
      // };

      // reader.onloadend
      //   onSubmit(newMessage);
      // };
    }
  };

  /**
   * Check key press 'Enter'
   * @param e
   */
  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setValue("");
    }
  };

  /**
   * Submit form data
   * @returns
   */
  const sendMessage = async () => {
    if (value.trim() === "") return;
    console.log({ value });
    console.log("value", value.match(/[^(]+(?=\))/g));
    const messages: any = {
      idMessage: myuuid,
      content: value.trim(),
      user,
      timestamp: createTimestamp(),
    };
    onSubmit(messages);
  };

  /**
   * Capture
   */
  const capture = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = document.createElement("video");

    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia();
      video.srcObject = captureStream;
      context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
      const frame = canvas.toDataURL("image/png");
      captureStream.getTracks().forEach((track) => track.stop());
      window.location.href = frame;
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const dropHandler = (ev: any) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
          let newMessage = {
            content: ``,
            files: file,
            idMessage: myuuid,
            user,
            timestamp: createTimestamp(),
            fileType: file.type,
            metadata: convertFiles(file),
          };

          uploadFileProp(newMessage);
          textareaRef.current.style.border = "1px solid #e2e2e2";
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        textareaRef.current.style.border = "1px solid #e2e2e2";
      });
    }
  };

  const dragOverHandler = (ev: any) => {
    console.log("File(s) in drop zone");
    textareaRef.current.style.border = "3px solid rgb(29 78 216)";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  const dragLeaveHandler = (ev: any) => {
    console.log("File(s) in drop zone left");
    // textareaRef.current.style.border = "1px solid #e2e2e2";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  /**
   * Check auto height of Textarea
   */
  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [value]);

  return (
    <MessangerStyled
      className={`${
        channel?.enableWriteMsg === "0" ? "enableWriteMsg" : ""
      } chat-input form-group mt-3 mb-0`}
    >
      <MentionsInput
        id="text-area"
        inputRef={textareaRef}
        onKeyPress={onKeyPress}
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="form-control mentions-input"
        placeholder={`${
          channel?.enableWriteMsg === "0"
            ? "Chat is disabled"
            : "Type your message here..."
        } `}
        style={MentionsInputStyle}
      >
        <Mention
          data={joinedUsersState}
          trigger="@"
          markup="@__display__"
          style={{ background: "#cee4e5" }}
        />
      </MentionsInput>

      <div className="chat-input__options">
        <div className="chat-input__options__left">
          <button className="btn-hover mr-3">
            <div id="fileUpload">
              <label htmlFor="file-input">
                <img className="icon24 img-show" src={IconFileGrey} alt="" />
                <img className="icon24 img-hover" src={IconFileHover} alt="" />
              </label>
              <input
                className="file-input"
                id="file-input"
                type="file"
                onChange={(e) => {
                  uploadChange(e);
                  e.target.value = null;
                }}
              />
            </div>
          </button>
          <button className="btn-hover" onClick={capture}>
            <img className="icon24 img-show" src={IconScreenShotGrey} alt="" />
            <img
              className="icon24 img-hover"
              src={IconScreenShotHover}
              alt=""
            />
          </button>
          <div className="ml-3 chat--emoj">
            <button
              className="btn-hover"
              onClick={() => setIsOpenEmoj(!isOpenEmoj)}
            >
              <img
                className="icon24 img-show"
                src="https://cdn-icons-png.flaticon.com/512/1500/1500458.png"
                alt=""
              />
              <img
                className="icon24 img-hover"
                src="https://cdn-icons-png.flaticon.com/512/1500/1500458.png"
                alt=""
              />
            </button>

            <div className="chat--emoj__display">
              {isOpenEmoj && (
                <>
                  <EmojiPicker onEmojiClick={onClick} autoFocusSearch={false} />
                  <div
                    className="layer"
                    onClick={() => setIsOpenEmoj(false)}
                  ></div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="chat-input__options__right">
          <button
            className="btn-hoveree btn-chat"
            onClick={() => {
              sendMessage();
              setValue("");
            }}
          >
            {value?.length > 0 && channel?.enableWriteMsg === "1" ? (
              <img className="icon24 img-hover" src={IconChatBlue} alt="" />
            ) : (
              <img className="icon24 img-show" src={IconChatGrey} alt="" />
            )}
          </button>
        </div>
      </div>
    </MessangerStyled>
  );
}

const MessangerStyled = styled.div`
  position: relative;
  border: 1px solid #e2e2e2;
  max-width: 97%;
  width: 100%;
  margin: auto;
  border-radius: 8px;
  flex: 1 1 115px;

  &.enableWriteMsg {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 99;
    }

    .mentions-input {
      .form-control__control {
        color: #ccc;
        font-size: 14px;
        position: relative;

        &::placeholder {
          color: #ccc;
          font-size: 14px;
        }
      }
    }
  }

  .mentions-input {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    max-height: 350px;
    height: auto;
    border: none;
    border-bottom: 1px solid #e2e2e2;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    overflow: auto;
    min-height: 60px;
    overflow-y: hidden !important;

    .form-control__control {
      min-height: unset;
      .form-control__highlighter {
        overflow-wrap: unset !important;
        // overflow: unset !important;
        word-break: break-word;
        white-space: unset !important;
        max-height: 350px;
      }
    }
    .form-control__input {
      border: none;
      padding: 0;
      resize: none;
      padding: 16px;
      border-bottom: 1px solid #e2e2e2;
      overflow-y: auto !important;
      border-radius: 0;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      max-height: 350px;
      padding: 16px;
      border: none;
      height: 100% !important;

      &::placeholder {
        color: #e2e2e2;
      }

      &:focus {
        border-bottom: 1px solid #e2e2e2;
        box-shadow: none;
      }

      &::-webkit-scrollbar {
        // display: none;
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
`;

export default Messanger;
