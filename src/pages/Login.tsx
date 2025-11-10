import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, action, isPending] = useActionState(loginUser, undefined);
  const navigate = useNavigate();

  async function loginUser(previousState: unknown, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        return { status: "error" };
      }

      const userInfo = await response.json();

      if (!userInfo) {
        return { status: "error" };
      }

      if (response.headers.get("x-auth-token")) {
        localStorage.setItem(
          "x-auth-token",
          response.headers.get("x-auth-token") as string
        );

        localStorage.setItem("userData", JSON.stringify(userInfo));

        navigate("/");
      }
    } catch (err) {
      return console.log(err);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-[100vh] ">
        <div>
          <form
            action={action}
            className="loginForm min-w-[400px] h-fit flex flex-col p-[25px] gap-[20px]"
          >
            <h1 className="text-center font-bold text-[35px]">Login</h1>
            {data?.status && (
              <span className="text-center">
                Incorrect Username or Password
              </span>
            )}
            <input
              id="username"
              name="username"
              minLength={5}
              maxLength={25}
              required
              placeholder="Username"
              className="text-center focus:placeholder:opacity-0 rounded-[30px] border-black border-2 py-[10px] text-[20px] "
            />
            <input
              id="password"
              name="password"
              type="password"
              minLength={5}
              maxLength={255}
              required
              placeholder="Password"
              className="text-center focus:placeholder:opacity-0 rounded-[30px] border-black border-2 py-[10px] text-[20px] "
            />

            <button
              type="submit"
              disabled={isPending}
              className="bg-amber-300 rounded-[30px] py-[10px] hover:bg-amber-200 cursor-pointer text-[20px]"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                navigate("/register");
              }}
              className="bg-amber-300 rounded-[30px] py-[10px] hover:bg-amber-200 cursor-pointer text-[20px]"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
