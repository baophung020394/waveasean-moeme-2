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
import { useSelector } from "react-redux";
import firebase from "db/firestore";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

interface ChatOptions {
  submitStock: (data: any) => void;
}

function ChatOptions({ submitStock }: ChatOptions) {
  const [isOpenStock, setIsOpenStock] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const currentChannel = useSelector(({ channel }) => channel.currentChannel);
  const user = useSelector(({ auth }) => auth.user);
  let myuuid = uuidv4();

  const onSubmit = (data: any) => {
    let newMessage = {
      content: "",
      idMessage: myuuid,
      user,
      stocks: data,
      timestamp: createTimestamp(),
      type: 3,
    };

    // localStorage.setItem("_messages", JSON.stringify(newMessage));
    submitStock(newMessage);
    setIsOpenStock(false);
  };

  const handleRemoveMessages = () => {
    const messagesRef = firebase
      .database()
      .ref("messages")
      .child(currentChannel.id);
    setIsOpenPopup(false);
    return messagesRef.remove();
  };

  return (
    <ChatOptionsStyled>
      <div className="chat--options">
        <div className="chat--options__left">
          <button className="btn-hover" onClick={() => setIsOpenPopup(true)}>
            <img className="icon24 img-show" src={IconTrash} alt="" />
            <img className="icon24 img-hover" src={IconTrash} alt="" />
          </button>
          {/* <button className="btn-hover">
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
          </button>*/}
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

      <Modal
        centered={true}
        onClose={() => setIsOpenPopup(false)}
        onOpen={() => setIsOpenPopup(true)}
        open={isOpenPopup}
        size="small"
        className="send-channel-fail-modal"
      >
        <Header>Do you want to delete all messages?</Header>
        {/* <Modal.Content>
          <p>Please choose at least a channel</p>
        </Modal.Content> */}
        <Modal.Actions>
          <Button color="red" inverted onClick={() => setIsOpenPopup(false)}>
            <Icon name="checkmark" /> No
          </Button>
          <Button color="green" inverted onClick={handleRemoveMessages}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
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
