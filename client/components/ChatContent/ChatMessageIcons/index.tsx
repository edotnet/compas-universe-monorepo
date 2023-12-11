import GenerateIcons from "../GenerateIcons";

const ChatMessageIcons = () => {
  return (
    <div className="d-flex align-items-center">
      <GenerateIcons
        icons={[
          { size: 20, src: "/images/icons/video.svg" },
          { size: 20, src: "/images/icons/voice.svg" },
        ]}
        styles={{ borderRight: "1px solid #E3E8E7" }}
      />
      <GenerateIcons
        icons={[
          { size: 20, src: "/images/icons/smile.svg" },
          { size: 20, src: "/images/icons/file.svg" },
          { size: 20, src: "/images/icons/notes.svg" },
        ]}
        styles={{ borderRight: "1px solid #E3E8E7" }}
      />
      <GenerateIcons
        icons={[{ size: 20, src: "/images/icons/dots-vertical.svg" }]}
        styles={{ borderLeft: "1px solid #E3E8E7" }}
      />
    </div>
  );
};

export default ChatMessageIcons;
