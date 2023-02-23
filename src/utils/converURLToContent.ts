import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";

export const fetchURL = (Url: string) => {
  const result = fetch(`${Url}`)
    .then((res) => res.text())
    .then((html: any) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const title = doc.querySelectorAll("title")[0];
      const images = doc.images[doc.images.length - 1];
      console.log(images.src);
      console.log(doc.defaultView);
      console.log(doc.nodeValue);
      //   htmlToImage
      //     .toPng(doc.childNodes[0])
      //     .then((dataUrl) => {
      //       console.log(dataUrl);
      //       //   var img = new Image();
      //       //   img.src = dataUrl;
      //       //   document.body.appendChild(img);
      //     })
      //     .catch(function (error) {
      //       console.error("oops, something went wrong!", error);
      //     });
      //   //   console.log(title.innerText);
      console.log({ doc });

      return {
        title: title.innerText,
        images: images.src,
      };
    });

  return result;
};
