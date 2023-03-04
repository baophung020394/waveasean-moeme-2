import React, { useEffect, useState } from "react";
import { styled } from "utils/styled-component";
import firebase from "db/firestore";

interface TypingChatProps {
  id: string;
  user: any;
  activeMessage: any;
}
function TypingChat({ id, user, activeMessage }: TypingChatProps) {
  const actionsUserRef = firebase.database().ref("actionsUser");
  const [actionUserState, setActionUserState] = useState([]);
  const [filterActionUserState, setFilterActionUserState] = useState([]);
  const [usersAction, setUsersAction] = useState(null);
  const [display, setDisplay] = useState(false);

  /**
   * Check action of user realtime
   */
  useEffect(() => {
    if (id) {
      actionsUserRef.child(id).on("child_added", (snap) => {
        console.log("added", snap.val());
        if (snap.val().action === 1) {
          setDisplay(true);
        }
      });

      actionsUserRef.child(id).on("child_changed", (snap) => {
        console.log("snap", snap.val());
        if (snap.val().action === 1) {
          setDisplay(true);
        }

        setActionUserState((currentState: any) => {
          return [
            ...currentState,
            { ...snap.val(), action: snap.val().action },
          ];
        });
      });
    }
    return () => {
      actionsUserRef.child(id).off();
    };
  }, [id]);

  /**
   * Check duplicate user
   * @param arr
   * @param key
   * @returns
   */
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  /**
   * Counter action of user
   * @param inputs
   * @returns
   */
  const actionCounter = (inputs: any) => {
    let counter = 0;
    for (const input of inputs) {
      if (input.action === 0) counter += 1;
    }
    return counter;
  };

  const checkUserMain = (users: any, val: any) => {
    return users.some((arrVal) => val.uid === arrVal.userId);
  };

  const displayUsersAction = () => {
    if (filterActionUserState?.length > 0) {
      const filteredUser = filterActionUserState.filter(
        (auf: any) => auf?.userId !== user?.uid
      );
      if (id && filteredUser?.length > 0) {
        return filteredUser.map((au: any, idx: number) => {
          if (parseInt(au.action) === 1) {
            return <p key={au?.userId}> {au?.username}</p>;
          }
        });
      }
    }
  };

  useEffect(() => {
    const newArr: any = getUniqueListBy(actionUserState, "userId");

    // const test1 = newArr.reduce((acc, cur) => {
    //   if (!newArr.includes(acc.userId) && user.uid !== cur.userId) {
    //     acc.push(cur.userId);
    //   }
    //   return acc;
    // }, []);

    // setUsersAction(test1);

    // if (test1.includes(user.uid)) {
    //   console.log("user co trong nha");
    // } else {
    //   console.log("user co k?");
    // }
    // console.log({ test1 });
    const result = actionCounter(newArr);
    if (result === newArr.length) {
      setDisplay(false);
    }

    setFilterActionUserState(newArr);
  }, [actionUserState]);

  console.log({ display });
  console.log("filterActionUserState", filterActionUserState);
  return (
    display &&
    filterActionUserState?.length > 0 &&
    filterActionUserState.filter((u: any) => u.userId !== user.uid) && (
      <TypingChatStyled className="typing-chat">
        <div className="chat-bubble">
          <div className="typing">
            {displayUsersAction()}
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </TypingChatStyled>
    )
  );
}

const TypingChatStyled = styled.div`
  background-color: #ccc;
  padding: 0 15px;
  .chat-bubble {
    background-color: #e6f8f1;
    padding: 5px 20px;
    -webkit-border-radius: 20px;
    -webkit-border-bottom-left-radius: 2px;
    -moz-border-radius: 20px;
    -moz-border-radius-bottomleft: 2px;
    border-radius: 20px;
    border-bottom-left-radius: 2px;
    display: inline-block;
  }
  .typing {
    align-items: center;
    display: flex;
    height: 17px;
    p {
      color: #6cad96;
      font-size: 14px;
      margin-right: 8px;
    }
  }
  .typing .dot {
    animation: mercuryTypingAnimation 1.8s infinite ease-in-out;
    background-color: #6cad96; //rgba(20,105,69,.7);
    border-radius: 50%;
    height: 7px;
    margin-right: 4px;
    vertical-align: middle;
    width: 7px;
    display: inline-block;
  }
  .typing .dot:nth-child(1) {
    animation-delay: 200ms;
  }
  .typing .dot:nth-child(2) {
    animation-delay: 300ms;
  }
  .typing .dot:nth-child(3) {
    animation-delay: 400ms;
  }
  .typing .dot:last-child {
    margin-right: 0;
  }

  @keyframes mercuryTypingAnimation {
    0% {
      transform: translateY(0px);
      background-color: #6cad96; // rgba(20,105,69,.7);
    }
    28% {
      transform: translateY(-7px);
      background-color: #9ecab9; //rgba(20,105,69,.4);
    }
    44% {
      transform: translateY(0px);
      background-color: #b5d9cb; //rgba(20,105,69,.2);
    }
  }
`;

export default TypingChat;
