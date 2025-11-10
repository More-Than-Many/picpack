import { useActionState, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import GeneralUI from "../components/GeneralUI";

const CreatePost = () => {
  const [data, action, isPending] = useActionState(sendImageRequest, undefined);
  const navigate = useNavigate();
  const [imgPreview, setImgPreview] = useState<null | string>(null);

  async function sendImageRequest(previousState: unknown, formData: FormData) {
    const file = formData.get("upload_image") as File;

    const uploadForm = new FormData();
    uploadForm.append("upload_image", file);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        headers: {
          "x-auth-token": localStorage.getItem("x-auth-token") as string,
        },
        body: uploadForm,
      });

      if (response.ok) {
        const result = await response.json();
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      return;
    }
    setImgPreview(null);
  }

  return (
    <>
      <GeneralUI />

      <form
        action={action}
        className="lg:ml-[244px] flex flex-col items-center justify-center h-[100vh]"
      >
        <div className="postplaceholder flex flex-col items-center justify-center relative rounded-[12px] w-[300px] aspect-[2/3] border-3 bg-black">
          {imgPreview ? (
            <img id="imgPreview" className="rounded-[12px]" src={imgPreview} />
          ) : (
            ""
          )}
          {!imgPreview && (
            <label
              htmlFor="upload_image"
              className="absolute top-[50%] border-3 border-white pb-[5px] pt-[7px] px-[15px] text-center rounded-full bg-black text-white hover:bg-white hover:text-black cursor-pointer"
            >
              Upload Image
            </label>
          )}
          {imgPreview && (
            <div
              className="absolute right-3 top-3 bg-black text-white hover:bg-white hover:text-black rounded-full border-white border-2 cursor-pointer"
              onClick={() => {
                setImgPreview(null);
              }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          <input
            type="file"
            id="upload_image"
            name="upload_image"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0];
                const preview = URL.createObjectURL(file);
                setImgPreview(preview);
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || imgPreview == null}
          className="mt-[15px] border-3 pb-[5px] pt-[7px] px-[15px] text-center rounded-full border-black bg-black text-white hover:bg-white hover:text-black cursor-pointer"
        >
          Create Post
        </button>
      </form>
    </>
  );
};

export default CreatePost;
