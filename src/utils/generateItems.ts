import moment from "moment";

function groupedDays(messages: any) {
  return messages.reduce((acc: any, el: any, i: any) => {
    const messageDay: any = moment(parseInt(el.timestamp)).format(
      "HH:mm DD-MM-YYYY"
    );

    if (acc[messageDay.replace(messageDay.slice(2, 5), "")]) {
      return {
        ...acc,
        [messageDay.replace(messageDay.slice(2, 5), "")]: acc[
          messageDay.replace(messageDay.slice(2, 5), "")
        ].concat([el]),
      };
    }

    return { ...acc, [messageDay.replace(messageDay.slice(2, 5), "")]: [el] };
  }, {});
}

function generateItems(messages: any) {
  const days = groupedDays(messages);

  const sortedDays = Object.keys(days).sort(
    (x, y) =>
      moment(x, "HH:mm DD-MM-YYYY").unix() -
      moment(y, "HH:mm DD-MM-YYYY").unix()
  );

  const items = sortedDays.reduce((acc: any, date: any, idx: number) => {
    const sortedMessages = days[date].sort((x, y) => {
      return (
        new Date(parseInt(x.timestamp)).valueOf() -
        new Date(parseInt(y.timestamp)).valueOf()
      );
    });

    return acc.concat([
      {
        type: "day",
        date: date,
        id: Object.values(days)[idx],
      },
      ...sortedMessages,
    ]);
  }, []);

  return items;
}

export default generateItems;
