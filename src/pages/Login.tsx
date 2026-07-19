import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
 const dispatch = useDispatch<any>()
 const authState = useSelector((state: any) => state.auth);
 const navigate = useNavigate();

  const [data, setData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Navigate when authentication state changes
  useEffect(() => {
    if(authState.isAuthenticated) {
       navigate("/dashboard")
    }
  }, [authState.isAuthenticated]);

  const handleSubmit = async (e: any) => {
      e.preventDefault();
        dispatch(loginUser(data));
  }

  return (
    <div className="flex justify-center align-center flex-col mt-20 gap-5 shadow-lg container w-[30vw] h-[60vh] mx-auto p-5 ">
      <h1 className="text-xl text-center font-bold">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userEmail" className="font-bold">
            Email
          </label>
          <input
            type="email"
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
            name="userPassword"
            required
            value={data.userPassword}
            onChange={handleChange}
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="w-full bg-[#12161c] blue-700 text-white h-10 rounded m-2 cursor-pointer hover:bg-[#2A2E33]" type="submit">
          Login
        </button>
        <p className="m-2">
          <Link to="/forgotPassword" className="text-blue-700 hover:underline">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
