import React, { useState } from "react";
import { MediaNoDisponible } from "./MediaNoDisponible";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { Tag, Empty, Button } from "antd";
import { MedicineBoxOutlined, TagsOutlined, PlayCircleOutlined, HeartOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const COLOR_PALETTE = ["gold", "lime", "green", "cyan", "blue", "purple"];

// Reproductor de cada tarjeta: si no hay dirección válida o el video no carga, muestra un cartel.
const VideoMedia = ({ v }) => {
  const [error, setError] = useState(false);
  if (v.urlVideo && v.urlVideo.startsWith("<iframe")) {
    return <YoutubeEmbed valor={v.urlVideo} title={v.nombre || "Video de YouTube"} />;
  }
  if (!v.url || error) return <MediaNoDisponible />;
  return (
    <ReactPlayer
      width="100%"
      height="100%"
      src={v.url}
      controls
      onError={() => setError(true)}
      light={v.url.includes("youtube.com") || v.url.includes("youtu.be")}
      playIcon={
        <div className="video-play-btn">
          <PlayCircleOutlined style={{ fontSize: 48, color: "white" }} />
        </div>
      }
    />
  );
};

export const ListVideos = ({ videos, onEvaluate }) => {
  if (!videos || videos.filter(Boolean).length === 0) {
    return <Empty description="No hay videos disponibles" style={{ margin: "48px 0" }} />;
  }

  return (
    <div className="cont_videos">
      {videos.filter(Boolean).map((v, index) => (
        <div key={v?.id || index} className="video-card">
          <div className="video-player-wrapper">
            <VideoMedia v={v} />
          </div>
          <div className="video-info">
            <p className="video-title">{v.nombre}</p>
            {v.descripcion && (
              <p className="video-desc">{v.descripcion}</p>
            )}
            <div className="video-tags">
              {v.categoriasAsociadas?.length > 0 && (
                <div className="tags-row">
                  <TagsOutlined style={{ color: "var(--primary)", marginRight: 4 }} />
                  {v.categoriasAsociadas.map((cat, i) => (
                    <Tag color={COLOR_PALETTE[i % COLOR_PALETTE.length]} key={cat.id}>
                      {cat.nombre}
                    </Tag>
                  ))}
                </div>
              )}
              {v.patologia?.length > 0 && (
                <div className="tags-row">
                  <MedicineBoxOutlined style={{ color: "var(--primary)", marginRight: 4 }} />
                  {v.patologia.map((pat) => (
                    <Tag color="blue" key={pat.patologia.id} style={{ borderRadius: "var(--radius-full)" }}>
                      {pat.patologia.nombre}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
            {onEvaluate && (
              <Button
                type="primary"
                ghost
                size="small"
                icon={<HeartOutlined />}
                onClick={() => onEvaluate(v)}
                style={{ marginTop: 12, width: '100%', borderRadius: 'var(--radius-sm)' }}
              >
                Autoevaluar este ejercicio
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
