import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../component/toast";


type User = {
  id: string;
  email: string;
  name: string;
};


export default function ListUser() {

  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

 useEffect(() => {
    async function getUsers() {
      const res = await fetch("/api/v1/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      // console.log(data.data);
      setUsers(data.data || []);
    }

    getUsers();
  }, [token]);

  const deleteUser = async (id: string) => {

  const token = localStorage.getItem("token");

  const response = await fetch(`/api/v1/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log(data);

  if(response.ok){
    setUsers(users.filter((user)=> user.id !== id))
    showToast("user deleted!", "success");
  }
}
console.log(localStorage.getItem("token"))


  return (
      <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        List of Users
      </h1>

      <div className="grid gap-4">

        {users.map((user) => (

          <div
            key={user.id}
            className="border p-4 rounded-lg shadow flex justify-between items-center"
          >

            <div>
              <p className="font-semibold">Name : {user.name}</p>
              <p className="text-gray-500">Email : {user.email}</p>
            </div>

            <div className="space-x-3">

              <button
                onClick={()=>navigate(`/updateuser/${user.id}`)}

                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Update
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


