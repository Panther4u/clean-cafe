"use client";

import { IoCashOutline } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";

export const PaymentCard = ({
  totalPrice,
  discountAmount,
  onChange,
  checked,
  disabled,
  showAlertBuy,
  showAlertChekout,
  onClickToMenu,
  radioChekced,
  setRadioChecked,
  handleChange,
}) => {
  const paymentArr = [
    {
      title: "GPay",
      id: "paymentGpay",
      value: "gpay",
      icon: <FaWallet className="h-4 w-4 text-sky-500" />,
    },
    {
      title: "Cash",
      id: "paymentCash",
      value: "cash",
      icon: <IoCashOutline className="h-4 w-4 text-green-600" />,
    },
  ];

  return (
    <div className="text-black space-y-4 pb-2">
      <div className="font-semibold">Payment Summary</div>
      <div
        className={`flex flex-col p-4 border ${
          discountAmount !== 0 ? `border-green-800` : ``
        } rounded-xl`}
      >
        <div className="flex flex-col pb-3 border-b">
          <div className="flex justify-between">
            <h1>Price ({totalPrice.length} item{totalPrice.length > 1 ? "s" : ""})</h1>
            <h1>
            ₹{" "}
              {totalPrice.amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </h1>
          </div>
          {discountAmount !== 0 && (
            <div className="flex justify-between font-bold text-green-800">
              <h1>Discount ({discountAmount}%)</h1>
              <h1>
                - ₹{" "}
                {((discountAmount / 100) * totalPrice.amount)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </h1>
            </div>
          )}
          <div className="flex justify-between">
            <h1>Tax (included)</h1>
            <h1>₹ 0</h1>
          </div>
          <div className="flex justify-between">
            <h1>Service charge (free)</h1>
            <h1>₹ 0</h1>
          </div>
        </div>
        <div className="flex justify-between pt-3 font-bold">
          <h1>Total Payment</h1>
          <h1>
          ₹{" "}
            {totalPrice.discounted
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </h1>
        </div>
      </div>

      <div className="font-semibold">Payment Method</div>
      <div className="px-2">
        {paymentArr?.map((data, i) => {
          return (
            <div key={i} className="flex items-center mb-4">
              <label
                htmlFor={data.id}
                className="flex w-full items-center text-sm font-medium text-gray-900 dark:text-gray-300 space-x-2"
              >
                <input
                  id={data.id}
                  type="radio"
                  checked={radioChekced === data.value}
                  value={data.value}
                  onChange={handleChange}
                  name="default-radio"
                  className="w-[18px] h-[18px] mr-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                {data.icon}
                <span className="align-top">{data.title}</span>
              </label>
            </div>
          );
        })}
      </div>

      <label className="flex w-full justify-between items-center cursor-pointer">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
          I have reviewed my order
        </span>
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          onChange={onChange}
          checked={checked}
        />
        <div className="me-6 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
      </label>

      {showAlertBuy && (
        <span className={`text-sm font-semibold text-red-600`}>
          Please add items to your order{" "}
          <button onClick={onClickToMenu} className="text-sky-600">
            here
          </button>
        </span>
      )}
      {showAlertChekout && (
        <span className={`text-sm font-semibold text-red-600`}>
          Please review your order before checking out.
        </span>
      )}
    </div>
  );
};
