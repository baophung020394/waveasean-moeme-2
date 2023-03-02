import moment from "moment";

function groupedDays(messages: any) {
  //   console.log("messages", messages);
  return messages.reduce((acc: any, el: any, i: any) => {
    // const hour = 60 * 60 * 1000;
    // const hourAgo = parseInt(el.timestamp) - hour;
    // console.log("hour", hour);
    // console.log("hourAgo", hourAgo);
    // console.log("hourAgo", hourAgo);
    // console.log("hourAgo 2", moment(hourAgo).calendar());
    // console.log("hourAgo 3", moment(parseInt(el.timestamp)).calendar());
    // console.log("hourAgo 3", moment(parseInt(el.timestamp)).calendar());
    const messageDay: any = moment(parseInt(el.timestamp)).format(
      "HH DD-MM-YYYY"
    );

    if (acc[messageDay]) {
      return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
    }
    // console.log("[el]", [el]);
    return { ...acc, [messageDay]: [el] };
  }, {});
}

function generateItems(messages: any) {
  const days = groupedDays(messages);
  console.log("days", days);
  const sortedDays = Object.keys(days).sort(
    (x, y) =>
      moment(x, "HH DD-MM-YYYY").unix() -
      moment(y, "HH DD-MM-YYYY").unix()
  );
  console.log("sortedDays", sortedDays);
  const items = sortedDays.reduce((acc: any, date: any) => {
    const sortedMessages = days[date].sort((x, y) => {
      // console.log('need',new Date(parseInt(x.timestamp)).valueOf() -
      // new Date(parseInt(y.timestamp)).valueOf())
      return (
        new Date(parseInt(x.timestamp)).valueOf() -
        new Date(parseInt(y.timestamp)).valueOf()
      );
    });
    console.log("sortedMessages", sortedMessages);
    // console.log('acc',acc)
    // console.log("days[date]", days[date]);
    console.log("dateeeeee", date.replace(date.slice(2, 5), ""));
    return acc.concat([
      {
        type: "day",
        date,
        id: date,
      },
      ...sortedMessages,
    ]);
  }, []);
  console.log("items", items);
  return items;
}

export default generateItems;
