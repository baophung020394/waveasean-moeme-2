import { Timestamp } from "db/firestore";

import moment from "moment";

export const createTimestamp = () => Timestamp.now().toMillis().toString();

export const formatTimeAgo = (timestamp: string) =>
  moment(parseInt(timestamp, 10)).fromNow();

export const formatTimeDate = (timestamp: string) =>
  moment(parseInt(timestamp, 10)).format("MMMM Do YYYY, h:mm:ss a");
