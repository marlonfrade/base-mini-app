"use client";
import { useEffect } from "react";
import { loadMockData } from "@/lib/mockData";

export default function AutoLoadMockData() {
  useEffect(() => {    
    loadMockData();
  }, []);

  return null; 
}
