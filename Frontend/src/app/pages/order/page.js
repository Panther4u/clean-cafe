// "use client";
// import { useEffect, useRef, useState } from "react";
// import Header from "../../components/header";
// import { TabMenu } from "@/app/components/tabmenu";
// import { MenuCards } from "@/app/components/menucards";
// import { Spinner } from "flowbite-react";
// import { Footer } from "@/app/components/footer";
// import { ModalCard } from "@/app/components/modalcard";
// import { PaymentCard } from "@/app/components/paymentcard";
// import { VoucherPromo } from "@/app/components/voucherpromo";
// import { Done } from "@/app/components/done";
// import { OrderCart } from "@/app/components/ordercart";
// import { motion as m } from "framer-motion";
// import allMenuItems from "@/app/data/menuItems";


// const menusType = [
//   "All",
//   "Coffee",
//   "Non Coffee",
//   "Dessert",
//   "Manual Brew",
//   "Water",
//   "Foods",
// ];

// const $Page = ["Order", "Best Seller", "Cart", "Logout"];

// export default function Order() {
//   const [itemsOrder, setItemsOrder] = useState([]);
//   const [totalPrice, setTotalPrice] = useState({
//     amount: 0,
//     length: 0,
//     discounted: 0,
//   });
//   const [currentPage, setCurrentPage] = useState(0);
//   const [menuCards, setMenuCards] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [detailModal, setDetailModal] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [approved, setApproved] = useState({
//     value: false,
//     alertBuy: false,
//     alertChekout: false,
//   });
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [checkout, setCheckout] = useState({
//     order: [],
//     totalPrice: 0,
//     finalPrice: 0,
//     payment: "",
//   }); //this must be for Redux, but not now
//   const [radioChekced, setRadioChecked] = useState("gopay");
//   const [done, setDone] = useState(false); //this must be for Redux, but not now
//   const modalRef = useRef();
  
//     // const getDataMenu = async () => {
//     //   try {
//     //     const request = await fetch(`https://sri-kandhan-cafe.onrender.com/menu`);
//     //     if (!request.ok) {
//     //       throw new Error(`HTTP error! status: ${request.status}`);
//     //     }
//     //     const response = await request.json();
//     //     setItemsOrder(response);
//     //     setIsLoading(false);
//     //   } catch (error) {
//     //     console.error("Error fetching menu data:", error);
//     //   }
//     // };
//     const getDataMenu = async () => {
//   try {
//     const request = await fetch(`https://sri-kandhan-cafe.onrender.com/menu`);
//     if (!request.ok) {
//       throw new Error(`HTTP error! status: ${request.status}`);
//     }
//     const response = await request.json();
//     setItemsOrder(response);
//     setIsLoading(false);
//   } catch (error) {
//     console.error("Error fetching menu data:", error);
//   }
// };


//   // useEffect(() => {
//   //   getDataMenu();
//   // }, []);
// useEffect(() => {
//   setItemsOrder(allMenuItems);
//   setIsLoading(false);
// }, []);
//   useEffect(() => {
//     if (currentPage === 0 || currentPage === 1) {
//       setApproved({ value: false, alertBuy: false, alertChekout: false });
//     }
//   }, [currentPage]);

//   useEffect(() => {
//     setTotalPrice((t) => ({ ...t, discounted: totalPrice.amount }));
//   }, [totalPrice.amount]);

//   useEffect(() => {
//     const discountedPrice = (totalPrice.amount * discountAmount) / 100;
//     setTotalPrice({
//       ...totalPrice,
//       discounted: totalPrice.amount - discountedPrice,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [discountAmount]);

//   const tabMenuHandler = (e) => {
//     e.preventDefault();
//     setMenuCards(e.target.id);
//   };

//   const plusButtonHandler = (e, idButton = null) => {
//     e.preventDefault();
//     const filteredItems = itemsOrder?.map((data, idx) => {
//       if (idButton) {
//         if (data.id === idButton) {
//           setTotalPrice({
//             ...totalPrice,
//             amount: totalPrice.amount + data.price,
//             length: totalPrice.length + 1,
//           });
//           setApproved({ ...approved, value: false });
//           setDiscountAmount(0);
//           return { ...data, amount: data.amount + 1 };
//         }
//       }
//       if (data.id === e.target.id) {
//         setTotalPrice({
//           ...totalPrice,
//           amount: totalPrice.amount + data.price,
//           length: totalPrice.length + 1,
//         });
//         setApproved({ ...approved, alertChekout: false });
//         setDiscountAmount(0);
//         return { ...data, amount: data.amount + 1 };
//       }
//       return data;
//     });
//     setItemsOrder(filteredItems);
//   };

//   const minusButtonHandler = (e, idButton = null) => {
//     e.preventDefault();
//     const filteredItems = itemsOrder?.map((data, idx) => {
//       if (idButton) {
//         if (data.id === idButton && data.amount > 0) {
//           setTotalPrice({
//             ...totalPrice,
//             amount: totalPrice.amount - data.price,
//             length: totalPrice.length - 1,
//           });
//           setApproved({ ...approved, value: false });
//           setDiscountAmount(0);
//           if (totalPrice.length === 1 && currentPage === 2) {
//             setCurrentPage(0);
//             setMenuCards(0);
//           }
//           if (data.amount === 1) {
//             return { ...data, amount: data.amount - 1, notes: "" };
//           }
//           return { ...data, amount: data.amount - 1 };
//         }
//       }
//       if (data.id === e.target.id && data.amount > 0) {
//         setTotalPrice({
//           ...totalPrice,
//           amount: totalPrice.amount - data.price,
//           length: totalPrice.length - 1,
//         });
//         setDiscountAmount(0);
//         return { ...data, amount: data.amount - 1 };
//       }
//       return data;
//     });
//     setItemsOrder(filteredItems);
//   };

//   const deleteItemHandler = (e, idButton = null) => {
//     e.preventDefault();
//     const filteredItems = itemsOrder?.map((data, idx) => {
//       if (idButton) {
//         if (data.id == idButton && data.amount > 0) {
//           const dataPrice = data.amount * data.price;
//           setTotalPrice({
//             ...totalPrice,
//             amount: totalPrice.amount - dataPrice,
//             length: totalPrice.length - data.amount,
//           });
//           setApproved({ ...approved, value: false });
//           setDiscountAmount(0);
//           if (totalPrice.length === data.amount) {
//             setCurrentPage(0);
//             setMenuCards(0);
//           }
//           return { ...data, amount: data.amount - data.amount, notes: "" };
//         }
//       }
//       return data;
//     });
//     setItemsOrder(filteredItems);
//   };

//   const showModal = (e, dataId) => {
//     e.preventDefault();
//     setOpenModal(true);
//     itemsOrder.map((data, idx) => {
//       if (data.id == e.target.id) {
//         setDetailModal(data);
//       }
//       if (data.id == dataId) {
//         setDetailModal(data);
//       }
//     });
//   };

//   const closeModal = (e, modalId) => {
//     const filteredItem = itemsOrder.map((data, i) => {
//       if (data.id === modalId) {
//         return { ...data, notes: detailModal?.notes };
//       }
//       return data;
//     });
//     setItemsOrder(filteredItem);
//     setOpenModal(false);
//   };


//   const handleChange = (event) => {
//     setRadioChecked(event.target.value);
//   };

//   const toggleHandler = (e) => {
//     if (totalPrice.length !== 0) {
//       setApproved({ ...approved, value: !approved.value, alertChekout: false });
//     } else {
//       setApproved({ ...approved, alertBuy: true });
//     }
//   };

//   const footerHandler = () => {
//     if (approved.value) {
//       const updatedCheckout = itemsOrder.filter((item) => item.amount !== 0);
//       setCheckout({
//         order: updatedCheckout,
//         totalPrice: totalPrice.amount,
//         finalPrice: totalPrice.discounted,
//         payment: radioChekced,
//       });
//       setDone(true);
//     } else {
//       setCurrentPage(2);
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     }
//     if (currentPage === 2 && approved.value === false) {
//       setApproved({ ...approved, alertChekout: true });
//       window.scrollTo({
//         top: 1000,
//         behavior: "smooth",
//       });
//     }
//   };
  
//   // console.log("checkout ===>", checkout )

  // return (
  //   <>
  //     <title>Coffee Ordering Mobile Web by Hassan Kaeru</title>
  //     {done ? (
  //       <Done
  //         checkout={checkout}
  //         discountAmount={discountAmount}
  //         totalPrice={totalPrice}
  //       />
  //     ) : (
  //       <div className=" z-30 flex w-full justify-center">
  //         <m.div className="flex max-w-[414px] justify-center font-sans">
  //           {/* ============ HEADER ============ */}
  //           <Header
  //             page={$Page[currentPage]}
  //             totalPrice={totalPrice.length}
  //             onClickOrder={() => {
  //               setCurrentPage(0);
  //               setMenuCards(0);
  //               window.scrollTo({
  //                 top: 0,
  //                 behavior: "smooth",
  //               });
  //             }}
  //             onClickFavorite={() => {
  //               setCurrentPage(1);
  //               window.scrollTo({
  //                 top: 0,
  //                 behavior: "smooth",
  //               });
  //             }}
  //             onClickCart={() => {
  //               setCurrentPage(2);
  //               window.scrollTo({
  //                 top: 0,
  //                 behavior: "smooth",
  //               });
  //             }}
  //           />
  //           {/* ====== FOOTER (Total Price) ===== */}
  //           {totalPrice.length !== 0 && (
  //             <Footer
  //               page={currentPage}
  //               totalPrice={totalPrice}
  //               onClick={footerHandler}
  //             />
  //           )}
  //           <div className="w-screen min-h-screen mt-[51px] bg-[#FFFFFF]">
  //             {/* ========== SPA Render Components ========= */}
  //             <div className="w-full max-w-[414px] p-3 pb-[62px] h-full space-y-3 overflow-hidden">
  //               {currentPage == 0 ? (
  //                 <>
  //                   <TabMenu
  //                     menusType={menusType}
  //                     menuCards={menuCards}
  //                     onClick={(e) => tabMenuHandler(e)}
  //                   />
  //                   {/* ===== Order Section ===== */}
  //                   {isLoading && (
  //                     <m.div>
  //                       <div className=" flex h-screen -mt-[108px] w-full justify-center items-center">
  //                         <Spinner
  //                           color="success"
  //                           aria-label="Success spinner example"
  //                           className=""
  //                         />
  //                       </div>
  //                     </m.div>
  //                   )}
  //                   <m.div
  //                     initial={{ x: "-100%" }}
  //                     animate={{ x: "0%" }}
  //                     transition={{ duration: 0.3, ease: "easeOut" }}
  //                     className="z-10 grid grid-cols-1 gap-2 "
  //                   >
  //                     <div className="grid grid-cols-2 gap-3">
  //                       {/* ===== Order Cards ===== */}
  //                       {itemsOrder?.map((data, idx) => {
  //                         return menuCards == 0 ? (
  //                           <MenuCards
  //                             key={idx}
  //                             onClickModal={showModal}
  //                             data={data}
  //                             onClickMinus={minusButtonHandler}
  //                             onClickPlus={plusButtonHandler}
  //                           />
  //                         ) : (
  //                           menuCards == data?.type && (
  //                             <MenuCards
  //                               key={idx}
  //                               onClickModal={showModal}
  //                               data={data}
  //                               onClickMinus={minusButtonHandler}
  //                               onClickPlus={plusButtonHandler}
  //                             />
  //                           )
  //                         );
  //                       })}
  //                     </div>
  //                   </m.div>
  //                 </>
  //               ) : currentPage == 1 ? (
  //                 <m.div
  //                   initial={{ x: "100%" }}
  //                   animate={{ x: "0%" }}
  //                   transition={{ duration: 0.3, ease: "easeOut" }}
  //                   className="grid grid-cols-2 gap-3"
  //                 >
  //                   {itemsOrder?.map((data, idx) => {
  //                     return (
  //                       <>
  //                         {data.favorite && (
  //                           <MenuCards
  //                             onClickModal={showModal}
  //                             data={data}
  //                             onClickMinus={minusButtonHandler}
  //                             onClickPlus={plusButtonHandler}
  //                           />
  //                         )}
  //                       </>
  //                     );
  //                   })}
  //                 </m.div>
  //               ) : (
  //                 currentPage == 2 && (
  //                   // ====================== PAGE CART ===================
  //                   <div className="flex flex-col">
  //                     <m.div
  //                       initial={{ x: "100%" }}
  //                       animate={{ x: "0%" }}
  //                       transition={{ duration: 0.3, ease: "easeOut" }}
  //                       className="flex flex-col"
  //                     >
  //                       {totalPrice?.amount !== 0 ? (
  //                         <>
  //                           <OrderCart
  //                             itemsOrder={itemsOrder}
  //                             minusButtonHandler={minusButtonHandler}
  //                             plusButtonHandler={plusButtonHandler}
  //                             setCurrentPage={setCurrentPage}
  //                             deleteItemHandler={deleteItemHandler}
  //                             showModal={showModal}
  //                           />
  //                           <VoucherPromo
  //                             totalPrice={totalPrice}
  //                             setTotalPrice={setTotalPrice}
  //                             discountAmount={discountAmount}
  //                             setDiscountAmount={setDiscountAmount}
  //                             onClick={() => {
  //                               setCurrentPage(2);
  //                               window.scrollTo({
  //                                 top: 1000,
  //                                 behavior: "smooth",
  //                               });
  //                             }}
  //                           />
  //                         </>
  //                       ) : (
  //                         ""
  //                       )}
  //                     </m.div>
  //                     <m.div
  //                       initial={{ x: "100%" }}
  //                       animate={{ x: "0%" }}
  //                       transition={{ duration: 0.3, ease: "easeOut" }}
  //                     >
  //                       <PaymentCard
  //                         radioChekced={radioChekced}
  //                         setRadioChecked={setRadioChecked}
  //                         handleChange={handleChange}
  //                         totalPrice={totalPrice}
  //                         onChange={(e) => toggleHandler(e)}
  //                         checked={approved.value}
  //                         showAlertBuy={approved.alertBuy}
  //                         showAlertChekout={approved.alertChekout}
  //                         onClickToMenu={() => setCurrentPage(0)}
  //                         discountAmount={discountAmount}
  //                       />
  //                     </m.div>
  //                   </div>
  //                 )
  //               )}
  //             </div>
  //             {/* ======= MODAL ======= */}
  //             <ModalCard
  //               detailModal={detailModal}
  //               show={openModal}
  //               setDetailModal={setDetailModal}
  //               onClick={(e) => closeModal(e, detailModal?.id)}
  //               onClose={(e) => closeModal(e, detailModal?.id)}
  //               autoFocus={false}
  //             />
  //           </div>
  //         </m.div>
  //       </div>
  //     )}
  //   </>
//   );
// }




"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion as m } from "framer-motion";
import Header from "../../components/header";
import { TabMenu } from "@/app/components/tabmenu";
import { MenuCards } from "@/app/components/menucards";
import { Spinner } from "flowbite-react";
import { Footer } from "@/app/components/footer";
import { ModalCard } from "@/app/components/modalcard";
import { PaymentCard } from "@/app/components/paymentcard";
import { VoucherPromo } from "@/app/components/voucherpromo";
import { Done } from "@/app/components/done";
import { OrderCart } from "@/app/components/ordercart";
import AddProductForm from "@/app/components/addproductform";
import SalesSummary from "@/app/components/salessummary";
import withAdminAuth from "@/app/lib/withAdminAuth";
import DailyReport from "@/app/components/dailyreport";
import DailyExpenseTracker from "@/app/components/DailyExpenseTracker";

const menusType = [
  "All", "Tea", "Coffee", "Dairy Products", "Snacks",
  "Fresh Juice", "Juice", "Ice Cream", "Karupatti Ice Cream",
  "Karupatti Snacks", "Others"
];

const $Page = [
  "Order", "Best Seller", "Cart", "Add Product",
  "Sales Summary", "Daily Report", "Daily Expense Tracker", "View Receipts"
];

function Order() {
  const router = useRouter();
  const [allItems, setAllItems] = useState([]);
  const [itemsOrder, setItemsOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState({ amount: 0, length: 0, discounted: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [menuCards, setMenuCards] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checkout, setCheckout] = useState({ order: [], totalPrice: 0, finalPrice: 0, payment: "" });
  const [radioChekced, setRadioChecked] = useState("");
  const [done, setDone] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchedRef = useRef(false);

const fetchItems = async () => {
  if (fetchedRef.current) return;
  fetchedRef.current = true;
  try {
    const res = await fetch("/items.json");
    const json = await res.json();

    const itemsObject = json.data;
    const items = Object.values(itemsObject); // Convert object to array

    console.log("✅ MENU FETCHED FROM LOCAL FILE:", items);

    if (Array.isArray(items)) {
      const initialized = items.map(item => ({
        ...item,
        amount: 0,
        notes: "",
      }));
      setAllItems(initialized);
      setItemsOrder(initialized);
      setMenuLoaded(true);
    } else {
      console.error("❌ Local file response is not an array:", items);
    }
  } catch (err) {
    console.error("❌ Failed to load items.json:", err);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setTotalPrice(t => ({ ...t, discounted: t.amount }));
  }, [totalPrice.amount]);

  useEffect(() => {
    const discountValue = (totalPrice.amount * discountAmount) / 100;
    setTotalPrice(t => ({ ...t, discounted: t.amount - discountValue }));
  }, [discountAmount]);

  useEffect(() => {
    if (searchText && currentPage !== 0) setCurrentPage(0);
  }, [searchText]);

  const tabMenuHandler = (e) => {
    e.preventDefault();
    setMenuCards(e.target.id);
  };

  const plusButtonHandler = (_e, id) => {
    const updated = itemsOrder.map(item => {
      if (item.id === id) {
        setTotalPrice(t => ({ ...t, amount: t.amount + item.price, length: t.length + 1 }));
        setDiscountAmount(0);
        return { ...item, amount: item.amount + 1 };
      }
      return item;
    });
    setItemsOrder(updated);
  };

  const minusButtonHandler = (_e, id) => {
    const updated = itemsOrder.map(item => {
      if (item.id === id && item.amount > 0) {
        setTotalPrice(t => ({ ...t, amount: t.amount - item.price, length: t.length - 1 }));
        setDiscountAmount(0);
        return { ...item, amount: item.amount - 1 };
      }
      return item;
    });
    setItemsOrder(updated);
  };

  const deleteItemHandler = (e, idButton) => {
    e.preventDefault();
    const updated = itemsOrder.map(item => {
      if (item.id === idButton && item.amount > 0) {
        const total = item.amount * item.price;
        setTotalPrice(t => ({ ...t, amount: t.amount - total, length: t.length - item.amount }));
        return { ...item, amount: 0, notes: "" };
      }
      return item;
    });
    setItemsOrder(updated);
  };

  const showModal = (e, dataId) => {
    e.preventDefault();
    setOpenModal(true);
    const id = dataId || e.target.id;
    const found = itemsOrder.find(item => item.id == id);
    if (found) setDetailModal(found);
  };

  const closeModal = (_e, modalId) => {
    const updated = itemsOrder.map(item => item.id === modalId ? { ...item, notes: detailModal?.notes } : item);
    setItemsOrder(updated);
    setOpenModal(false);
  };

  const footerHandler = () => {
    const orderItems = itemsOrder.filter(item => item.amount > 0);
    if (orderItems.length === 0 || !radioChekced) {
      setCurrentPage(2);
      window.scrollTo({ top: 1000, behavior: "smooth" });
      return;
    }
    setCheckout({ order: orderItems, totalPrice: totalPrice.amount, finalPrice: totalPrice.discounted, payment: radioChekced });
    setDone(true);
  };

  const handleChange = (e) => setRadioChecked(e.target.value);

  const resetOrderState = () => {
    const reset = allItems.map(item => ({ ...item, amount: 0, notes: "" }));
    setItemsOrder(reset);
    setTotalPrice({ amount: 0, length: 0, discounted: 0 });
    setDiscountAmount(0);
    setRadioChecked("");
    setCheckout({ order: [], totalPrice: 0, finalPrice: 0, payment: "" });
    setDone(false);
    setCurrentPage(0);
    setSearchText("");
  };

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = menuCards == 0 || item.type === parseInt(menuCards);
    return searchText.length > 0 ? matchesSearch : matchesType;
  }).map(item => {
    const matchedOrder = itemsOrder.find(o => o.id === item.id);
    return { ...item, amount: matchedOrder?.amount || 0, notes: matchedOrder?.notes || "" };
  });

  return (
    <>
      <title>Coffee Ordering Mobile Web</title>
      {done ? (
        <Done checkout={checkout} discountAmount={discountAmount} totalPrice={totalPrice} onNewOrder={resetOrderState} />
      ) : (
        <div className="z-30 flex w-full justify-center">
          <m.div className="flex w-full max-w-md md:max-w-4xl mx-auto justify-center font-sans">
            <Header
              page={$Page[currentPage]}
              totalPrice={totalPrice.length}
              onClickOrder={() => { setCurrentPage(0); setMenuCards(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onClickFavorite={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onClickCart={() => { setCurrentPage(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              searchText={searchText}
              setSearchText={setSearchText}
              setCurrentPage={setCurrentPage}
              allMenuItems={allItems}
            />

            {totalPrice.length !== 0 && <Footer page={currentPage} totalPrice={totalPrice} onClick={footerHandler} />}

            <div className="w-screen min-h-screen mt-[52px] bg-white">
              <div className="w-full max-w-md md:max-w-4xl mx-auto p-3 pb-[62px] space-y-3">
                {currentPage === 0 && (
                  <>
                    <TabMenu menusType={menusType} menuCards={menuCards} onClick={tabMenuHandler} />
                    {!menuLoaded ? (
                      <div className="flex h-screen items-center justify-center">
                        <Spinner color="success" />
                      </div>
                    ) : (
                      <m.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5">
                        {filteredItems.map((data, idx) => (
                          <MenuCards
                            key={idx}
                            onClickModal={showModal}
                            data={data}
                            onClickMinus={minusButtonHandler}
                            onClickPlus={plusButtonHandler}
                            searchText={searchText}
                          />
                        ))}
                      </m.div>
                    )}
                  </>
                )}

                {currentPage === 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {itemsOrder.filter(item => item.favorite).map((data, idx) => (
                      <MenuCards key={idx} onClickModal={showModal} data={data} onClickMinus={minusButtonHandler} onClickPlus={plusButtonHandler} />
                    ))}
                  </div>
                )}

                {currentPage === 2 && (
                  <div className="flex flex-col">
                    <OrderCart itemsOrder={itemsOrder} minusButtonHandler={minusButtonHandler} plusButtonHandler={plusButtonHandler} setCurrentPage={setCurrentPage} deleteItemHandler={deleteItemHandler} showModal={showModal} />
                    <VoucherPromo totalPrice={totalPrice} setTotalPrice={setTotalPrice} discountAmount={discountAmount} setDiscountAmount={setDiscountAmount} />
                    <PaymentCard radioChekced={radioChekced} setRadioChecked={setRadioChecked} handleChange={handleChange} totalPrice={totalPrice} discountAmount={discountAmount} onClickToMenu={() => setCurrentPage(0)} />
                  </div>
                )}

                {currentPage === 3 && (
                  <div className="p-4 max-w-xl mx-auto">
                    <h1 className="text-xl font-bold mb-4">Add New Product</h1>
                    <AddProductForm onProductAdded={(newItem) => {
                      const extended = [...allItems, { ...newItem, amount: 0, notes: "" }];
                      setAllItems(extended);
                      setItemsOrder(extended);
                      localStorage.setItem("menuCache", JSON.stringify(extended));
                    }} />
                  </div>
                )}

                {currentPage === 4 && <SalesSummary />}
                {currentPage === 5 && <DailyReport onBack={() => setCurrentPage(0)} allMenuItems={allItems} setCurrentPage={setCurrentPage} />}
                {currentPage === 6 && <div className="p-4 max-w-4xl mx-auto mt-16"><DailyExpenseTracker selectedDate={new Date().toISOString().split("T")[0]} /></div>}
              </div>

              <ModalCard detailModal={detailModal} show={openModal} setDetailModal={setDetailModal} onClick={(e) => closeModal(e, detailModal?.id)} onClose={(e) => closeModal(e, detailModal?.id)} />
            </div>
          </m.div>
        </div>
      )}
    </>
  );
}

export default withAdminAuth(Order);



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Header from "../../components/header";
// import { TabMenu } from "@/app/components/tabmenu";
// import { MenuCards } from "@/app/components/menucards";
// import { Spinner } from "flowbite-react";
// import { Footer } from "@/app/components/footer";
// import { ModalCard } from "@/app/components/modalcard";
// import { PaymentCard } from "@/app/components/paymentcard";
// import { VoucherPromo } from "@/app/components/voucherpromo";
// import { Done } from "@/app/components/done";
// import { OrderCart } from "@/app/components/ordercart";
// import { motion as m } from "framer-motion";
// import AddProductForm from "@/app/components/addproductform";
// import SalesSummary from "@/app/components/salessummary";
// import withAdminAuth from "@/app/lib/withAdminAuth";
// import DailyReport from "@/app/components/dailyreport";
// import DailyExpenseTracker from "@/app/components/DailyExpenseTracker";

// // ✅ Environment API
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// // ✅ Tabs and Page Labels
// const menusType = [
//   "All", "Tea", "Coffee", "Dairy Products", "Snacks", "Fresh Juice", "Juice",
//   "Ice Cream", "Karupatti Ice Cream", "Karupatti Snacks", "Others",
// ];

// const $Page = [
//   "Order", "Best Seller", "Cart", "Add Product",
//   "Sales Summary", "Daily Report", "Daily Expense Tracker", "View Receipts"
// ];

// function Order() {
//   const router = useRouter();

//   const [allItems, setAllItems] = useState([]);
//   const [itemsOrder, setItemsOrder] = useState([]);
//   const [totalPrice, setTotalPrice] = useState({ amount: 0, length: 0, discounted: 0 });

//   const [currentPage, setCurrentPage] = useState(0);
//   const [menuCards, setMenuCards] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const [detailModal, setDetailModal] = useState(null);
//   const [openModal, setOpenModal] = useState(false);

//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [checkout, setCheckout] = useState({ order: [], totalPrice: 0, finalPrice: 0, payment: "" });

//   const [radioChekced, setRadioChecked] = useState("");
//   const [done, setDone] = useState(false);
//   const [searchText, setSearchText] = useState("");

//   // ✅ Load menu items on initial mount
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/menu/all`);
//         const data = await res.json();
//         const initialized = data.map(item => ({ ...item, amount: 0, notes: "" }));
//         setAllItems(initialized);
//         setItemsOrder(initialized);
//       } catch (err) {
//         console.error("❌ Failed to fetch items:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   // ✅ Sync discounted price to `amount`
//   useEffect(() => {
//     setTotalPrice(t => ({ ...t, discounted: t.amount }));
//   }, [totalPrice.amount]);

//   // ✅ Apply discount % to total
//   useEffect(() => {
//     const discountedPrice = (totalPrice.amount * discountAmount) / 100;
//     setTotalPrice(t => ({ ...t, discounted: t.amount - discountedPrice }));
//   }, [discountAmount, totalPrice.amount]);

//   // ✅ If user is searching, go back to page 0
//   useEffect(() => {
//     if (searchText && currentPage !== 0) {
//       setCurrentPage(0);
//     }
//   }, [searchText, currentPage]);

//   // ✅ Handlers
//   const tabMenuHandler = (e) => {
//     e.preventDefault();
//     setMenuCards(e.target.id);
//   };

//   const plusButtonHandler = (e, idButton = null) => {
//     e.preventDefault();
//     const id = idButton || e.target.id;
//     const updated = itemsOrder.map(item => {
//       if (item.id === id) {
//         setTotalPrice(t => ({ ...t, amount: t.amount + item.price, length: t.length + 1 }));
//         setDiscountAmount(0);
//         return { ...item, amount: item.amount + 1 };
//       }
//       return item;
//     });
//     setItemsOrder(updated);
//   };

//   const minusButtonHandler = (e, idButton = null) => {
//     e.preventDefault();
//     const id = idButton || e.target.id;
//     const updated = itemsOrder.map(item => {
//       if (item.id === id && item.amount > 0) {
//         setTotalPrice(t => ({ ...t, amount: t.amount - item.price, length: t.length - 1 }));
//         setDiscountAmount(0);
//         return { ...item, amount: item.amount - 1 };
//       }
//       return item;
//     });
//     setItemsOrder(updated);
//   };

//   const deleteItemHandler = (e, idButton) => {
//     e.preventDefault();
//     const updated = itemsOrder.map(item => {
//       if (item.id === idButton && item.amount > 0) {
//         const total = item.amount * item.price;
//         setTotalPrice(t => ({ ...t, amount: t.amount - total, length: t.length - item.amount }));
//         return { ...item, amount: 0, notes: "" };
//       }
//       return item;
//     });
//     setItemsOrder(updated);
//   };

//   const showModal = (e, dataId) => {
//     e.preventDefault();
//     setOpenModal(true);
//     const id = dataId || e.target.id;
//     const found = itemsOrder.find(item => item.id === id);
//     if (found) setDetailModal(found);
//   };

//   const closeModal = (e, modalId) => {
//     const updated = itemsOrder.map(item =>
//       item.id === modalId ? { ...item, notes: detailModal?.notes } : item
//     );
//     setItemsOrder(updated);
//     setOpenModal(false);
//   };

//   const footerHandler = () => {
//     const orderItems = itemsOrder.filter(item => item.amount > 0);
//     if (orderItems.length === 0 || !radioChekced) {
//       setCurrentPage(2);
//       window.scrollTo({ top: 1000, behavior: "smooth" });
//       return;
//     }

//     setCheckout({
//       order: orderItems,
//       totalPrice: totalPrice.amount,
//       finalPrice: totalPrice.discounted,
//       payment: radioChekced,
//     });
//     setDone(true);
//   };

//   const handleChange = (e) => {
//     setRadioChecked(e.target.value);
//   };

//   const resetOrderState = () => {
//     const reset = allItems.map(item => ({ ...item, amount: 0, notes: "" }));
//     setItemsOrder(reset);
//     setTotalPrice({ amount: 0, length: 0, discounted: 0 });
//     setDiscountAmount(0);
//     setRadioChecked("");
//     setCheckout({ order: [], totalPrice: 0, finalPrice: 0, payment: "" });
//     setDone(false);
//     setCurrentPage(0);
//     setSearchText("");
//   };

//   const handleProductAdded = (newItem) => {
//     const extended = [...allItems, { ...newItem, amount: 0, notes: "" }];
//     setAllItems(extended);
//     setItemsOrder(extended);
//   };

//   const AddProductPage = () => (
//     <div className="p-4 max-w-xl mx-auto">
//       <h1 className="text-xl font-bold mb-4">Add New Product</h1>
//       <AddProductForm onProductAdded={handleProductAdded} />
//     </div>
//   );

//   const filteredItems = allItems.map(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
//     const matchesType = menuCards == 0 || item.type === parseInt(menuCards);
//     const show = searchText.length > 0 ? matchesSearch : matchesType;
//     if (!show) return null;

//     const matchedOrder = itemsOrder.find(o => o.id === item.id);
//     return {
//       ...item,
//       amount: matchedOrder?.amount || 0,
//       notes: matchedOrder?.notes || "",
//     };
//   }).filter(Boolean);

//   // ✅ Final JSX
//   return (
//     <>
//       <title>Coffee Ordering Mobile Web</title>
//       {done ? (
//         <Done
//           checkout={checkout}
//           discountAmount={discountAmount}
//           totalPrice={totalPrice}
//           onNewOrder={resetOrderState}
//         />
//       ) : (
//         <div className="z-30 flex w-full justify-center">
//           <m.div className="w-full max-w-md md:max-w-4xl mx-auto font-sans">
//             <Header
//               page={$Page[currentPage]}
//               totalPrice={totalPrice.length}
//               onClickOrder={() => { setCurrentPage(0); setMenuCards(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
//               onClickFavorite={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
//               onClickCart={() => { setCurrentPage(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
//               searchText={searchText}
//               setSearchText={setSearchText}
//               setCurrentPage={setCurrentPage}
//               allMenuItems={allItems}
//             />

//             {totalPrice.length !== 0 && (
//               <Footer page={currentPage} totalPrice={totalPrice} onClick={footerHandler} />
//             )}

//             <div className="w-screen min-h-screen mt-[52px] bg-white">
//               <div className="w-fullmax-w-md md:max-w-4xl mx-auto p-3 pb-[62px] space-y-3 overflow-auto md:overflow-visible">

//                 {currentPage === 0 && (
//                   <>
//                     <TabMenu menusType={menusType} menuCards={menuCards} onClick={tabMenuHandler} />
//                     {isLoading ? (
//                       <div className="flex h-screen items-center justify-center">
//                         <Spinner color="success" />
//                       </div>
//                     ) : (
//                       <m.div
//                         className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         {filteredItems.map((data, idx) => (
//                           <MenuCards
//                             key={idx}
//                             onClickModal={showModal}
//                             data={data}
//                             onClickMinus={minusButtonHandler}
//                             onClickPlus={plusButtonHandler}
//                             searchText={searchText}
//                           />
//                         ))}
//                       </m.div>
//                     )}
//                   </>
//                 )}

//                 {currentPage === 1 && (
//                   <div className="grid grid-cols-2 gap-3">
//                     {itemsOrder.filter(item => item.favorite).map((data, idx) => (
//                       <MenuCards key={idx}
//                         onClickModal={showModal}
//                         data={data}
//                         onClickMinus={minusButtonHandler}
//                         onClickPlus={plusButtonHandler}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {currentPage === 2 && (
//                   <div className="flex flex-col">
//                     <OrderCart
//                       itemsOrder={itemsOrder}
//                       minusButtonHandler={minusButtonHandler}
//                       plusButtonHandler={plusButtonHandler}
//                       setCurrentPage={setCurrentPage}
//                       deleteItemHandler={deleteItemHandler}
//                       showModal={showModal}
//                     />
//                     <VoucherPromo
//                       totalPrice={totalPrice}
//                       setTotalPrice={setTotalPrice}
//                       discountAmount={discountAmount}
//                       setDiscountAmount={setDiscountAmount}
//                     />
//                     <PaymentCard
//                       radioChekced={radioChekced}
//                       setRadioChecked={setRadioChecked}
//                       handleChange={handleChange}
//                       totalPrice={totalPrice}
//                       discountAmount={discountAmount}
//                       onClickToMenu={() => setCurrentPage(0)}
//                     />
//                   </div>
//                 )}

//                 {currentPage === 3 && <AddProductPage />}
//                 {currentPage === 4 && <SalesSummary />}
//                 {currentPage === 5 && (
//                   <DailyReport
//                     onBack={() => setCurrentPage(0)}
//                     allMenuItems={allItems}
//                     setCurrentPage={setCurrentPage}
//                   />
//                 )}
//                 {currentPage === 6 && (
//                   <div className="p-4 max-w-4xl mx-auto mt-16">
//                     <DailyExpenseTracker selectedDate={new Date().toISOString().split("T")[0]} />
//                   </div>
//                 )}
//               </div>

//               <ModalCard
//                 detailModal={detailModal}
//                 show={openModal}
//                 setDetailModal={setDetailModal}
//                 onClick={(e) => closeModal(e, detailModal?.id)}
//                 onClose={(e) => closeModal(e, detailModal?.id)}
//               />
//             </div>
//           </m.div>
//         </div>
//       )}
//     </>
//   );
// }

// export default withAdminAuth(Order);