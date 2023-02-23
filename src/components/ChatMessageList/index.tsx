import ChatOptions from "components/ChatOptions";
import Stocks from "components/Stocks";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { formatTimeAgo } from "utils/time";
import { isEmojisOnly } from "utils/convertString";
import ProgressBars from "components/common/ProgressBars";
import ProgressBar from "react-bootstrap/ProgressBar";
import { v4 as uuidv4 } from "uuid";
import { convertFiles } from "utils/handleFiles";
import { createTimestamp } from "utils/time";

interface ChatMessageListProps {
  messages: any;
  progressBar?: any;
  selectedFile?: any;
  uploadFileProp?: (data: any) => void;
}

function ChatMessageList({
  messages = [],
  progressBar,
  selectedFile,
  uploadFileProp,
}: ChatMessageListProps) {
  // console.log("messageState", messageState);
  // console.log("progressBar", progressBar);
  // console.log({ selectedFile });
  // console.log({ messages });
  let myuuid = uuidv4();
  const user = useSelector(({ auth }) => auth.user);
  const profile = JSON.parse(localStorage.getItem("_profile"));
  let messagesRef: any = useRef<any>();
  let boxMessagesRef: any = useRef<any>();

  const isAuthorOf = useCallback(
    (message: any) => {
      return message?.author?.id === user?.uid ? "chat-right" : "chat-left";
    },
    [messages]
  );

  const imageLoaded = () => {
    messagesRef.scrollIntoView();
  };

  /**
   * Handle drop files
   * @param ev
   */
  const dropHandler = (ev: any) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (!uploadFileProp) return;
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
          let newMessage = {
            content: ``,
            files: file,
            idMessage: myuuid,
            user: profile,
            timestamp: createTimestamp(),
            fileType: file.type,
            metadata: convertFiles(file),
          };

          uploadFileProp(newMessage);
          boxMessagesRef.current.style.border = "unset";
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        boxMessagesRef.current.style.border = "unset";
      });
    }
  };

  /**
   * Handle when hover element drop files
   * @param ev
   */
  const dragOverHandler = (ev: any) => {
    console.log("File(s) in drop zone");
    boxMessagesRef.current.style.border = "3px solid rgb(29 78 216)";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  /**
   * Handle when leave drag element
   * @param ev
   */
  const dragLeaveHandler = (ev: any) => {
    boxMessagesRef.current.style.border = "unset";
    ev.preventDefault();
  };

  useEffect(() => {
    messagesRef?.scrollIntoView();
  }, [messages]);

  return (
    <ChatMessageListStyled
      className="chat--container"
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      ref={boxMessagesRef}
    >
      <ul ref={messagesRef} className="chat-box chatContainerScroll">
        {messages.map((message: any, idx: number) => {
          // console.log({ message });
          if (message?.stocks) {
            return (
              <li
                className={`${isAuthorOf(message)} chat-stocks`}
                key={`${message?.id}-${idx}`}
              >
                <div className="chat-avatar">
                  <object
                    className="icon40 avatar"
                    data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${message?.stocks?.user.userId}&roomid=${message?.stocks.user?.roomId}`}
                    type="image/png"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      alt="avatar"
                      className="icon40 avatar"
                    />
                  </object>
                  <div className="chat-name">
                    {message?.author?.username}
                    <div className="chat-hour">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="chat-text-wrapper">
                  <Stocks stocks={message?.stocks} />
                </div>
              </li>
            );
          } else if (
            message?.fileType &&
            ["image/jpeg", "image/png", "image/jpg"].includes(message?.fileType)
          ) {
            return (
              <li
                className={`${isAuthorOf(message)} chat-images`}
                key={`${message?.ID}-${idx}`}
              >
                <div className="chat-avatar">
                  <object
                    className="icon40 avatar"
                    data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${message?.user.userId}&roomid=${message?.user?.roomId}`}
                    type="image/png"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      alt="avatar"
                      className="icon40 avatar"
                    />
                  </object>
                  <div className="chat-name">
                    {message?.author?.username}
                    <div className="chat-hour">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="chat-text-wrapper">
                  <img
                    className="image-chat"
                    src={
                      message?.status === "Uploading"
                        ? URL.createObjectURL(message?.files)
                        : message.files
                    }
                    alt="Thumb"
                    onLoad={imageLoaded}
                  />
                  {selectedFile?.timestamp === message?.timestamp &&
                    message.status === "Uploading" && (
                      <>
                        <ProgressBars progressBar={progressBar} />;
                      </>
                    )}
                </div>
              </li>
            );
          } else if (
            message?.fileType &&
            ["video/mp4", "video/mp3"].includes(message?.fileType)
          ) {
            return (
              <li
                className={`${isAuthorOf(message)} chat-videos`}
                key={`${message?.ID}-${idx}`}
              >
                <div className="chat-avatar">
                  <object
                    className="icon40 avatar"
                    data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${message?.user.userId}&roomid=${message?.user?.roomId}`}
                    type="image/png"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      alt="avatar"
                      className="icon40 avatar"
                    />
                  </object>
                  <div className="chat-name">
                    {message?.author?.username}
                    <div className="chat-hour">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="chat-text-wrapper">
                  {selectedFile?.timestamp === message?.timestamp &&
                    message.status === "Uploading" && (
                      <>
                        <ProgressBars progressBar={progressBar} />;
                      </>
                    )}
                  <video
                    onLoad={imageLoaded}
                    controls
                    src={
                      message?.status === "Uploading"
                        ? URL.createObjectURL(message?.files)
                        : message.files
                    }
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </li>
            );
          } else if (
            message?.fileType &&
            ![
              "video/mp4",
              "video/mp3",
              "image/jpeg",
              "image/png",
              "image/jpg",
            ].includes(message?.fileType)
          ) {
            return (
              <li
                className={`${isAuthorOf(message)} other-file`}
                key={`${message?.id}-${idx}`}
              >
                <div className="chat-avatar">
                  <object
                    className="icon40 avatar"
                    data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${message?.user.userId}&roomid=${message?.roomId}`}
                    type="image/png"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      alt="avatar"
                      className="icon40 avatar"
                    />
                  </object>

                  <div className="chat-name">
                    {message?.author?.username}
                    <div className="chat-hour">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
                <div className={`chat-text-wrapper `}>
                  <button
                    className="chat-text"
                    type="submit"
                    onClick={() => `${window.open(`${message.files}`)}`}
                    disabled={message.status === "Uploading"}
                  >
                    {message?.metadata.name}
                  </button>
                  {selectedFile?.timestamp === message?.timestamp &&
                    message.status === "Uploading" && (
                      <>
                        <ProgressBar
                          animated
                          now={progressBar?.percent}
                          label={`${progressBar?.percent}%`}
                        />
                      </>
                    )}

                  {/* <span className="chat-spacer"></span> */}
                </div>
              </li>
            );
          } else {
            return (
              <li className={isAuthorOf(message)} key={`${message?.id}-${idx}`}>
                <div className="chat-avatar">
                  <object
                    className="icon40 avatar"
                    data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${message?.user.userId}&roomid=${message?.roomId}`}
                    type="image/png"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      alt="avatar"
                      className="icon40 avatar"
                    />
                  </object>

                  <div className="chat-name">
                    {message?.author?.username}
                    <div className="chat-hour">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
                <div
                  className={`chat-text-wrapper ${
                    isEmojisOnly(message?.content) ? "hasEmoj" : ""
                  }`}
                >
                  <span className="chat-text">{message?.content}</span>
                  {/* <span className="chat-spacer"></span> */}
                </div>
              </li>
            );
          }
        })}
        <div ref={(currentEl) => (messagesRef = currentEl)}></div>
      </ul>
    </ChatMessageListStyled>
  );
}

const ChatMessageListStyled = styled.div`
  padding: 16px;
  background-color: #ccc;
  overflow: auto;
  flex: 1 1 100%;

  /* Track */
  /* width */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  ul {
    li {
      &:last-child {
        margin-bottom: 0;
      }

      &.other-file {
        .chat-text-wrapper {
          .chat-text {
            font-size: 16px !important;
            color: #fff;
            cursor: pointer;
            background: none;
            border: none;
            text-decoration: underline;
          }
        }

        &.chat-left {
          .chat-text {
            color: #000;
          }
        }
      }
    }
  }

  li.chat-right,
  li.chat-left {
    display: flex;
    flex: 1;
    flex-direction: row;
    margin-bottom: 40px;

    .chat-avatar {
      align-self: flex-end;
    }

    .chat-name {
      display: flex;
      align-items: center;
    }

    .chat-text-wrapper {
      align-self: flex-start;
      word-break: break-all;

      &.hasEmoj {
        background-color: transparent;

        .chat-text {
          font-size: 45px;
          line-height: 1;
        }
      }
    }

    &.chat-images {
      .chat-text-wrapper {
        background-color: #fff;
        padding: 0;
      }
    }
    &.chat-videos {
      .chat-text-wrapper {
        background-color: transparent;
        padding: 0;

        video {
          width: 100%;
          max-width: 300px;
          border-radius: 12px;
        }
      }
    }
  }

  li {
    &.chat-left {
      &.chat-stocks {
        .chat-text-wrapper {
          h4 {
            color: #000;
          }

          background-color: #fff;
          padding: 0;
          max-width: 420px;
          width: 100%;
        }
      }
    }

    &.chat-right {
      justify-content: flex-end;

      &.chat-stocks {
        h4 {
          color: #000;
        }
        .chat-text-wrapper {
          background-color: #fff;
          padding: 0;
          max-width: 420px;
          width: 100%;
        }
      }

      &.chat-image {
        img:not(.icon40) {
          width: 100%;
          height: auto;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .chat-text-wrapper {
          max-width: 15%;
          padding: 0;

          .chat-text {
            display: inline-block;
            padding: 10px;
          }
        }

        .chat-href {
          color: #e2e2e2;
          font-size: 10px;
          display: inline-block;
          margin-left: 10px;
          cursor: hover;
        }
      }

      & > .chat-avatar {
        // margin-right: 20px;
      }

      & > .chat-text-wrapper {
        background-color: #7869ef;
        color: #fff;
      }
    }

    .chat-avatar {
      //   margin-right: 20px;
    }

    .chat-name {
      font-size: 0.75rem;
      color: #999999;
      text-align: center;
    }

    .chat-text-wrapper {
      padding: 0.4rem 1rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 12px;
      background: #ffffff;
      font-weight: 300;
      line-height: 150%;
      position: relative;
      max-width: 55%;
      font-size: 0.9rem;
    }

    .chat-spacer {
      width: 50px;
      display: inline-block;
    }

    .chat-hour {
      float: right;
      font-size: 12px;
      margin-left: 8px;
      margin-right: 3px;
    }
  }

  @media (max-width: 1600px) {
    li {
      &.chat-right {
        justify-content: flex-end;

        &.chat-image {
          cursor: pointer;
          .chat-text-wrapper {
            max-width: 30%;
            padding: 0;

            .chat-text {
              display: inline-block;
              padding: 10px;
            }
          }
        }
      }
    }
  }
`;

export default ChatMessageList;
