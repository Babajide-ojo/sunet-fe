"use client";
import AdminLayout from "@/app/components/layout/AdminLayout";
import axios from "axios";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

// Define the BookingDetails type
type BookingDetails = {
  bookingId: string;
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  roomDetails: {
    roomType: {
      roomName: string;
      roomType: string;
    };
    checkinDate: string;
    checkOutDate: string;
  };
  total_price: number;
  status: string;
};

// Define the ModalProps type
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
};

// Modal component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            className="py-2 px-4 border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Booking: React.FC = () => {
  const router = useRouter();
  const param = useParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [bookingStataus, setBookingStatus] = useState<any>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


  const getSingleBooking = async () => {
    try {
      const response = await axios.get(
        `https://sunet-be-6812.onrender.com/api/rooms/booking/${param.id}`
      );
      setBooking(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleBooking();
  }, []);

  const handleCancelBooking = async () => {
    try {
      await axios.put(
        `https://sunet-be-6812.onrender.com/api/rooms/booking/${param.id}`, {
          status : "cancelled"
        }
      );
      setIsCancelModalOpen(false);
      getSingleBooking();
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      await axios.put(
        `https://sunet-be-6812.onrender.com/api/rooms/booking/${param.id}`, {
          status : "confirmed"
        }
      );
      setIsConfirmModalOpen(false);
      getSingleBooking();
    } catch (error) {
      console.log(error);
    }
  };

  const colors = (status: any) => {
    switch (status) {
      case "cancelled":
        return "bg-red-100 text-red-500";
      case "completed":
        return "bg-green-100 text-green-500";
      default:
        return "bg-yellow-100 text-yellow-500";
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <FaArrowLeft
            size={20}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <div className="flex items-center gap-5">
            <button
              className="py-2 px-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Booking
            </button>
            <button
              className="py-2 px-4 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              Confirm Booking
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Booked Room</h2>

        <div className="mt-10 flex flex-col gap-5">
          <div className="">
            <p className="font-semibold">Booking ID:</p>
            <p>{booking?.bookingId}</p>
          </div>
          <div className="">
            <p className="font-semibold">Customer Name:</p>
            <p>
              {booking?.userDetails?.firstName} {booking?.userDetails?.lastName}
            </p>
          </div>
          <div className="">
            <p className="font-semibold">Email:</p>
            <p>{booking?.userDetails?.email}</p>
          </div>
          <div className="">
            <p className="font-semibold">Phone Number:</p>
            <p>{booking?.userDetails?.phoneNumber}</p>
          </div>
          <div className="">
            <p className="font-semibold">Room Name:</p>
            <p>{booking?.roomDetails?.roomType?.roomName}</p>
          </div>
          <div className="">
            <p className="font-semibold">Room Type:</p>
            <p>{booking?.roomDetails?.roomType?.roomType}</p>
          </div>
          <div className="">
            <p className="font-semibold">Checkin Date:</p>
            <p>
              {booking?.roomDetails?.checkinDate &&
                format(new Date(booking.roomDetails.checkinDate), "PPP")}
            </p>
          </div>
          <div className="">
            <p className="font-semibold">Checkout Date:</p>
            <p>
              {booking?.roomDetails?.checkOutDate &&
                format(new Date(booking.roomDetails.checkOutDate), "PPP")}
            </p>
          </div>
          <div className="">
            <p className="font-semibold">Total:</p>
            <p>{booking?.total_price}</p>
          </div>
          <div className="">
            <p className="font-semibold">Status:</p>
            <p
              className={`text-sm py-1 px-2 w-fit rounded-md capitalize ${colors(
                booking?.status
              )}`}
            >
              {booking?.status}
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        title="Confirm Cancellation"
      >
        <p>Are you sure you want to cancel this booking?</p>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
        title="Confirm Booking"
      >
        <p>Are you sure you want to confirm this booking?</p>
      </Modal>
    </AdminLayout>
  );
};

export default Booking;
