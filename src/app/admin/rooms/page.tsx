// AdminDashboard.js
"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";
import CreateRoomModal from "@/app/components/shared/modals/ceateRoomsModal";
import SearchBar from "@/app/components/shared/input-fields/SearchBar";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<any>([]);
  const [openRoomModal, setOpenRoomModal] = useState<any>(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const getAllRooms = async () => {
    try {
      const response = await axios.get(
        "https://sunet-be.onrender.com/api/rooms/all"
      );

      setRooms(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  console.log(rooms);

  const renderFilterButton = (text: string) => (
    <button
      className={`p-2 px-5 rounded-full text-md font-bold border border-yellow-500 capitalize ${
        filter === text && "bg-yellow-50"
      }`}
      onClick={() => setFilter(text)}
    >
      {text}
    </button>
  );

  return (
    <>
      <AdminLayout>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Rooms</h2>
            <button
              className="py-2 px-4 border border-jsPrimary100 text-jsPrimary100 hover:bg-jsPrimary100 hover:text-white"
              onClick={() => setOpenRoomModal(true)}
            >
              Create Room
            </button>
          </div>

          <div className="mt-3">
            <p className="text-lg font-semibold">Total Rooms: {rooms.length}</p>
          </div>
          <div className="flex justify-between items-center mt-10">
            <div className="flex gap-5 items-center">
              {renderFilterButton("all")}
              {renderFilterButton("Available")}
              {renderFilterButton("Not Available")}
            </div>
            <div className="max-w-md w-full">
              <SearchBar
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="mt-10 w-full">
            <thead className="bg-jsPrimary100 text-white font-medium">
              <tr>
                <td className="p-5">No</td>
                <td className="p-5">ID</td>
                <td className="p-5">Name</td>
                <td className="p-5">Room Type</td>
                <td className="p-5">Price</td>
                <td className="p-5">Availability</td>
              </tr>
            </thead>
            <tbody>
              {rooms
                .filter(
                  (item: any) =>
                    item.availability ===
                      (filter === "Available"
                        ? true
                        : filter === "Not Available"
                        ? false
                        : "") || filter === "all"
                )
                .filter((item: any) =>
                  ["roomName", "roomId"].some((prop) =>
                    item?.[prop]
                      ?.toString()
                      .toLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                )
                .map((item: any, index: number) => (
                  <tr
                    key={item?._id}
                    className={`border-t border-t-yellow-500 hover:bg-yellow-50 cursor-pointer `}
                    onClick={() => router.push(`/admin/rooms/${item?._id}`)}
                  >
                    <td className="p-5">{index + 1}</td>
                    <td className="p-5">{item?.roomId}</td>
                    <td className="p-5">{item?.roomName}</td>
                    <td className="p-5">{item?.roomType}</td>
                    <td className="p-5">{item?.price?.toLocaleString()}</td>
                    <td className="p-5">
                      {item?.availability ? "Available" : "Not Available"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      <CreateRoomModal open={openRoomModal} onClose={setOpenRoomModal} />
    </>
  );
};

export default AdminDashboard;
