interface User {
  img_path: string;
  username: string;
}

interface Content {
  user: User;
  img_path: string;
  caption: string;
}

interface ContentCardProps {
  content: Content;
}

const ContentCard = ({ content }: ContentCardProps) => {
  return (
    <div className="postcard w-full">
      <div className="flex items-center place-content-between">
        <div className="flex items-center">
          <img
            src={content.user.img_path}
            className="profile rounded-full size-[40px]"
          />
          <p className="text-[10px] ml-[10px]">{content.user.username}</p>
        </div>
      </div>
      <div className="image-container mt-[10px] aspect-[2/3] flex flex-col justify-center bg-black">
        <img src={content.img_path} />
      </div>
      <div className="py-[14px] flex flex-col">
        <p className="text-[12px]">
          <span className="font-semibold mr-[10px]">
            {content.user.username}
          </span>
          {content.caption}
        </p>
      </div>
      <hr className="pb-[10px]" />
    </div>
  );
};

export default ContentCard;
