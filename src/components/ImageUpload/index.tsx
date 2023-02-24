import React, { useState } from "react";
import { Input, Modal, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import firebase from "db/firestore";
import { useDispatch } from "react-redux";
import { updateProfileUser } from "actions/auth";

interface ImageUploadProps {
  user: any;
  open: boolean;
  onClose: () => void;
}
export const ImageUpload = ({ user, open, onClose }: ImageUploadProps) => {
  const storageRef = firebase.storage().ref();
  const userRef = firebase.database().ref("users").child(user.uid);
  const [fileState, setFileState] = useState(null);
  const dispatch: any = useDispatch();

  let myuuid = uuidv4();

  const acceptedTypes = ["image/png", "image/jpeg"];

  const onFileAdded = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileState(file);
    }
  };

  const updateUserAvatar = (url: string) => {
    if (url?.length < 0) return;
    const newUser = { ...user };
    newUser.photoURL = url;
    dispatch(updateProfileUser(newUser));
  };

  const uploadImage = () => {
    dispatch({ type: "AUTH_UPDATE_PROFILE_INIT" });
    // if (fileState && acceptedTypes.includes(mime.lookup(fileState.name))) {
    const filePath = `chat/images/${myuuid}.jpg`;
    console.log("contentType", fileState.type);
    storageRef
      .child(filePath)
      .put(fileState, { contentType: fileState?.type })
      .then((data) => {
        data.ref
          .getDownloadURL()
          .then((url) => {
            updateUserAvatar(url);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    setFileState(null);
    onClose();
    // }
  };

  return (
    <Modal basic open={open} onClose={onClose} size="fullscreen">
      <Modal.Header>Select a image</Modal.Header>
      <Modal.Content>
        <Input
          type="file"
          name="file"
          onChange={onFileAdded}
          fluid
          label="File Type (png , jpeg)"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="green" onClick={uploadImage}>
          <Icon name="checkmark" />
          Update
        </Button>
        <Button basic color="grey" onClick={onClose}>
          <Icon name="remove" />
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
