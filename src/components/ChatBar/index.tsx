import { currencyFormat } from "hooks/useFormatNumber";
import { Channel } from "models/channel";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import IconStockTop from "assets/images/chat/stock-top.png";
import IconSearch from "assets/images/chat/search.png";
import IconMoreMenu from "assets/images/chat/moremenu.png";
import { formatTimeAgo } from "utils/time";
import ChannelDetail from "components/ChannelDetail";

interface ChatBarProps {
  channel?: any;
  uniqueuUsers: any;
  searchTermChange?: (e: any) => void;
}

function ChatBar({ channel, uniqueuUsers, searchTermChange }: ChatBarProps) {
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // console.log({channel})
  const onChangeSearchTerm = (e: any) => {
    const target = e.target;
    searchTermChange(target.value);
  };

  return (
    <ChatBarStyled className="chat--bars">
      <div className="chat--bar">
        <div className="chat--bar__infor">
          {!channel?.isPrivateChat &&
            (channel?.room_profile_image ? (
              <object
                className="icon40 avatar"
                data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=7&serverfile=thumb_${channel.room_profile_image}`}
                type="image/png"
              >
                {channel?.device === "web" ? (
                  <img
                    className="image-chat"
                    src={JSON.parse(channel?.room_profile_image)}
                    alt="Thumb"
                  />
                ) : (
                  <img
                    src="http://www2.aveapp.com/wp-content/uploads/2021/05/w2560.jpg"
                    alt="avatar"
                    className="icon40 avatar"
                  />
                )}
              </object>
            ) : (
              <img
                src="http://www2.aveapp.com/wp-content/uploads/2021/05/w2560.jpg"
                alt="avatar"
                className="icon40 avatar"
              />
            ))}

          {channel?.isPrivateChat && (
            <object
              className="icon40 avatar"
              data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${channel?.userId}`}
              type="image/png"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                alt="avatar"
                className="icon40 avatar"
              />
            </object>
          )}

          <div className="chat--bar__infor__groupname">
            <div className="chat--bar__infor__groupname__top">
              <h4>
                {channel?.isPrivateChat ? channel?.userId : channel?.room_name}
              </h4>
              <span className="marks"></span>
              <span className="number">
                {channel?.isPrivateChat
                  ? null
                  : currencyFormat(Number(channel?.userCount))}
              </span>
            </div>
            <div className="chat--bar__infor__groupname__bottom">
              {channel?.isPrivateChat ? (
                <p className="user"></p>
              ) : (
                <>
                  <p className="user">
                    {channel?.owner_name}-{channel?.ownerId}
                  </p>
                  <p className="user">
                    {uniqueuUsers} User{uniqueuUsers <= 1 ? "" : "s"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="chat--bar__options">
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconStockTop} alt="" />
            <img className="icon24 img-hover" src={IconStockTop} alt="" />
          </button>
          <div className="search-option">
            <button
              className="btn-hover"
              onClick={() => setIsOpenInput(!isOpenInput)}
            >
              <img className="icon24 img-show" src={IconSearch} alt="" />
              <img className="icon24 img-hover" src={IconSearch} alt="" />
            </button>
            {isOpenInput && (
              <input
                type="text"
                onChange={onChangeSearchTerm}
                className="search-term"
              />
            )}
          </div>
          <button className="btn-hover">
            <img
              className="icon24 img-show"
              src="https://static.vecteezy.com/system/resources/previews/006/086/198/original/notification-icon-for-web-vector.jpg"
              alt=""
            />
            <img
              className="icon24 img-hover"
              src="https://static.vecteezy.com/system/resources/previews/006/086/198/original/notification-icon-for-web-vector.jpg"
              alt=""
            />
          </button>
          {!channel?.isPrivateChat && (
            <button className="btn-hover" onClick={() => setIsOpen(!isOpen)}>
              <img className="icon24 img-show" src={IconMoreMenu} alt="" />
              <img className="icon24 img-hover" src={IconMoreMenu} alt="" />
            </button>
          )}
        </div>
      </div>

      <ChannelDetail
        open={isOpen}
        channel={channel}
        uniqueuUsers={uniqueuUsers}
      />
      {isOpen && <div className="layer" onClick={() => setIsOpen(false)}></div>}
    </ChatBarStyled>
  );
}

const ChatBarStyled = styled.div`
  padding: 0 20px;
  border-bottom: 1px solid #e6ecf3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 91px;
  max-height: 91px;

  .layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.2;
  }

  .chat--bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    &__options {
      button {
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }

      .search-option {
        display: inline-block;
      }
    }

    &__infor {
      display: flex;

      img {
        margin-right: 16px;
      }

      &__groupname {
        &__top {
          display: flex;
          align-items: center;

          h4 {
            font-weight: bold;
            font-size: 16px;
            margin-right: 6px;
          }

          .number {
            font-size: 14px;
            color: #333;
          }
        }

        &__bottom {
          .user {
            margin: 0;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
  }
`;

export default ChatBar;
