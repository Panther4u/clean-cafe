// src/app/lib/withAdminAuth.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withAdminAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin !== "true") {
        router.replace("/admin-login");
      }
    }, [router]);

    return <Component {...props} />;
  };
}
