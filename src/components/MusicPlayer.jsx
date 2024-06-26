import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import ReactPlayer from "react-player";

const MusicPlayer = ({
  selectedTrack,
  isPlaying,
  setIsPlaying,
  setSelectedTrack,
  tracks,
}) => {
  const [currentTrack, setCurrentTrack] = useState(null);

  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(1);
  const playerRef = useRef(null);

  useEffect(() => {
    if (selectedTrack) {
      const trackIndex = tracks.findIndex(
        (track) => track.id === selectedTrack.id
      );
      setCurrentTrack(trackIndex);
      setIsPlaying(true);
    }
  }, [selectedTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    const nextTrackIndex = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextTrackIndex);
    setSelectedTrack(tracks[nextTrackIndex]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const prevTrackIndex = (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(prevTrackIndex);
    setSelectedTrack(tracks[prevTrackIndex]);
    setIsPlaying(true);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(tracks[currentTrack].startTime);
    }
  }, [currentTrack]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (currentTrack === null) {
    return null;
  }

  return (
    <div>
      <div className="fixed   bottom-0 left-0 right-0 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] md:bg-neutral-950 bg-neutral-900  rounded-3xl mb-4   m-4 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between  md:mb-4">
          <div className="flex items-center justify-between w-full md:h-1 sm:w-auto">
            <div className="">
              <p className="md:text-xl hidden md:flex ml-4  text-lg md:mt-20 w-full">
                {tracks[currentTrack].title}
              </p>
            </div>
            <div className="flex items-center justify-center flex-col-reverse w-full">
              <div className="flex items-center justify-center  mt-10 w-full mb-4  md:hidden ml-4">
                <button onClick={handlePrevTrack}>
                  <FaStepBackward />
                </button>
                <button className="ml-8 mr-8" onClick={handlePlayPause}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={handleNextTrack}>
                  <FaStepForward />
                </button>
              </div>
              <div className="flex flex-col md:hidden text-center items-center justify-center ">
                <p className="md:text-2xl  md:hidden flex  text-lg font-bold md:mt-8">
                  {tracks[currentTrack].title}
                </p>
                <p className="text-sm">{tracks[currentTrack].singers}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center justify-center mb-4 space-x-4 flex-1">
          <button onClick={handlePrevTrack}>
            <FaStepBackward />
          </button>
          <button onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleNextTrack}>
            <FaStepForward />
          </button>
        </div>
        <div className="hidden sm:flex items-center justify-center w-full mb-4">
          <span>{formatTime(played * tracks[currentTrack].endTime)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onChange={(e) =>
              playerRef.current.seekTo(parseFloat(e.target.value))
            }
            className="w-1/2 mx-4"
          />
          <span>{tracks[currentTrack].duration}</span>
        </div>
        <div className="hidden sm:flex items-center justify-end mb-4 w-full">
          <span className="mr-2">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
        <div className="flex sm:hidden items-center mb-4 mt-2 w-full">
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onChange={(e) =>
              playerRef.current.seekTo(parseFloat(e.target.value))
            }
            className="w-full   h-1"
          />
        </div>
        <ReactPlayer
          ref={playerRef}
          url={tracks[currentTrack].url}
          playing={isPlaying}
          volume={volume}
          controls={false}
          width="0"
          height="0"
          onProgress={handleProgress}
          onEnded={handleNextTrack}
          config={{
            youtube: {
              playerVars: {
                start: tracks[currentTrack].startTime,
                end: tracks[currentTrack].endTime,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
