import moment from "moment";

function groupedDays(messages: any) {
  //   console.log("messages", messages);
  return messages.reduce((acc: any, el: any, i: any) => {
    // console.log({ el });
    // console.log({ acc });
    const messageDay: any = moment(parseInt(el.timestamp)).format(
      "HH DD-MM-YYYY"
    );
    // console.log("acc[messageDay]", acc[messageDay]);
    if (acc[messageDay]) {
      console.log("acc[messageDay].concat([el])", acc[messageDay].concat([el]));
      return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
    }
    console.log("[el]", [el]);
    return { ...acc, [messageDay]: [el] };
  }, {});
}

function generateItems(messages: any) {
  const days = groupedDays(messages);
  const sortedDays = Object.keys(days).sort(
    (x, y) =>
      moment(x, "hh DD-MM-YYYY").unix() - moment(y, "hh DD-MM-YYYY").unix()
  );
  const items = sortedDays.reduce((acc: any, date: any) => {
    const sortedMessages = days[date].sort(
      (x, y) =>
        new Date(x.timestamp).valueOf() - new Date(y.timestamp).valueOf()
    );
    return acc.concat([
      { type: "day", date, id: date},
      ...sortedMessages,
    ]);
  }, []);
  return items;
}

export default generateItems;
