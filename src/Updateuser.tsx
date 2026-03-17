import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "./component/toast";

function UpdateUser() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8082/api/v1/users/${id}`,{
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {

        setName(data.user.name);
        setEmail(data.user.email);

      });

  }, [id]);



  const updateUser = async (e:any) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(`/api/v1/users/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      body:JSON.stringify({
        name:name,
        email:email
      })
    });

    const data = await response.json();

    if(response.ok){
      showToast("user updated!", "success");
      navigate("/");
    }else{
      alert(data.error?.message);
      showToast("Update Failed!", "error");
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-96 bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Update User
        </h2>

        <form className="space-y-4">

          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <button
            onClick={updateUser}
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            Update User
          </button>

        </form>

      </div>

    </div>
  );
}

export default UpdateUser;