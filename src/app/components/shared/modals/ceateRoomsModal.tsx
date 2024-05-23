import { IoClose } from "react-icons/io5";
import { FC, useState } from "react";
import InputField from "../input-fields/InputFields";
import { FiPaperclip } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { error } from "console";
import { ToastContainer, toast } from "react-toastify";

interface CreateRoomModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
}
const CreateRoomModal: FC<CreateRoomModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    amenities: string[];
    roomType: string;
    roomName: string;
    price: string;
    images: File[];
  }>({
    amenities: [],
    roomType: "",
    roomName: "",
    price: "",
    images: [],
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const amenities = ["Wifi", "Tv", "Air Conditioning", "Chiller", "Microwave"];
  const handleCheckbox = (e: any, amenity: string) => {
    const isChecked = e.target.checked; // Check if the checkbox is checked

    setFormData((prev: any) => {
      if (isChecked) {
        // If checked, add the amenity to the array
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        };
      } else {
        // If unchecked, remove the amenity from the array
        return {
          ...prev,
          amenities: prev.amenities.filter((a: string) => a !== amenity),
        };
      }
    });
  };

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    setFormData((prev: any) => ({ ...prev, images: files }));
  };

  const handleFileDelete = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    const payload = new FormData();
    payload.append("roomName", formData.roomName);
    payload.append("roomType", formData.roomType);
    payload.append("price", formData.price);
    payload.append("amenities", JSON.stringify(formData.amenities));
    formData.images.forEach((image, index) => {
      payload.append("images", image);
    });

    try {
      const response = await axios.post(
        "https://sunet-be.onrender.com/api/rooms/create",
        payload
      );
      if (response.status === 201) {
        toast.success("Room has been created successfully");
      } else {
        console.error("Room created failed:", response.statusText);
        toast.error("Room creation failed. Please try again later.");
      }
    } catch (error: any) {
      console.error("Room creation failed:", error?.message);
      toast.error(error?.message);
    } finally {
      setLoading(false);
      setFormData({
        amenities: [],
        roomType: "",
        roomName: "",
        price: "",
        images: [],
      });
    }
  };

  if (!open) return;
  return (
    <main className="fixed h-[100vh] w-[100vw] top-0 left-0 bg-black bg-opacity-25 p-5 flex justify-center items-center z-[100]">
      <ToastContainer />
      <div
        className="h-[80vh] flex items-center max-w-lg w-full"
        style={{
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="p-5 bg-white rounded-2xl relative w-full text-sm">
          <div className="flex justify-end">
            <IoClose
              size={25}
              className="cursor-pointer"
              onClick={() => onClose(false)}
            />
          </div>

          <div className="mt-5   flex flex-col gap-3">
            <div>
              <p className="font-medium">Room Name</p>
              <InputField
                name="roomName"
                css="border-2 border-jsPrimary100"
                value={formData.roomName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="font-medium">Room Type</p>
              <InputField
                name="roomType"
                css="border-2 border-jsPrimary100"
                value={formData.roomType}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="font-medium">Price</p>
              <InputField
                name="price"
                css="border-2 border-jsPrimary100"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="font-medium">Amenities</p>
              <div className="flex flex-col gap-1 mt-1">
                {amenities.map((item, index) => (
                  <label
                    key={index}
                    htmlFor={item}
                    className="flex item-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id={item}
                      checked={formData.amenities.includes(item)}
                      onChange={(e) => handleCheckbox(e, item)}
                      className="h-5 w-5 accent-jsPrimary100"
                    />{" "}
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium">Images</p>

              <div className="border border-jsPrimary100 rounded-md w-fit py-2 px-4 mt-1 cursor-pointer">
                <label htmlFor="roomImgs">
                  <input
                    type="file"
                    id="roomImgs"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    // onClick={(e) => (e.target.value = null)}
                  />
                  <div className="flex gap-3 items-center cursor-pointer">
                    <FiPaperclip size={20} />
                    <p>Select Images</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formData.images.length > 0 &&
                formData.images.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="w-full bg-gray-200 rounded-md flex justify-between items-center p-2"
                  >
                    <p>{item.name}</p>
                    <FaRegTrashAlt
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleFileDelete(index)}
                    />
                  </div>
                ))}
            </div>

            <div className="flex justify-end">
              <button
                className={`relative bg-jsPrimary100 rounded-md py-2 px-4 text-white`}
                onClick={handleCreateRoom}
              >
                Create Room
                <div
                  className={`${
                    loading || Object.values(formData).some((e) => e.length < 1)
                      ? "bg-white bg-opacity-50 h-full w-full absolute top-0 left-0 cursor-not-allowed"
                      : "hidden"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateRoomModal;