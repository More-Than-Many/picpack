import { useActionState, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [data, action, isPending] = useActionState(registerUser, undefined);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imgPreview, setImgPreview] = useState("");

  async function registerUser(previousState: unknown, formData: FormData) {
    setImgPreview("");
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        body: formData,
      });

      const userInfo = await response.json();

      if (!userInfo) {
        return { status: "error" };
      }

      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(userInfo));

        if (response.headers.get("x-auth-token")) {
          localStorage.setItem(
            "x-auth-token",
            response.headers.get("x-auth-token") as string
          );

          navigate("/");
        }
      } else {
        return { status: "error" };
      }
    } catch (err) {
      return { status: err };
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-[100vh]">
        <form
          action={action}
          className="flex flex-col justify-center  min-w-[400px] h-fit p-[25px] gap-[20px]"
        >
          <h1 className="text-center font-bold text-[35px]">Sign Up</h1>
          <input
            id="username"
            name="username"
            className="text-center focus:placeholder:opacity-0 rounded-[30px] border-black border-2 py-[10px] text-[20px]"
            placeholder="Username"
            minLength={5}
            maxLength={25}
            required
          />
          <input
            id="password"
            name="password"
            className="text-center focus:placeholder:opacity-0 rounded-[30px] border-black border-2 py-[10px] text-[20px]"
            placeholder="Password"
            type="password"
            minLength={5}
            maxLength={25}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <input
            id="confirm_password"
            className="text-center focus:placeholder:opacity-0 rounded-[30px] border-black border-2 py-[10px] text-[20px]"
            placeholder="Confirm Password"
            type="password"
            minLength={5}
            maxLength={25}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
          <div className="relative w-[400px] h-[400px] border-2 border-black flex justify-center items-center">
            {!imgPreview && (
              <label
                htmlFor="upload_img"
                className="border-black border-2 rounded-full p-[10px] hover:bg-black hover:text-white cursor-pointer"
              >
                Upload Image
              </label>
            )}
            <input
              id="upload_img"
              name="upload_img"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.files && event.target.files.length > 0) {
                  const file = event.target.files[0];
                  const preview = URL.createObjectURL(file);
                  setImgPreview(preview);
                }
              }}
              required
            />
            {imgPreview && <img src={imgPreview} />}
            {imgPreview && (
              <div
                className="absolute right-3 top-3 bg-black text-white hover:bg-white hover:text-black rounded-full border-white border-2 cursor-pointer"
                onClick={() => {
                  setImgPreview("");
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
          </div>
          {password != confirmPassword && <span>Passwords do not match</span>}
          <button
            type="submit"
            className="bg-amber-300 rounded-[30px] py-[10px] hover:bg-amber-200 cursor-pointer text-[20px]"
            disabled={isPending && password == confirmPassword}
          >
            Sign Up
          </button>
        </form>
        <a
          className="hover:underline cursor-pointer"
          onClick={() => {
            navigate("/login");
          }}
        >
          Already have an account?
        </a>
      </div>
    </>
  );
};

export default Register;
