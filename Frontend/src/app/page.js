// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { BiSolidShoppingBag } from "react-icons/bi";
// import { SiAdblock } from "react-icons/si";

// export default function Home() {
//   const [alert, setAlert] = useState(false);

//   const modalRef = useRef();

//   useEffect(() => {
//     let handler = (e) => {
//       if (!modalRef.current?.contains(e.target)) {
//         setAlert(false);
//       }
//     };
//     document.addEventListener("click", handler);
//     return () => {
//       document.removeEventListener("click", handler);
//     };
//   }, []);

//   return (
//     <>
//       <div className=" w-full flex justify-center">
//       <div
//   className="flex flex-col justify-center min-h-screen w-[414px] content-center"
//   style={{ backgroundColor: "rgba(44, 0, 0, 1)" }}
// >
//           <div className="flex justify-center ">
//             <Image
//               src={"/./Logo.png"}
//               width={600}
//               height={600}
//               alt="coffee company logo"
//               quality={100}
//               unoptimized
//               priority
//             />
//           </div>
//           <div className="flex flex-col items-center justify-center mt-[90px]">
//             <Link
//               href={"./pages/order"}
//               className="p-5 bg-black text-black font-bold hover:bg-[#EAB968] hover:scale-110 active:scale-110 rounded-full transition-all duration-300"
//             >
//               <h1 className="bg-white hover:text-white hover:bg-black rounded-full p-2 transition-all duration-300">
//                 <BiSolidShoppingBag className="h-[40px] w-[40px]" />
//               </h1>
//             </Link>
//           </div>
//           <div className="fixed flex w-full max-w-[414px] justify-end bottom-0">
//             <div
//               ref={modalRef}
//               className="flex flex-col justify-end items-end space-y-2"
//             >
//               {alert && (
//                 <div className="px-2 py-1 mr-1 text-xs text-center rounded-lg text-red-700 font-bold bg-black transition-all">
//                   <h1 className="animate-pulse">Administrator page is currently under maintenance.</h1>
//                 </div>
//               )}
//               <button
//                 onClick={() => setAlert(true)}
//                 className="flex w-fit justify-center items-center px-3 py-1.5 font-bold space-x-2 bg-[#EAB968] hover:bg-[#e1ac57] active:scale-110 rounded-tl-xl transition-all"
//               >
//                 <SiAdblock />
//                 <h1>Admin</h1>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BiSolidShoppingBag } from "react-icons/bi";
import { SiAdblock } from "react-icons/si";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Home() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        setShowPasswordModal(false);
        setError("");
        setPassword("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (showPasswordModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordModal]);

  const handleAccess = async () => {
    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || ""}/admin/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("isAdmin", "true");
        setShowPasswordModal(false);
        setPassword("");
        setError("");
        router.push("/pages/order");
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      console.error("Failed to verify password", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAccess();
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="flex flex-col justify-center min-h-screen w-[414px] content-center"
        style={{ backgroundColor: "rgba(44, 0, 0, 1)" }}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/Logo.png"
            width={600}
            height={600}
            alt="coffee company logo"
            quality={100}
            unoptimized
            priority
          />
        </div>

        {/* Entry Button */}
        <div className="flex flex-col items-center justify-center mt-[90px]">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="p-5 bg-black text-black font-bold hover:bg-[#EAB968] hover:scale-110 active:scale-110 rounded-full transition-all duration-300"
          >
            <h1 className="bg-white hover:text-white hover:bg-black rounded-full p-2 transition-all duration-300">
              <BiSolidShoppingBag className="h-[40px] w-[40px]" />
            </h1>
          </button>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-xl w-80 shadow-lg space-y-4"
            >
              <h2 className="text-lg font-bold text-center">Enter Access Password</h2>
              <div className="relative">
<input
  ref={inputRef}
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Password"
  className={`w-full border p-2 rounded pr-10 text-black focus:outline-none focus:ring-2 ${
    error ? "border-red-500 ring-red-200" : "border-gray-300 ring-[#EAB968]"
  }`}
/>

                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleAccess}
                  className={`px-4 py-2 font-bold rounded ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#EAB968] hover:bg-[#e1ac57]"
                  }`}
                >
                  {loading ? "Checking..." : "Enter"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                    setError("");
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Button */}
        <div className="fixed flex w-full max-w-[414px] justify-end bottom-0">
          <div className="flex flex-col justify-end items-end space-y-2 p-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex w-fit justify-center items-center px-3 py-1.5 font-bold space-x-2 bg-[#EAB968] hover:bg-[#e1ac57] active:scale-110 rounded-tl-xl transition-all"
            >
              <SiAdblock />
              <h1>Admin</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
