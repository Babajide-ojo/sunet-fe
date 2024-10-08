"use client";
import AdminLayout from "@/app/components/layout/AdminLayout";
import LoadingPage from "@/app/components/loaders/Loader";
import CreateRoomModal from "@/app/components/shared/modals/ceateRoomsModal";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaStar } from "react-icons/fa";
import { LiaBookReaderSolid } from "react-icons/lia";
import Viewer from "react-viewer";
``;

const Room = () => {
  const router = useRouter();
  const param = useParams();
  const [room, setRoom] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [visibleImg, setVisibleImg] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openUpdateModal, setUpdateModal] = useState(false);

  const getRoomData = async () => {
    try {
      const response = await axios.get(
        `https://sunet-be-6812.onrender.com/api/rooms/${param.id}`
      );
      setRoom(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoomData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <AdminLayout>
          <div className="max-w-7xl w-full mx-auto p-5">
            <div className="flex items-center justify-between mb-10">
              <FaArrowLeft
                size={20}
                className="cursor-pointer"
                onClick={() => router.back()}
              />

              <button
                className="py-2 px-4 border border-jsPrimary100 text-jsPrimary100 hover:bg-jsPrimary100 hover:text-white"
                onClick={() => setUpdateModal(true)}
              >
                Update Room
              </button>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-4xl">
                {room?.roomName} <small>({room?.roomType})</small>
              </h1>
              <div
                className={`py-2 px-4 rounded-md ${
                  room?.availability
                    ? "bg-green-100 text-green-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {room.availability === true ? (
                  <p>Available</p>
                ) : (
                  <p>Not Available</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 items-center mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="text-yellow-500">
                    <FaStar size={16} />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">(4.8)</p>
              <div className="flex gap-1 ml-2">
                <LiaBookReaderSolid size={23} />
                <p>20K+ booked</p>
              </div>
            </div>

            <div className="w-full rounded-3xl overflow-hidden h-[15rem] sm:h-[20rem] md:h-[30rem] relative cursor-pointer mt-10">
              {room?.images &&
                room?.images
                  .filter((img: any, index: number) => index <= 2)
                  .map((image: any, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className={`${
                        index === 0
                          ? "absolute h-full w-3/5 top-0 left-0 border-r-4 border-white"
                          : index === 1
                          ? "absolute h-1/2 w-2/5 top-0 right-0 border-l-4 border-b-4 border-white"
                          : "absolute h-1/2 w-2/5 bottom-0 right-0 border-l-4 border-t-4 border-white"
                      } `}
                      onClick={() => {
                        setVisibleImg(true);
                        setActiveIndex(index);
                      }}
                    />
                  ))}
            </div>

            <div className="mt-10">
              <div className="mb-5 flex items-end gap-5">
                <p className="text-3xl font-semibold">Price:</p>
                <p className="text-2xl font-semibold">
                  &#8358;{Number(room?.price).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold mb-5">Room overview</p>
                <p>
                  Step into comfort and elegance with our luxurious hotel rooms.
                  Designed for relaxation, each room features modern amenities,
                  plush bedding, and Executive Luxury bathrooms. Whether
                  traveling for business or leisure, our rooms provide the
                  perfect retreat for a rejuvenating stay.
                </p>
              </div>
              <div className="mt-5 pt-5">
                <p className="text-3xl font-semibold mb-5">
                  What&apos;s included
                </p>
                <div className="flex flex-col gap-3">
                  {room?.amenities &&
                    JSON.parse(room?.amenities)?.map((amenity: any) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="rounded-full p-1 bg-green-100 text-green-500 h-fit">
                          <FaCheck size={12} />
                        </div>
                        <p>{amenity}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      )}
      <Viewer
        visible={visibleImg}
        onClose={() => setVisibleImg(false)}
        images={room?.images?.map((image: string) => ({ src: image }))}
        activeIndex={activeIndex}
      />
      <CreateRoomModal
        open={openUpdateModal}
        onClose={setUpdateModal}
        reload={getRoomData}
        type={"update"}
        data={room}
        id={param?.id}
      />
    </>
  );
};

export default Room;
