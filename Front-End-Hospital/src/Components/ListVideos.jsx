import React from "react";
import ReactPlayer from "react-player";

export const ListVideos = ({ videos }) => {
  //esta lista servira para los videos de informacion y ejercicios

  return (
    <div className="cont_videos">
      {videos.map((v, index) => (
        <div key={index} className="cont_video">
          {/* <ReactPlayer width="100%" height="100%" url={v.url} /> */}
          <iframe
            width="100%"
            height="100%"
            src={v.url}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          ;
        </div>
      ))}
    </div>
  );
};
