import axiosClient from "api/axiosClient";
import { Auth } from "models/auth";
import { removeUser, setUser } from "services/TokenService";
import db from "db/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { v4 as uuidv4 } from "uuid";
// Create collection profiles
const createUserProfile = (userProfile: any) =>
  db.firestore().collection("profiles").doc(userProfile.uid).set(userProfile);

const extractSnapshotData = (snapshot: any) =>
  snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

export const fetchUsers = () =>
  db.firestore().collection("profiles").get().then(extractSnapshotData);

export const getUserProfile = (uid: string) =>
  db.database().ref("users").child(uid).get();

export const login = async ({ email, password }: any) => {
  return db.auth().signInWithEmailAndPassword(email, password);
};

export const loginFirebase = async ({ email, password }: any) => {
  console.log("email", email);
  console.log("password", password);
  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  const userProfile = await getUserProfile(user.uid);
  console.log({ userProfile });
  return userProfile;
};

// export const logout = () => {
//   removeUser();
// };

export const logout = () => {
  removeUser();

  return firebase.auth().signOut();
};

export const onAuthStateChanges = (onAuth: any) => {
  return firebase.auth().onAuthStateChanged(onAuth);
};

/** Test auth 2 */
export const createUser = (userProfileRegister: any, profile: any) => {
  console.log({ userProfileRegister });
  console.log({ profile });
  const userRef = db.database().ref("users");
  setUser(profile);
  return userRef.child(userProfileRegister.user.uid).set({
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    uid: profile.uid,
    id: profile.uid,
    display: profile.username,
    username: profile?.username,
    userId: profile.userId,
    email: profile.email,
    atk: profile.atk,
    avatar: "",
  });
  // return db
  //   .database()
  //   .ref("users")
  //   .child(userProfileRegister.uid)
  //   .set(userProfileRegister)
  //   .then((user) => console.log("saved user", user))
  //   .catch((err) => console.log("err", err));
};
