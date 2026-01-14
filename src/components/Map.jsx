import React, { useState, useRef, useEffect } from "react";
import "./Map.css";

import mapImg from "../img/map.png";

const Map = ({ markers, lines, onMapClick, onMouseMove }) => {
  const [scale, setScale] = useState(0.9); // TODO: based on screen
  const [translateX, setTranslateX] = useState(512);
  const [translateY, setTranslateY] = useState(512);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);

  useEffect(() => {
    const handleNativeWheel = (e) => {
      e.preventDefault();

      if (e.ctrlKey) {
        const zoomFactor = 0.01;
        setScale((prevScale) =>
          Math.min(Math.max(prevScale - e.deltaY * zoomFactor, 0.5), 3),
        );
      } else {
        const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
        setScale((prevScale) =>
          Math.min(Math.max(prevScale * scaleChange, 0.5), 3),
        );
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleNativeWheel, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleNativeWheel);
      }
    };
  }, []);

  const handleContainerMouseMove = (e) => {
    if (onMouseMove && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      onMouseMove({ x: Math.round(x), y: Math.round(y) });
    }
  };

  const lastTouchRef = useRef({ x: 0, y: 0, distance: 0 });

  const getDistance = (t1, t2) => {
    return Math.sqrt(
      Math.pow(t1.clientX - t2.clientX, 2) +
        Math.pow(t1.clientY - t2.clientY, 2),
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        distance: 0,
      };
    } else if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      lastTouchRef.current = { ...lastTouchRef.current, distance: dist };
    }
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchRef.current.x;
      const dy = touch.clientY - lastTouchRef.current.y;

      setTranslateX((prev) => Math.min(Math.max(prev - dx / scale, 0), 1024));
      setTranslateY((prev) => Math.min(Math.max(prev - dy / scale, 0), 1024));

      lastTouchRef.current = {
        ...lastTouchRef.current,
        x: touch.clientX,
        y: touch.clientY,
      };
    } else if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      if (lastTouchRef.current.distance > 0) {
        const scaleChange = dist / lastTouchRef.current.distance;
        setScale((prevScale) =>
          Math.min(Math.max(prevScale * scaleChange, 0.5), 3),
        );
      }
      lastTouchRef.current = { ...lastTouchRef.current, distance: dist };
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        distance: 0,
      };
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startTranslateX = translateX;
    const startTranslateY = translateY;

    const onMouseMove = (e) => {
      setTranslateX(
        Math.min(
          Math.max(startTranslateX - (e.clientX - startX) / scale, 0),
          1024,
        ),
      );
      setTranslateY(
        Math.min(
          Math.max(startTranslateY - (e.clientY - startY) / scale, 0),
          1024,
        ),
      );
    };

    const onMouseUp = (e) => {
      if (startX === e.clientX && startY === e.clientY) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        onMapClick({ x, y });
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className="map-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleContainerMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        className="map-tile"
        ref={mapRef}
        src={mapImg}
        alt="Game Map"
        style={{
          top: `50%`,
          left: `50%`,
          transform: `scale(${scale}) translate(${-translateX}px, ${-translateY}px)`,
        }}
        draggable={false}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      />
      {lines.map((line, index) => (
        <div
          key={index}
          className="line"
          style={{
            top: `50%`,
            left: `50%`,
            transform: `scale(${scale}) translate(${
              line.fromX - translateX
            }px, ${line.fromY - translateY}px) scale(${1 / scale}) rotate(${
              -Math.PI / 2 +
              Math.atan2(line.toY - line.fromY, line.toX - line.fromX)
            }rad)`,
            height: `${
              Math.sqrt(
                Math.pow(line.fromX - line.toX, 2) +
                  Math.pow(line.fromY - line.toY, 2),
              ) * scale
            }px`,
          }}
        ></div>
      ))}
      {markers.map((marker, index) => (
        <div
          key={index}
          className={`marker ${marker.type || "guessr"}`}
          data-tooltip={!marker.image ? marker.tooltip : undefined}
          style={{
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -100%) scale(${scale}) translate(${
              marker.x - translateX
            }px, ${marker.y - translateY}px) scale(${1 / scale})`,
            cursor: marker.image ? "pointer" : "inherit",
          }}
          onMouseEnter={() => setHoveredMarkerIndex(index)}
          onMouseLeave={() => setHoveredMarkerIndex(null)}
          onClick={(e) => {
            if (marker.image) {
              e.stopPropagation();
              window.open(marker.image, "_blank");
            }
          }}
        >
          {marker.image && (
            <div className="custom-tooltip">
              {hoveredMarkerIndex === index && (
                <img src={marker.image} alt="Location thumbnail" />
              )}
              <div>{marker.tooltip}</div>
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Map;
