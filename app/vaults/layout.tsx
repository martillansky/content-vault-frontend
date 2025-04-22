"use client";

import CommonLayout from "@/app/components/CommonLayout";
import React from "react";

export default function VaultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommonLayout showBackButton={false}>{children}</CommonLayout>;
}
