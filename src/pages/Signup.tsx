import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation, type RegisterData } from "../store/api/authApi";
import {
  setAccessToken,
  setAuthCredentials,
  setIsAuthenticated,
  setWorkspace,
} from "../store/slices/authSlice";
import { getApiErrorMessage } from "../lib/getApiErrorMessage";

const initialData: RegisterData = {
  workspaceName: "",
  userName: "",
  userEmail: "",
  userPassword: "",
};

const Signup = () => {
  const authState = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerWorkspace, { isLoading }] = useRegisterMutation();
  const [data, setData] = useState<RegisterData>(initialData);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await registerWorkspace(data).unwrap();
      dispatch(setAuthCredentials(res.user));
      dispatch(setWorkspace(res.tenant));
      dispatch(setAccessToken(res.accessToken));
      dispatch(setIsAuthenticated(true));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not create your workspace. Please try again."));
    }
  };

  return (
    <div className="flex justify-center align-center flex-col mt-10 gap-5 shadow-lg container w-[90vw] max-w-md mx-auto p-5">
      <div>
        <h1 className="text-xl text-center font-bold">Create your workspace</h1>
        <p className="text-sm text-center text-gray-600 mt-2">
          Set up a private workspace for your finances.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="workspaceName" className="font-bold">
            Workspace name
          </label>
          <input
            type="text"
            id="workspaceName"
            name="workspaceName"
            required
            minLength={2}
            value={data.workspaceName}
            onChange={handleChange}
            placeholder="Acme Finance"
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="userName" className="font-bold">
            Your name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            required
            value={data.userName}
            onChange={handleChange}
            placeholder="Aashish Magar"
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="userEmail" className="font-bold">
            Email
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            required
            autoComplete="email"
            value={data.userEmail}
            onChange={handleChange}
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="userPassword" className="font-bold">
            Password
          </label>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            required
            minLength={8}
            autoComplete="new-password"
            value={data.userPassword}
            onChange={handleChange}
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mx-2">Use at least 8 characters.</p>
        </div>

        {error && <p className="text-red-600 text-sm m-2">{error}</p>}

        <button
          className="w-full bg-[#12161c] blue-700 text-white h-10 rounded m-2 cursor-pointer hover:bg-[#2A2E33] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating workspace..." : "Create workspace"}
        </button>

        <p className="m-2 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-700 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
