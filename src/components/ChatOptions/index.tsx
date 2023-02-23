import React, { useState } from "react";
import { styled } from "utils/styled-component";
import IconTrash from "assets/images/chat/trash.png";
import IconSpeaker from "assets/images/chat/speaker.png";
import IconBring from "assets/images/chat/bring.png";
import IconMic from "assets/images/chat/mic.png";
import IconEdit from "assets/images/chat/edit2.png";
import IconStock from "assets/images/chat/stock.png";
import CreateStock from "components/CreateStock";
import { v4 as uuidv4 } from "uuid";
import { createTimestamp } from "utils/time";

interface ChatOptions {
  submitStock: (data: any) => void;
}

function ChatOptions({ submitStock }: ChatOptions) {
  const [isOpenStock, setIsOpenStock] = useState(false);
  const _messages = JSON.parse(localStorage.getItem("_messages"));
  let myuuid = uuidv4();

  const onSubmit = (data: any) => {
    let newMessage = {
      content: "",
      idMessage: myuuid,
      user: data?.user,
      stocks: data,
      timestamp: createTimestamp(),
    };

    // localStorage.setItem("_messages", JSON.stringify(newMessage));
    submitStock(newMessage);
    setIsOpenStock(false);
  };

  return (
    <ChatOptionsStyled>
      <div className="chat--options">
        <div className="chat--options__left">
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconTrash} alt="" />
            <img className="icon24 img-hover" src={IconTrash} alt="" />
          </button>
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconSpeaker} alt="" />
            <img className="icon24 img-hover" src={IconSpeaker} alt="" />
          </button>
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconBring} alt="" />
            <img className="icon24 img-hover" src={IconBring} alt="" />
          </button>
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconMic} alt="" />
            <img className="icon24 img-hover" src={IconMic} alt="" />
          </button>
        </div>
        <div className="chat--options__right">
          <button className="btn-hover">
            <img className="icon24 img-show" src={IconEdit} alt="" />
            <img className="icon24 img-hover" src={IconEdit} alt="" />
          </button>
          <div className="stock-option">
            <button
              className="btn-hover"
              onClick={() => setIsOpenStock(!isOpenStock)}
            >
              <img className="icon24 img-show" src={IconStock} alt="" />
              <img className="icon24 img-hover" src={IconStock} alt="" />
            </button>
            {isOpenStock ? (
              <CreateStock submitForm={onSubmit} closeFunc={setIsOpenStock} />
            ) : null}
          </div>
        </div>
      </div>
    </ChatOptionsStyled>
  );
}

const ChatOptionsStyled = styled.div`
  .stock-option {
    position: relative;
  }

  .chat--options {
    background-color: #ccc;
    padding: 15px;

    button {
      position: relative;
      margin-right: 6px;
    }

    display: flex;
    align-items: center;

    justify-content: space-between;

    &__right {
      display: flex;
      align-items: center;
    }
  }
`;
export default ChatOptions;
