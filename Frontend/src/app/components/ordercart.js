"use client";

import {
  HiOutlineMinus,
  HiOutlinePlus,
  HiTrash,
} from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import Image from "next/image";

export const OrderCart = ({
  itemsOrder,
  minusButtonHandler,
  plusButtonHandler,
  setCurrentPage,
  deleteItemHandler,
  showModal,
}) => {
  return (
    <>
      {itemsOrder?.map((data) => {
        if (data.amount !== 0) {
          const total = data.price * data.amount;
          return (
            <div
              key={data.id}
              className="flex w-full justify-between px-2 py-3 bg-white text-black border-b space-x-3"
            >
              <div className="flex flex-auto flex-col justify-between overflow-hidden">
                <div className="flex font-semibold">
                  <p>{data.name}</p>
                </div>
                <div className="flex text-green-600 font-semibold">
                  ₹ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </div>
                {data.notes && (
                  <div className="flex text-sm">
                    <p className="font-semibold font-sans">
                      Notes: <span className="font-normal">{data.notes}</span>
                    </p>
                  </div>
                )}
                <div className="flex w-[80px] mt-1 justify-between col-span-1 rounded-full bg-transparent text-white">
                  <button
                    id={data.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      minusButtonHandler(e, data.id);
                    }}
                    className="flex w-[25px] h-[25px] justify-center items-center rounded-full bg-red-600 hover:bg-red-500 active:bg-red-400 transition-all"
                  >
                    <HiOutlineMinus />
                  </button>
                  <p className="text-black font-medium">{data.amount}</p>
                  <button
                    id={data.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      plusButtonHandler(e, data.id);
                    }}
                    className="flex w-[25px] h-[25px] justify-center items-center rounded-full bg-green-600 hover:bg-green-500 active:bg-green-400 transition-all"
                  >
                    <HiOutlinePlus />
                  </button>
                </div>
              </div>
              <div className="flex flex-none justify-center items-center">
                <button
                  id={data.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(e, data.id);
                  }}
                  className="flex p-2 -mr-1 justify-center items-center rounded-full transition text-green-600"
                >
                  <FaRegEdit className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col justify-center items-center space-y-2">
                <Image
                  id={data.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(e, data.id);
                  }}
                  className="max-w-[80px] max-h-[80px] border hover:border-green-400 rounded-xl transition-all"
                  src={data.pic}
                  width={80}
                  height={80}
                  alt="product image"
                  quality={100}
                  unoptimized
                />
              </div>
              <div className="flex flex-none justify-center items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItemHandler(e, data.id);
                  }}
                  className="flex p-1 -mr-2 justify-center items-center rounded-xl transition text-white bg-red-600 hover:bg-red-500 active:bg-red-400"
                >
                  <HiTrash />
                </button>
              </div>
            </div>
          );
        }
      })}

      <div className="flex px-2 py-3 mt-4 text-black border-t border-b justify-between">
        <div className="flex flex-col">
          <h1 className="font-semibold">Want to add more items?</h1>
          <h1>You can add other menu items...</h1>
        </div>
        <div className="flex items-center px-3">
          <button
            onClick={() => {
              setCurrentPage(0);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="px-4 py-2 text-white font-semibold bg-green-600 hover:bg-green-700 active:bg-green-500 rounded-xl transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
};
