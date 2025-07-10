"use client";
import { useEffect, useState } from "react";
import { RiDiscountPercentFill } from "react-icons/ri";
import { TbCircleArrowRightFilled } from "react-icons/tb";

const arrButton = [10, 20, 30];

export const VoucherPromo = ({
  onClick,
  totalPrice,
  setTotalPrice,
  discountAmount,
  setDiscountAmount,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (discountAmount === 0) {
      setOpen(false);
    }
  }, [discountAmount]);

  useEffect(() => {
    setOpen(false);
  }, [totalPrice]);

  return (
    <>
      <div className="border border-t-0 my-4 text-black rounded-3xl">
        <div
          onClick={() => setOpen(!open)}
          className={`flex px-4 py-4 bg-gradient-to-r ${
            discountAmount ? `from-green-200` : `from-red-200`
          } to-white border rounded-3xl justify-between`}
        >
          <div className="flex justify-center items-center space-x-4">
            <RiDiscountPercentFill
              className={`flex w-7 h-7 ${
                discountAmount ? `fill-green-600` : `fill-red-600`
              }`}
            />
            {discountAmount !== 0 ? (
              <h1 className="font-bold">Discount {discountAmount}% applied</h1>
            ) : (
              <h1 className="font-bold">Check available promo vouchers!</h1>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={onClick}
              className="flex text-white font-semibold rounded-full transition-all"
            >
              <TbCircleArrowRightFilled
                className={`flex w-8 h-8 ${
                  discountAmount
                    ? `fill-green-600 hover:fill-green-700 active:fill-green-500`
                    : `fill-red-600 hover:fill-red-700 active:fill-red-500`
                } duration-400`}
              />
            </button>
          </div>
        </div>
        {open && (
          <div className="flex flex-col px-[17px] py-1 font-semibold transition-all">
            {arrButton?.map((data, idx) => {
              return (
                <button
                  key={idx}
                  id={idx + 1}
                  onClick={() => {
                    window.scrollTo({
                      top: 1000,
                      behavior: "smooth",
                    });
                    setDiscountAmount(data);
                    setOpen(false);
                  }}
                  className={`flex px-3 py-2 text-sm justify-between rounded-xl transition-all ${
                    discountAmount === data
                      ? `bg-green-100`
                      : `hover:bg-green-100`
                  }`}
                >
                  <h1>Discount {data}%</h1>
                  <span>Apply</span>
                </button>
              );
            })}
          </div>
        )}
        {!open && discountAmount !== 0 && (
          <button
            onClick={() => setDiscountAmount(0)}
            className="flex w-full justify-center text-green-700 font-bold px-[17px] py-3 transition-all"
          >
            <h1>Cancel discount</h1>
          </button>
        )}
      </div>
    </>
  );
};
