/* eslint-disable import/no-anonymous-default-export */
export default {
  control: {
    backgroundColor: "#fff",
    fontSize: 16,
    wordBreak: "break-all",
    // fontWeight: 'normal',
  },

  "&multiLine": {
    control: {
      minHeight: 60,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    highlighter: {
      padding: 9,
      border: "1px solid transparent",
      maxHeight: 200,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    input: {
      padding: 9,
      maxHeight: 200,
      overFlowY: "scroll  !important",
      fontSize: 14,
      border: "none",
      borderBottom: "1px solid #e2e2e2",
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      "& ::placehoder": {
        color: "red",
        fontSize: 14,
      },
    },
  },

  "&singleLine": {
    display: "inline-block",
    width: 180,

    highlighter: {
      padding: 1,
      border: "2px inset transparent",
    },
    input: {
      padding: 1,
      border: "2px inset",
    },
  },

  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 16,
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#cee4e5",
      },
    },
  },
};
