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
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiSolidShoppingBag } from "react-icons/bi";
import { SiAdblock } from "react-icons/si";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        setShowLogin(false);
        setAdminId("");
        setAdminPass("");
        setError("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: adminId, password: adminPass }),
    });

    if (res.ok) {
      localStorage.setItem("admin", "true");
      alert("✅ Admin logged in!");
      setShowLogin(false);
    } else {
      setError("❌ Invalid ID or Password");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col justify-center min-h-screen w-[414px]" style={{ backgroundColor: "rgba(44, 0, 0, 1)" }}>
        <div className="flex justify-center">
          <Image
            src={"/Logo.png"}
            width={600}
            height={600}
            alt="coffee company logo"
            quality={100}
            unoptimized
            priority
          />
        </div>

        <div className="flex flex-col items-center justify-center mt-[90px]">
          <Link
            href={"/pages/order"}
            className="p-5 bg-black text-black font-bold hover:bg-[#EAB968] hover:scale-110 active:scale-110 rounded-full transition-all duration-300"
          >
            <h1 className="bg-white hover:text-white hover:bg-black rounded-full p-2 transition-all duration-300">
              <BiSolidShoppingBag className="h-[40px] w-[40px]" />
            </h1>
          </Link>
        </div>

        {/* Admin Button & Popup */}
        <div className="fixed flex w-full max-w-[414px] justify-end bottom-0 px-3 pb-3">
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center px-3 py-1.5 font-bold space-x-2 bg-[#EAB968] hover:bg-[#e1ac57] active:scale-110 rounded-tl-xl transition-all"
            >
              <SiAdblock />
              <span>Admin</span>
            </button>

            {showLogin && (
              <div
                ref={modalRef}
                className="bg-white rounded-lg p-4 shadow-lg w-[280px] space-y-2"
              >
                <h2 className="font-bold text-center">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-2">
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Admin ID"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                  >
                    Login
                  </button>
                  {error && (
                    <p className="text-center text-sm text-red-600">{error}</p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
