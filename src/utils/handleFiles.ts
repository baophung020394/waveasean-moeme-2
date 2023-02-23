import { sendChannelMessage2 } from "actions/channel";
import firebase from "db/firestore";
import { useDispatch } from "react-redux";

export const convertFiles = (type: any) => {
  const afterDot = type.name.substr(type.name.lastIndexOf(".") + 1);
  const metadata = {
    type: type.type,
    name: type.name,
  };

  if (["video/mp4", "video/mp3"].includes(metadata.type)) {
    metadata.type = type.type.replace("video/", "");
  } else if (["image/png", "image/jpeg", "image/jpg"].includes(metadata.type)) {
    metadata.type = type.type.replace("image/", "");
  } else if (afterDot === "pptx") {
    console.log("pptx");
    metadata.type = "pptx";
  } else if (afterDot === "docx") {
    console.log("docx");
    metadata.type = "docx";
  } else if (afterDot === "xlsx") {
    console.log("xlsx");
    metadata.type = "xlsx";
  } else if (afterDot === "mov") {
    console.log("xlsx");
    metadata.type = ".mov";
  } else {
    metadata.type = type.type.replace("application/", "");
  }

  return metadata;
};
