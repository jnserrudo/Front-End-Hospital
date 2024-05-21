import React from "react";
import ReactPlayer from "react-player";

export const ListVideos = ({ videos }) => {
  //esta lista servira para los videos de informacion y ejercicios

  return (
    <div className="cont_videos">
      {videos.map((v, index) => (
        <div key={index} className="cont_video">
          <ReactPlayer width="100%" height="100%" url={v.url} />
        </div>
      ))}
    </div>
  );
};
