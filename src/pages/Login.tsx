import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthCredentials,
  setIsAuthenticated,
  setAccessToken,
  setWorkspace,
} from "../store/slices/authSlice";
import { getApiErrorMessage } from "../lib/getApiErrorMessage";

const Login = () => {
  const authState = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Navigate when authentication state changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await loginUser(data).unwrap();
      dispatch(setAuthCredentials(res.user));
      dispatch(setWorkspace(res.tenant));
      dispatch(setAccessToken(res.accessToken));
      dispatch(setIsAuthenticated(true));
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    }
  };

  return (
    <div className="flex justify-center align-center flex-col mt-20 gap-5 shadow-lg container w-[90vw] max-w-md min-h-[60vh] mx-auto p-5 ">
      <h1 className="text-xl text-center font-bold">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userEmail" className="font-bold">
            Email
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            required
            value={data.userEmail}
            onChange={handleChange}
            className="border border-gray-500 w-full m-2 rounded  h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={data.userPassword}
            onChange={handleChange}
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-600 text-sm m-2">{error}</p>}
        <button
          className="w-full bg-[#12161c] blue-700 text-white h-10 rounded m-2 cursor-pointer hover:bg-[#2A2E33] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="m-2">
          <Link to="/forgot-password" className="text-blue-700 hover:underline">
            Forgot Password?
          </Link>
        </p>
        <p className="m-2 text-sm">
          New here?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Create a workspace
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
